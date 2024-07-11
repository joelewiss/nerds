/**
 * Audio plugin for NoVNC
 * A drop-in plugin for out-of-band audio playback
 * 
 * Copyright (C) 2023 Mehrzad Asri
 * Adapted by Joe Lewis (2024)
 * Licensed under MPL 2.0
 *
 * Downloaded from https://raw.githubusercontent.com/me-asri/noVNC-audio-plugin/main/audio-plugin.js
 */
import {DEV_MODE} from "../util";


// Dummy handler for NVUI functions
const NVUI = {
    settings: {
        audio_codec: "opus",
        audio_bitrate: "96000", //98kbps
        audio_samplerate: "48000", //48k

        audio_host: DEV_MODE ? "192.168.1.35" : window.location.host,
        audio_port: DEV_MODE ? 82 : 443,
        audio_path: DEV_MODE ? "?token=audio" : `${window.location.pathname}?token=audio`,
        audio_encrypt: DEV_MODE ? false : true
    },

    showStatus(msg, level) {
        console.debug(`NVUI:${level} ${msg}`);
    },

    getSetting(key) {
        return this.settings[key];
    }
}

// Helper class for using MediaSource with data segments
class MediaSourcePlayer {
    static #BUFFER_MIN_REMAIN = 30;

    static #DRIFT_CHECK_INTERVAL = 5000;
    static #DRIFT_MAX_TOLERANCE = 0.5;

    mediaSource;
    sourceBuffer;

    #directFeed = true; // First data is always fed directly
    #dataQueue = [];

    #attachedEl;
    #driftCheckTimer;

    #onPlayCallback = (event) => {
        const elem = event.target;

        // Make sure we're always playing the live edge of the stream
        // Mostly necessary if some external entity decided to pause the media
        if (this.sourceBuffer.buffered.length > 0) {
            elem.currentTime = this.sourceBuffer.buffered.end(0);
        }

        // Workaround: Use a slightly faster playback speed to minimize drift
        elem.playbackRate = 1.003;
    };

    constructor(mime) {
        this.mediaSource = new MediaSource();

        this.mediaSource.addEventListener('sourceopen', () => {
            // See https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter for more
            this.sourceBuffer = this.mediaSource.addSourceBuffer(mime);

            // Playback media segments in the same order they are inserted in
            this.sourceBuffer.mode = 'sequence';

            this.sourceBuffer.addEventListener('updateend', () => {
                // Stop here if for whatever reason the source buffer is still updating
                if (this.sourceBuffer.updating) {
                    return;
                }

                // Do a direct feed next time if queue is empty
                if (this.#dataQueue.length == 0) {
                    this.#directFeed = true;
                    return;
                }

                // Get next data from queue and add it to the source buffer
                const data = this.#dataQueue[0];

                try {
                    this.sourceBuffer.appendBuffer(data);
                    this.#dataQueue.shift();
                } catch (err) {
                    // If quota full, drop some of buffer
                    // See https://developer.chrome.com/blog/quotaexceedederror
                    if (err.name == 'QuotaExceededError') {
                        console.debug('SourceBuffer quota exceeded. Emptying buffer.');
                        this.#emptyBuffer();

                        if (!this.sourceBuffer.updating) {
                            this.sourceBuffer.appendBuffer(data);
                            this.#dataQueue.shift();
                        }
                        return;
                    }
                    else {
                        throw err;
                    }
                }
            });
        }, { once: true });
    }

    async attach(element) {
        if (this.#attachedEl) {
            throw new Error('Already attached to an element');
        }

        element.src = URL.createObjectURL(this.mediaSource);
        this.#attachedEl = element;

        return new Promise((resolve) => {
            this.mediaSource.addEventListener('sourceopen', () => {
                element.addEventListener('play', this.#onPlayCallback);

                // Occasionally check for drift and resync playback
                this.#driftCheckTimer = setInterval(() => this.#checkDrift(), MediaSourcePlayer.#DRIFT_CHECK_INTERVAL);

                resolve();
            }, { once: true });
        });
    }

    async detach() {
        if (this.#attachedEl) {
            this.#attachedEl.removeEventListener('play', this.#onPlayCallback);
            this.#attachedEl.playbackRate = 1;

            await this.#attachedEl.pause();
            this.#attachedEl.removeAttribute('src');
            this.#attachedEl.currentTime = 0;

            this.#attachedEl = null;
        }

        if (this.#driftCheckTimer) {
            clearInterval(this.#driftCheckTimer);
            this.#driftCheckTimer = null;
        }
    }

    feed(data) {
        if (!this.#attachedEl) {
            throw new Error('Not attached to any elements');
        }
        if (this.mediaSource.readyState != 'open') {
            throw new Error(`Bad MediaSource state: ${this.mediaSource.readyState}`);
        }

        // Feed directly if direct feed is enabled otherwise queue data
        if (this.#directFeed) {
            try {
                this.sourceBuffer.appendBuffer(data);
            } catch (err) {
                if (err.name == 'QuotaExceededError') {
                    this.#emptyBuffer();

                    if (this.sourceBuffer.updating) {
                        this.#directFeed = false;
                        this.#dataQueue.push(data);
                    } else {
                        this.sourceBuffer.appendBuffer(data);
                    }
                }
            }

            // Disable direct feed if source buffer is updating
            if (this.sourceBuffer.updating) {
                this.#directFeed = false;
            }
        } else {
            this.#dataQueue.push(data);
        }
    }

    #emptyBuffer() {
        const bufferEnd = this.sourceBuffer.buffered.end(0);
        const removeEnd = bufferEnd - MediaSourcePlayer.#BUFFER_MIN_REMAIN;

        this.sourceBuffer.remove(0, (removeEnd <= 0) ? 1 : removeEnd);
    }

    #checkDrift() {
        if (this.#attachedEl.paused) {
            return;
        }
        if (this.sourceBuffer.buffered.length == 0) {
            return;
        }

        const drift = this.sourceBuffer.buffered.end(0) - this.#attachedEl.currentTime;
        if (drift > MediaSourcePlayer.#DRIFT_MAX_TOLERANCE) {
            console.debug(`${drift} drift exceeding tolerance, resyncing`);
            this.#attachedEl.currentTime = this.sourceBuffer.buffered.end(0);
        }
    }
}

