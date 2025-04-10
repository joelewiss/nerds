import { useState, useRef } from "react";
import "./CodingView.css";
import CodeEditor from "../components/CodeEditor";

export default function CodingView(props) {
  const [suggestions, set_suggestions] = useState([]);


  return (
    <div className="codingView">
      <CodeEditor
        taskno={props.taskno}
        placeholder_code={props.placeholder_code}
        submit={props.submit}
        editorRef={props.editorRef}
        output={props.output}
        compile_code={props.compile_code}
      />
    </div>
  );
}
