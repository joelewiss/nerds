import { useState } from 'react';

const COMPILE_API_ENDPOINT = "../api/compile";

export default function WasmRunner(props) {
  const [stat, setStat] = useState("idle"); // can be idle, wait (compiling), run, or error
  const [lastTime, setLastTime] = useState(0); // Used for timing compilation times


  function print(out) {
    console.log("printing to output")
    console.log(out)
    props.setOutput(out.trim());
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
    console.log(compiler_out);
    return
    
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
        const lines = js.trim().split('\n');
        console.log("LINES: ", lines)
        js = js.trim().split('\n').slice(0, -3).join('\n').replace(/\bexport\b/g, '') + "\n__wbg_init();\nlibrary_main();";
        console.log("Javascript exec string: ", js);
        const mod = new Function(js)

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

