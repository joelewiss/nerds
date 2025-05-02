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
import ReferenceView from './views/ReferenceView';

const DEFAULT_TASK_LIST = [
  {
    "placeholder_code": "impl LinkedList {\n  pub fn print(&self) {\n    todo!()\n  }\n}\n    ",
    "desc": `<h1>Print List</h1>
  <div>
    <p>The first task is to create a method for printing the linked list which will iteratively travel through the list and print its contents to the terminal in the format:</p>
    <p><code>[value1, value2, value3, …, valueN]</code></p>
    <p>This task is designed to provide you with an opportunity to familiarize yourself with Rust before working with its more complex functionality.</p>
  </div>`,
    "task_no": 1
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Insert a new node into the list at index with val\n  pub fn insert(&mut self, val: i32, index: usize) -> Result<(), String> {\n    todo!()\n  }\n}",
    "desc": `<h1>Insert</h1>
  <div>
    <p>The second task is to create an insert method. This method takes an item to insert into the list and an index to insert it at.</p>
    <p>If given a position in the middle of the list, it is assumed that the elements from then onwards will shift to the right - for example, given the linked list <code>[1, 2, 4, 5]</code> and told to insert 3 at position 2, the list should then become <code>[1, 2, 3, 4, 5]</code>.</p>
    <p>If the given position is outside of the list's bounds, you must handle this by returning a <code>Result::Err</code>.</p>
  </div>`,
    "task_no": 2
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Remove and return the node at the provided index\n  pub fn remove(&mut self, index: usize) -> Result<Box<LinkedListNode>, String> {\n    todo!()\n  }\n}\n",
    "desc": `<h1>Remove</h1>
  <div>
    <p>The third task is to create a remove method. This method takes an index in the list and removes that item from the list, returning it.</p>
    <p>If the given index is in the middle of the list, it is expected that the nodes after it will shift to the left - for example, given list <code>[1, 2, 7, 3, 4]</code> and told to remove position 2, the list should then be <code>[1, 2, 3, 4]</code>.</p>
    <p>If the given index is outside the list's bounds, similar to the previous task, you must handle this by returning a <code>Result::Err</code>.</p>
  </div>`,
    "task_no": 3
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Swap the nodes at indices a and b\n  pub fn swap(&mut self, a: usize, b: usize) -> Result<(), String> {\n    todo!()\n  }\n}\n",
    "desc": `<h1>Swap</h1>
  <div>
    <p>The fourth task is to create a swap method. This method takes two indices into the list and swaps the nodes present at those indices.</p>
    <p>For example, given the list <code>[1, 2, 3, 4]</code> and told to swap positions 1 and 3, the list should then be <code>[1, 4, 3, 2]</code>.</p>
    <p>Note that you cannot mutably access the nodes' values, so you must swap the nodes themselves rather than their values.</p>
    <p>If any one of the given indices is out of bounds, similar to the previous two tasks, you must handle this by returning a <code>Result::Err</code>.</p>
  </div>`,
    "task_no": 4
  },
  {
    "placeholder_code": "",
    "fixed": true,
    "desc": "You have finished all of the tasks! Click finish below to take a quick exit survey.",
    "task_no": 5
  }
];


function App() {
  const [tab, setTab] = useSavedState("tab", "code");
  const [connStatus, setConnStatus] = useState(false);
  const [taskno, set_taskno] = useSavedState("taskno", 0);
  const [task_list, set_task_list] = useSavedState("task_list", DEFAULT_TASK_LIST);
  const [outputs, set_outputs] = useSavedState("output", ["", "", "", "", "", ""])
  //const [output, set_output] = useTaskState("output", taskno, "");
  const [editorValues, setEditorValues] = useSavedState("editorValue", task_list.map(t => t.placeholder_code));
  const editorRef = useRef(null);
  const focus_time = useFocusTime();
  const task = task_list[taskno];

  // pseudo state for value in state array
  const editor_value = editorValues[taskno];
  const set_editor_value = new_value => {
    setEditorValues(
      editorValues.map((item, i) => (i===taskno) ? new_value: item)
    );
  }
  if (task.placeholder_code != "" && (editor_value==null || editor_value=="")) {
    set_editor_value(task.placeholder_code)
  }

  const output = outputs[taskno];
  const set_output = new_value => {
    new_value = new_value ?? ""
    set_outputs(
      outputs.map((item, i) => (i===taskno) ? new_value : item)
    )
  }


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
            <TabView tabName="reference" currentTab={tab}>
              <ReferenceView />
            </TabView>
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
