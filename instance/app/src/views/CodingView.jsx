import { useState, useRef } from "react";
import "./CodingView.css";
import CodeEditor from "../components/CodeEditor";

export default function CodingView(props) {
  const [suggestions, set_suggestions] = useState([]);


  return (
    <div className="codingView">
      <CodeEditor
        placeholder_code={props.placeholder_code}
        submit={props.submit}
        editorRef={props.editorRef}
        output={props.output}
        current={props.current}
        confirmed={props.confirmed}
        compile_code={props.compile_code}
        real_taskno={props.real_taskno}
      />
    </div>
  );
}
