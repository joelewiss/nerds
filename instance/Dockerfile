FROM node as build
WORKDIR /app/
COPY ./app/package*.json .
RUN npm install
COPY ./app/ .
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Fortunately the official rust container is built from the debian one so I can just substitute the rust container in
# FROM debian:stable-slim
FROM rust:1.86-slim
RUN apt-get update && DEBIAN_FRONTEND="noninteractive" apt-get install -yqq \
    build-essential \
    python3 \
    python3-dev \
    python3-flask \
    pulseaudio \
    tigervnc-standalone-server \
    matchbox-window-manager \
    firefox-esr \
    socat \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    runit && rm -rf /var/lib/apt/lists/*
RUN echo "load-module module-simple-protocol-tcp listen=127.0.0.1 format=s16le channels=2 rate=48000 record=true playback=false" > /etc/pulse/default.pa.d/simple-protocol.pa

RUN useradd -m --shell=/usr/bin/nologin user
WORKDIR /home/user

USER user

# Setup rust toolchain
# Updating the crates.io index takes a while but i don't think it can be avoided.
# Regardless of how you specify dependencies and their sources, their dependencies will use crates.io
RUN cargo install wasm-pack@~0.13
COPY --chown=user:user ./testing ./testing

# Setup EMSDK
#COPY --from=emscripten/emsdk /emsdk /emsdk
#ENV EMSDK=/emsdk \
#    EMSDK_NODE=/emsdk/node/14.18.2_64bit/bin/node \
#    PATH="/emsdk:/emsdk/upstream/emscripten:/emsdk/upstream/bin:/emsdk/node/14.18.2_64bit/bin:${PATH}"

#ADD https://deb.nodesource.com/setup_16.x /home/user/
#RUN bash setup_16.x && apt-get install -y nodejs

#ADD https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb /home/user
#RUN apt install -y ./google-chrome-stable_current_amd64.deb

#ADD https://github.com/novnc/noVNC/archive/refs/tags/v1.3.0.tar.gz /home/user/

ADD --chown=user:user https://github.com/novnc/websockify/archive/refs/tags/v0.10.0.tar.gz ./websockify.tar.gz
RUN tar -xf websockify.tar.gz \
    && rm websockify.tar.gz
RUN cd websockify-0.10.0 && make
#RUN tar -xf v1.3.0.tar.gz && chown -R user:user /home/user && mkdir app
#COPY --chown=user:user ./app/package.json ./app/
#RUN chown user:user app/
#RUN cd app && npm install

COPY --chown=user:user ./audio-proxy.sh .
COPY ./token.cfg /etc/websockify/token.cfg

COPY --chown=user:user ./services ./services
#COPY --chown=user:user ./app/ ./app/
#WORKDIR /home/user/app
COPY --chown=user:user ./firefox.py .
COPY --chown=user:user ./instance-api.py .
RUN mkdir ./tasks
COPY ./config.py .
COPY --from=build --chown=user:user /app/build /home/user/www
#RUN cd /home/user/app && \
#    npm run build && \
#    mkdir /home/user/www && \
#    cp -vr /home/user/app/build/* /home/user/www/

CMD ["/usr/bin/runsvdir", "/home/user/services"]
#CMD ["/bin/sh",
#    "Xvfb :1 -screen -o 1280x720x16",
#    "x11vnc -display :1.0 &",
#    "DISPLAY=:1.0 firefox &"]

#Xvfb :1 -screen 0 800x600x16
#x11vnc -display :1.0
#DISPLAY=:1.0 google-chrome-stable