// Helper functions for the audio proxy
const AudioProxy = {
    handshake(socket, codec = 'opus', bitrate = 96000, sampleRate = 48000, secret = null) {
        const textEnc = new TextEncoder();
        const textDec = new TextDecoder();

        let handshakeMsg = `CD:${codec}\nBR:${bitrate}\nSR:${sampleRate}\n\n`;
        if (secret != null) {
            handshakeMsg += `sec:${secret}`;
        }
        handshakeMsg += `\n`;
        socket.send(textEnc.encode(handshakeMsg));

        return new Promise((resolve) => {
            socket.addEventListener('message', (msg) => {
                const resp = textDec.decode(msg.data).trim();
                if (resp == 'READY') {
                    resolve();
                } else if (resp.startsWith('ERR:')) {
                    throw new Error(`Proxy error: ${resp.substring(4)}`);
                } else {
                    throw new Error('Protocol error');
                }
            }, { once: true });
        });
    }
};

export default class AudioPlugin {
    msp;
    ws;
    audioEl;

    async onClickPlayHandler() {
        try {
            await this.audioEl.play();
        } catch (err) {
            if (err.name != 'AbortError') {
                NVUI.showStatus(`Audio playback failed: ${err.message}`, 'error');
            }
            await this.stopAudio();
        }
    }

    async startAudio() {
        if (this.msp) {
            return;
        }

        const codec = NVUI.getSetting('audio_codec');
        const bitrate = NVUI.getSetting('audio_bitrate');
        const samplerate = NVUI.getSetting('audio_samplerate');
        let mime;
        switch (codec) {
            case 'opus':
                mime = 'audio/webm; codecs="opus"';
                break;
            case 'aac':
                mime = 'audio/mp4; codecs="mp4a.40.2"';
                break;
            default:
                throw new Error(`Unsupported codec ${codec}`);
        }

        const wsSchema = (NVUI.getSetting('audio_encrypt')) ? 'wss://' : 'ws://';
        const wsHost = NVUI.getSetting('audio_host');
        const wsPort = NVUI.getSetting('audio_port');
        const wsPath = NVUI.getSetting('audio_path');

        this.ws = new WebSocket(`${wsSchema}${wsHost}:${wsPort}/${wsPath}`);
        this.ws.binaryType = 'arraybuffer';

        this.ws.addEventListener('error', async () => {
            if (NVUI.connected) {
                NVUI.showStatus('Audio WebSocket connection failed', 'error');
            }
            await this.stopAudio();
        });
        this.ws.addEventListener('close', async () => {
            if (!this.msp) {
                return;
            }

            if (NVUI.connected) {
                NVUI.showStatus('Audio WebSocket connection closed', 'error');
            }
            await this.stopAudio();
        });

        this.ws.addEventListener('open', async () => {
            try {
                this.msp = new MediaSourcePlayer(mime);
                await this.msp.attach(this.audioEl);
            } catch (err) {
                NVUI.showStatus(`MediaSource initialization failed: ${err.message}`);

                await this.stopAudio();
                return;
            }

            try {
                await AudioProxy.handshake(this.ws, codec, bitrate, samplerate);
            } catch (err) {
                NVUI.showStatus(`Audio handshake failed: ${err.message}`, 'error');

                await this.stopAudio();
                return;
            }

            this.ws.addEventListener('message', async (msg) => {
                try {
                    this.msp.feed(msg.data);
                } catch (err) {
                    NVUI.showStatus(`Audio failure: ${err.message}`, 'error');

                    await this.stopAudio();
                    return;
                }
            });

            // Start playing audio on user click
            // Necessary because most if not all browsers prevent autoplay
            document.body.addEventListener('click', async () => this.onClickPlayHandler(), { capture: true, once: true });
        });
    }

    async stopAudio() {
        if (this.msp) {
            await this.msp.detach();
            this.msp = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    initUi() {
        // == Audio element ==
        this.audioEl = document.createElement('audio');
        this.audioEl.id = 'noVNC_audio';

        document.body.appendChild(this.audioEl);

    }

    removeUi() {
        this.audioEl.remove();
    }
};
