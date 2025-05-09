import { useState, useEffect } from 'react';
import ResetCodeButton from "./ResetCodeButton";
import OutputBox from "./OutputBox";
import WasmRunner from "./WasmRunner";
import ControlButton from "./ControlButton";
import useTaskState from "../hooks/useTaskState";
import useSavedState from "../hooks/useSavedState";
import {isUndefined} from "../util";
import "./CodeEditor.css";
import { createHighlighter } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { Editor, useMonaco } from "@monaco-editor/react";


const EDITOR_THEME = "dark-plus"
const EDITOR_LANG = "rust"


async function setupShikiMonaco(monaco) {
  const highlighter = await createHighlighter({
    themes: [EDITOR_THEME],
    langs: [EDITOR_LANG],
  })

  // Register only the languages you plan to use
  monaco.languages.register({ id: EDITOR_LANG })

  // Inject Shiki themes and syntax rules into Monaco
  await shikiToMonaco(highlighter, monaco)
  monaco.editor.setTheme(EDITOR_THEME)
}


export default function CodeEditor(props) {
  // state that we have from props:
  // real_taskno  <int>       task number in the original ordering
  // output       <string>    the code output
  // editorRef    <ref>       Reference to the editor instance
  const [loaded, setLoaded] = useState(false)
  const [output, setOutput] = props.output;
  const taskno = props.taskno
  const editorValue = props.editor_value;
  const setEditorValueBackend = props.set_editor_value;
  const placeholder_code = props.task.placeholder_code;
  const fixed = props.task.fixed;

  // setup additional syntax highlighting
  let monaco = useMonaco()
  useEffect(() => {
    if(monaco) {
      setupShikiMonaco(monaco).then(() => {
        setLoaded(true)
      })
    }
  }, [monaco])


  if (props.taskno == undefined) {
    console.error("real_taskno is undefined");
  }

  function handleEditorDidMount(editor, monaco) {
    console.debug("handleEditorDidMount");
    props.editorRef.current = editor;

  }

  function handleBeforeUnload(e) {
    e.preventDefault();
  }
  

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      //if (e.shiftKey) {
      //  handlePrev();
      //} else {
      //  handleNext();
      //}
      e.preventDefault();
    }
  }

  function handleEditorDidChange(value, e) {
    console.debug(`Handling editor did change on task ${props.taskno}`);
    setEditorValueBackend(value);
  }

  // Setup listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return (() => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });
  });


  if (!loaded) return <div>Loading editor...</div>
  return fixed ? (
    <></>
  ) : (
    <div id="editorContainer">
      
      <div id="controlsBox">
        <WasmRunner
          editor={props.editorRef}
          output={output}
          setOutput={setOutput}
          compile_code={props.compile_code}
          taskno={props.taskno} />
          <ResetCodeButton
            onConfirm={() => {
              props.editorRef.current.setValue(placeholder_code);
            }} />
      </div>
      <Editor
        language='rust'
        defaultLanguage='rust'
        options={{domReadOnly: false, readOnly: false}}
        path={`task${props.taskno}`}
        defaultValue={editorValue}
        theme={EDITOR_THEME}
        onMount={handleEditorDidMount}
        onChange={handleEditorDidChange}
        wrapperProps={{"style":{"flex":"2 1 400px", "minHeight":"200px", "padding": "0.5em"}}}
        keepCurrentModel={true}
        className="editorBox" />
      <OutputBox output={output}/>
    </div>
  )
}
