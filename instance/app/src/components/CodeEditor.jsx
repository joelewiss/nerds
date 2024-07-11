import { useState, useEffect } from 'react';
import OutputBox from "./OutputBox";
import WasmRunner from "./WasmRunner";
import ControlButton from "./ControlButton";
import useTaskState from "../hooks/useTaskState";
import useSavedState from "../hooks/useSavedState";
import {isUndefined} from "../util";
import "./CodeEditor.css";

import Editor from "@monaco-editor/react";

export default function CodeEditor(props) {
  // state that we have from props:
  // suggestions  <array>     snippet suggestions
  // real_taskno  <int>       task number in the original ordering
  // output       <string>    the code output
  // current      <int>       current snippet selected by user
  // editorRef    <ref>       Reference to the editor instance
  const [current, setCurrent] = props.current
  const [output, setOutput] = props.output;
  const real_taskno = props.real_taskno;
  /*const [editorValue, setEditorValue] = useTaskState("editorValue", real_taskno, {"confirmed": false, value: ""});*/
  const [editorValue, setEditorValueBackend] = useTaskState("editorValue", real_taskno, "");
  const [editorDefaultValue, setEditorDefaultValue] = useState("");
  const [confirmed, setConfirmed] = useTaskState("confirmed", real_taskno, false);

  /* Used to store if we've loaded the saved state into the monaco model */
  const [loadedArr, setLoadedArr] = useState([]);
  const loaded = isUndefined(loadedArr[real_taskno]) ? false : loadedArr[real_taskno];
  const setLoaded = (v) => setLoadedArr(loadedArr => {
    loadedArr[real_taskno] = v;
    return loadedArr;
  });

  if (real_taskno == undefined) {
    console.error("real_taskno is undefined");
  }

  function handleEditorDidMount(editor, monaco) {
    console.debug("handleEditorDidMount");
    props.editorRef.current = editor;

  }

  function handleBeforeUnload(e) {
    e.preventDefault();
  }

  function setEditorValue(v) {
    if (props.editorRef.current && typeof v === "string") {
      // Do this to avoid triggering our own onEditorDidChange method when we set the editor value
      props.editorRef.current.setValue(v);
      setEditorValueBackend(v);
    } else if (!props.editorRef.current && typeof v === "string") {
      console.debug("setEditorValue called before editor finished mounting, dropping value to default storage");
      setEditorDefaultValue(v);
      setEditorValueBackend(v);
    } else if (typeof v !== "string") {
      throw new Error(`setEditorValue called with an ${typeof v}, must be called with a string`);
    }
  }

  function handleNext() {
    props.submit("a");
    setCurrent(current => {
      const newVal = current + 1 >= props.suggestions.length ?
        0 : current + 1;
      setConfirmed(false);
      setEditorValue(props.suggestions[newVal]);

      /*setEditorValue({
        "confirmed": false,
        "value": props.suggestions[newVal]
      });*/
      return newVal;
    });
  }

  function handlePrev() {
    props.submit("b");
    setCurrent(current => {
      const newVal = current === 0 ? props.suggestions.length - 1 : current - 1;
      setConfirmed(false);
      setEditorValue(props.suggestions[newVal]);
      /*
      setEditorValue({
        "confirmed": false,
        "value": props.suggestions[newVal]
      });*/
      return newVal;
    });
  }

  function handlePick() {
    props.submit("c");
    setConfirmed(true);
    /*
    setEditorValue(editorValue => {return {
      "confirmed": true,
      "value": editorValue.value
    }});*/
    setOutput(""); //clear output
  }

  function handleBack() {
    if (window.confirm("Are you sure you want to go back to suggestions? You will loose any edits you've made to this snippet.")) {
      props.submit("t");
      setConfirmed(false);
      setEditorValue(props.suggestions[current]);
      /*
      setEditorValue({
        "confirmed": false,
        "value": props.suggestions[current]
      });*/
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
      e.preventDefault();
    }
  }

  function handleEditorDidChange(value, e) {
    console.debug(`Handling editor did change on task ${real_taskno}`);
    if (value === "") {
      /*console.warn("Clearing out the editor entirely, make sure the user wanted this!");
       * TODO: This is a weird bug, when switching tasks this callback is fired
       * with an empty string. This is a simple hack to ignore updates with an
       * empty string. Not sure why they happen though. I'm bad at React. */
    } else {
      setEditorValueBackend(value);
      /*
      setEditorValue(editorValue => {return {
        "confirmed": ditorValue.confirmed,
        "value": value
      }});*/
    }
  }

  // Setup listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (confirmed) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }


    return (() => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });
  });


  // Update the editor if the suggestions change 
  /*
  useEffect(() => {
    if (props.suggestions.length > current && !confirmed) {
      console.debug("Forcing change to editor value since current or props.suggestions changed");
      console.debug(`Confirmed: ${confirmed}`);
      setEditorValue(props.suggestions[current]);
      /*
      setEditorValue({
        "confirmed": false,
        "value": props.suggestions[current]
      });*/
    /*}
    }, [props.suggestions, current, confirmed]);*/

  useEffect(() => {
    if (confirmed && !loaded) {
      // This loads the stored value in the state and sets the editors value
      console.debug("Loading modal value from storage");
      setEditorValue(editorValue);
      setLoaded(true);
    } else if (!confirmed && props.suggestions.length != 0) {
      console.debug("Forcing change to editor value since current or props.suggestions changed");
      setEditorValue(props.suggestions[current]);
    }
  }, [confirmed, props.suggestions, current]); // I am excluding editorValue on purpose here so this does not fire every time editorValue changes

  let controlsElement;
  let outputElement;
  if (props.suggestions.length === 0) {
    return (<div id="editorContainer"></div>);
  } else if (confirmed) {
    controlsElement = (
      <div id="controlsBox">
        <button onClick={handleBack} className="controlButton" style={{"backgroundColor": "#ff8787"}}>Back to suggestions</button>
        <WasmRunner
          editor={props.editorRef}
          output={output}
          setOutput={setOutput}
          compile_code={props.compile_code}
          real_taskno={props.real_taskno} />
      </div>);
    outputElement = (<OutputBox output={output}/>);

  } else {
    controlsElement = (
      <div id="controlsBox">
        <ControlButton onClick={handlePrev} title="Previous Suggestion" />
        <ControlButton onClick={handleNext} title="Next Suggestion" />
        <ControlButton onClick={handlePick} id="pickButton" title="Pick and Edit" />
        <span className="hint">Suggestion <span className="suggestionNumber">{current+1}</span>/{props.suggestions.length}</span>
      </div>);
  }

  return (
    <div id="editorContainer">
      {controlsElement}
      <Editor
        language={confirmed ? "c" : "plain"}
        options={{domReadOnly: !confirmed, readOnly: !confirmed}}
        path={`task${real_taskno}`}
        defaultValue={editorDefaultValue}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorDidChange}
        wrapperProps={{"style":{"flex":"2 1 400px", "minHeight":"200px", "padding": "0.5em"}}}
        keepCurrentModel={true}
        className="editorBox"
      />
      {outputElement}
    </div>
  )
}
