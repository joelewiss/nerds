import {useState} from "react";
import "./OutputBox.css";

function useOutput() {
  //output, print and clear functions
  const [output, setOutput] = useState("");

  const print = (msg) => {
    setOutput(output => {
      if (msg.slice(-1) === "\n") {
        return output + msg;
      } else {
        return output + msg + "\n"
      }
    });
  };

  const clear = () => {setOutput("")};

  return [output, print, clear];
}

export default function OutputBox(props) {
  // TODO: Do some scrolling to the bottom
  return (
    <div className="outputBox">
      <span className="outputBox-title">{props.title ? props.title : "Output"}</span>
      <pre>{props.output}</pre>
    </div>
  );
}
