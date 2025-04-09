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
import {isUndefined} from "./util";

function App() {
  const [tab, setTab] = useSavedState("tab", "code");
  const [connStatus, setConnStatus] = useState(false);
  const [taskno, set_taskno] = useSavedState("taskno", 1); /* The current task in the task list after randomization + 1 */
  const [task_list, set_task_list] = useSavedState("task_list", []);
  const placeholder_code = isUndefined(task_list[taskno-1]) ? [] : task_list[taskno-1].placeholder_code;
  const real_taskno = isUndefined(task_list[taskno-1]) ? 1 : task_list[taskno-1].task_no; /* The current task in the original ordering + 1 */
  const [current, set_current] = useTaskState("current", real_taskno, 0); /* Current suggestion that's selected by the user */
  const [output, set_output] = useTaskState("output", real_taskno, "");
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
      "code": {"taskno": taskno, "real_taskno": real_taskno},
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
    return compile({code: code, taskno: real_taskno});
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
          current={[current, set_current]}
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
                placeholder_code={placeholder_code}
                submit={submit_code}
                editorRef={editorRef}
                current={[current, set_current]}
                output={[output, set_output]}
                compile_code={compile_code}
                real_taskno={real_taskno}
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
