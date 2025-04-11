import { useState } from 'react';

const COMPILE_API_ENDPOINT = "../api/compile";

export default function WasmRunner(props) {
  const [stat, setStat] = useState("idle"); // can be idle, wait (compiling), run, or error
  const [lastTime, setLastTime] = useState(0); // Used for timing compilation times


  function print(out) {
    console.log("printing to output")
    console.log(out)
    props.setOutput(output => {
      if (out.startsWith("ubsan: type-mismatch by")) {
        // Controversial decision here, not all ubsan errors are segmentation
        // faults but I want it to be less confusing when a ubsan error appears
        // due to some bad code.
        return output + "Segmentation Fault\n";
      } else if (out.slice(-1) == "\n") {
        return output + out;
      } else {
        return output + out + "\n"
      }
    });
  }

  function runWasm(result, compile_time) {
    console.log("Attempting to run wasm file")
    //code is a javascript string of compiled wasm
    const compilation_status = result["result"];
    const compiler_out = result["compiler_output"];
    const taskno = result["taskno"];
    // js is the javascript code for loading the wasm
    var js = result["js"];
    setLastTime((new Date() - compile_time)/1000);

    print("*** Compiler Output ***");
    print(compiler_out);

    
    let module = {
      print: print,
      printErr: print,
      onExit: () => {console.debug("onExit"); setStat("idle");},
      onAbort: () => {console.debug("onAbort"); setStat("idle");},
    };



    if (result !== "error") {
      print("*** Program Output ***");
      setStat("run");
      try {
        // remove the last two lines
        js = js.trim().split('\n').slice(0. -2).join('\n');
        const mod = new Function(js + "\n__wbg_init();\nlibrary_main();")
        mod();
        console.log("SUCCESSFULLY RAN LIB MAIN")
      } catch (e) {
        console.log("ERROR RUNNING WASM: ", e);
      }

    }
  }

  function handleRun() {
    if (props.editor.current) {
      props.setOutput(""); // Clear output from previous run

      setStat("wait");
      const code = props.editor.current.getValue();
      const startTime = new Date();

      props.compile_code(code).then(json => {
        runWasm(json, startTime);
      }).catch(err => {
        setStat("error");
        print(`ERROR: Could not run code: ${err}`);
      });
    } else {
      console.debug("Slow down there bud! Wait until the editor is initialized to click the run button.");
    }
  }

  let buttonColor = "lightgreen";
  let buttonText = "Run"
  if (stat === "wait") {
    buttonColor = "#d0d004";
    buttonText = "Compiling..."
  } else if (stat == "run") {
    buttonColor = "#d0d004";
    buttonText = "Running..."
  } else if (stat === "error") {
    buttonColor = "#ff5a5a";
  }

  let lastTimeElm = (<></>);
  if (lastTime != 0) {
    lastTimeElm = (<span>Last compile time: {lastTime.toPrecision(2)}s</span>);
  }

  return (
    <>
      <button className="controlButton" style={{"backgroundColor": buttonColor}} onClick={handleRun}>
        <span className="glyphicon glyphicon-play" 
              style={{"marginRight": "5px"}}
              aria-hidden="true"></span>
        {buttonText}
      </button>
      {lastTimeElm}
    </>
  );
}

