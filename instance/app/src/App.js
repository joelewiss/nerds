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
    "desc": "<h1>Print List</h1>\n<div>\n    <p>\n      Your first task is to create a method for printing the contents of the linked list to the terminal.\n      This task is designed to provide you with an opportunity to familiarize yourself with Rust before tackling the other tasks.\n    </p>\n    <p>\n      There are no tests for this task, so you decide when your implementation is good enough.\n    </p>\n    <p>\n      Your method should traverse the list from head to tail and print each value in order.\n      Feel free to format the output however you'd like (e.g., comma-separated, one value per line, enclosed in brackets, etc.).\n      The goal is simply to help you verify that your linked list is storing data correctly.\n    </p>\n    <p>\n      Once you’re satisfied with the output, move on to the next task.\n    </p>\n</div>\n",
    "task_no": 1
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Insert a new node into the list at index with val\n  pub fn insert(&mut self, val: i32, index: usize) -> Result<(), String> {\n    todo!()\n  }\n}",
    "desc": "<h1>Insert</h1>\n<div>\n    <p>\n        Your second task is to implement an <code>insert</code> method for your linked list.\n        This method should take two arguments: the item to insert and the index at which to insert it.\n    </p>\n    <p>\n        Inserting an element at a specific position should shift all subsequent elements to the right.\n        For example, given the list <code>[1, 2, 4, 5]</code> and an instruction to insert <code>3</code> at position <code>2</code>,\n        the resulting list should be <code>[1, 2, 3, 4, 5]</code>.\n    </p>\n    <p>\n        Your implementation must correctly handle edge cases such as inserting at the head or the tail of the list.\n        If the provided index is out of bounds (i.e., greater than the length of the list), your method should return a <code>Result::Err</code>.\n    </p>\n</div>\n",
    "task_no": 2
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Remove and return the node at the provided index\n  pub fn remove(&mut self, index: usize) -> Result<Box<LinkedListNode>, String> {\n    todo!()\n  }\n}\n",
    "desc": "<h1>Remove</h1>\n<div>\n  <p>\n      Your third task is to implement a <code>remove</code> method for your linked list.\n      This method should take an index and remove the node at that position from the list, returning it.\n  </p>\n  <p>\n      Removing a node should cause the subsequent nodes to shift left to fill the gap.\n      For example, given the list <code>[1, 2, 7, 3, 4]</code> and a request to remove the item at index <code>2</code>,\n      the resulting list should be <code>[1, 2, 3, 4]</code>, and the returned value should be <code>7</code>.\n  </p>\n  <p>\n      Your implementation must handle removal from any valid index, including the head and the tail.\n      If the given index is outside the bounds of the list, your method should return a <code>Result::Err</code>,\n      just like in the previous task.\n  </p>\n</div>\n",
    "task_no": 3
  },
  {
    "placeholder_code": "impl LinkedList {\n  /// Swap the nodes at indices a and b\n  pub fn swap(&mut self, a: usize, b: usize) -> Result<(), String> {\n    todo!()\n  }\n}\n",
    "desc": "<h1>Swap</h1>\n<div>\n    <p>\n        Your fourth task is to implement a <code>swap</code> method for your linked list.\n        This method should take two indices and swap the nodes located at those positions in the list.\n    </p>\n    <p>\n        The value stored in each node is immutable, so you will need to swap the nodes themselves rather than their values.\n        This means you'll need to manipulate <code>Box</code>es in order to swap the nodes. The overall structure of the list should remain intact,\n        with only the positions of the two specified nodes changing.\n    </p>\n    <p>\n        If either of the given indices is out of bounds, your method should return a <code>Result::Err</code>,\n        consistent with the behavior expected in the previous two tasks.\n    </p>\n</div>\n",
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
