import './App.css';
import {useState, useEffect, useRef} from 'react';
import CodingView from "./views/CodingView";
import BrowserView from "./views/BrowserView";
import StatusDot from "./components/StatusDot";
import TaskController from "./components/TaskController";
import TabNav from "./components/TabNav";
import TabView from "./components/TabView";
import Header from "./components/Header";
import useFocusTime from "./hooks/useFocusTime";
import useSavedState from "./hooks/useSavedState";
import useTaskState from "./hooks/useTaskState";
import {submit, compile} from "./services";

function App() {
  const [tab, setTab] = useSavedState("tab", "code");
  const [connStatus, setConnStatus] = useState(false);
  const [taskno, set_taskno] = useSavedState("taskno", 0);
  const [task_list, set_task_list] = useSavedState("task_list", [
    {placeholder_code:"There will be some rust code for printing the list",desc:"<h1 id=\"add-item\">Print List</h1>",task_no:1},
    {placeholder_code:"Code for inserting an item into the list",desc:"<h1 id=\"update-item\">Update item</h1>",task_no:2},
    {placeholder_code:"Code for removing an item from the list",desc:"<h1 id=\"remove-item\">Remove item</h1>",task_no:3},
    {placeholder_code:"Code for swapping items in the list",desc:"<h1>Swap Items</h1>",task_no:4},
    {placeholder_code:"","fixed":true,desc:"You have finished all of the tasks. Click finish below to take a quick exit survey.",task_no:5}
  ]);
  const [outputs, set_outputs] = useSavedState("output", ["", "", "", "", "", ""])
  //const [output, set_output] = useTaskState("output", taskno, "");
  const [editorValues, setEditorValues] = useSavedState("editorValue", task_list.map(t => t.placeholder_code));

  const task = task_list[taskno];

  // pseudo state for value in state array
  const editor_value = editorValues[taskno];
  const set_editor_value = new_value => {
    setEditorValues(
      editorValues.map((item, i) => (i===taskno) ? new_value: item)
    )
  }
  if (task.placeholder_code != "" && (editor_value==null || editor_value=="")) {
    set_editor_value(task.placeholder_code)
  }

  const output = outputs[taskno];
  const set_output = new_value => {
    set_outputs(
      outputs.map((item, i) => (i===taskno) ? new_value: item)
    )
  }

  

  const editorRef = useRef(null);
  const focus_time = useFocusTime();

  // Cheat to hide noVNC cursor on tab switch since it exists outside of the react DOM
  useEffect(() => {
    if (tab !== "browser") {
      document.body.querySelectorAll("canvas").forEach((canvas) => {
        if (canvas.style.position == "fixed") {
          console.debug("Hiding fixed canvas");
          canvas.style.display = "none";
        }
      });
    } else {
      document.body.querySelectorAll("canvas").forEach((canvas) => {
        if (canvas.style.position == "fixed") {
          console.debug("Showing fixed canvas");
          //canvas.hidden = false;
          canvas.style.display = null;
        }
      });
    }
  }, [tab]);

  function submit_code(statusCode, extraData) {
    // Do some submitting
    /* Submit format
     * {
     *  type: [code]
     *  code: custom code format
     *  time: {focusTime: focusTime}
     *  status: <status code, one letter>
     * }
     */
    /* Code format
     * {
     *  editor: <str> Whatever is in the editor, either a suggestion or a code snippet
     *  taskno: <int> What task number the user is on
     *  output: <str, optional> Any code output
     *  hist: <object> Firefox history, added by backend before being sent to database
     * }
     */
    /* Status Codes
     *  n   next task
     *  s   skip task
     *  p   previous task
     *  a   previous suggestion
     *  b   next suggestion
     *  c   pick suggestion
     *  r   run code
     *  t   back to suggestions (quit editor)
     *  e   browser error
     */
    let data = {
      "type": "code",
      "code": {"taskno": taskno},
      "time": {"focus_time": focus_time},
      "status": statusCode
    }

    console.debug(`submit ${statusCode}`);
    if (editorRef.current) {
      data.code.editor = editorRef.current.getValue();
    }
    if (output) {
      data.code.output = output;
    }
    if (extraData) {
      data.code.extra_data = extraData;
    }
    submit(data);
  }

  function compile_code(code) {
    submit_code("r");
    return compile({code: code, taskno: taskno});
  }

  /* Setup error handlers */
  function handleError(e) { 
    let data = {};
    if (e instanceof PromiseRejectionEvent) {
      // Quietly ignore this error, we'll see it in other data
      if (e.reason instanceof WebAssembly.RuntimeError) return;

      data = {reason: e.reason};
    } else {
      data = {
        message: e.message,
        source: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      }
    }
    submit_code("e", data);
  }

  useEffect(() => {
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError)
    };
  });

  return (
    <>
      <Header />
      <div className="container-fluid main">
        <TaskController
          taskno={[taskno, set_taskno]}
          task_list={[task_list, set_task_list]}
          submit={submit_code}
        />
        <div className="views-container">
          <div className="navBar">
            <TabNav tab={tab} setTab={setTab}/>
            <div className="statusBar">
              <StatusDot label="Connection" status={connStatus}/>
            </div>
          </div>
          <div className="tab-views">
            <TabView tabName="code" currentTab={tab}>
              <CodingView
                taskno={taskno}
                task={task_list[taskno]}
                editor_value={editor_value}
                set_editor_value={set_editor_value}
                submit={submit_code}
                editorRef={editorRef}
                output={[output, set_output]}
                compile_code={compile_code}
              />
            </TabView>

            <TabView tabName="browser" currentTab={tab}>
              {/*We pass current tab so BrowserView can see when the user
              switches tabs and when it needs to compute a resize for the
              window*/}
              <BrowserView setConnStatus={setConnStatus} currentTab={tab}/>
            </TabView>
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
