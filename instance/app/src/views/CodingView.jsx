import { useState, useRef } from "react";
import "./CodingView.css";
import CodeEditor from "../components/CodeEditor";

export default function CodingView(props) {

  return (
    <div className="codingView">
      <CodeEditor
        taskno={props.taskno}
        task={props.task}
        editor_value={props.editor_value}
        set_editor_value={props.set_editor_value}
        submit={props.submit}
        editorRef={props.editorRef}
        output={props.output}
        compile_code={props.compile_code}
      />
    </div>
  );
}
