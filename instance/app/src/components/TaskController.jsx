import { useEffect, useState } from "react";
import './TaskController.css';
import {get_tasks} from "../services";
import useSavedState from "../hooks/useSavedState";
import FinishButton from "./FinishButton";

function cookieIsSet(cookie) {
  return document.cookie.split(";").some((item) => item.trim().startsWith(`${cookie}=`));
}


/* Randomize array using Durstenfeld shuffle algorithm
 * From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
 * Modified to return a copy */
function shuffleArray(old_array) {
  var array = old_array.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default function TaskController(props) {
  // state that we have from props:
  // suggestions      <array>   list of code suggestions
  // taskno           <int>     Task number we're on
  // current          <int>     Current suggestion that's selected by the user
  const [taskno, set_taskno] = props.taskno;
  const [task_list, set_task_list] = props.task_list;
  const max_taskno = task_list.length;
  
  let task_desc = "Loading...";
  if (max_taskno !== 0) {
    task_desc = task_list[taskno].desc;
  }

  // Function to handle getting new tasks and setting correct task
  useEffect(() => {
    if (task_list.length == 0) {
      get_tasks().then((json) => {

        set_task_list(json.tasks);

        /*
        if (cookieIsSet("taskNumber")) {
          console.debug("Loading saved taskno");
          set_taskno(parseInt(getCookie("taskNumber")));
        }*/
      });
    }
  }, []);

  function handleIncr(increment, submitCode) {
    set_taskno(taskno => taskno + increment);
    /*set_current(0);
    props.set_confirmed(false);*/
    props.submit(submitCode);
  }

  function handlePrev() {
    handleIncr(-1, "p");
  }

  function handleNext() {
    handleIncr(1, "n");
  }

  function handleSkip() {
    handleIncr(1, "s");
  }

  // Construct the task buttons
  let taskButtons = null;
  if (taskno === 0) {
    taskButtons = (
      <>
        <button onClick={handlePrev} disabled>Prev task</button>
        {/*<button onClick={handleSkip}>Skip task</button>*/}
        <button onClick={handleNext}>Next task</button>
      </>
    );
  } else if (taskno !== max_taskno-1) {
    taskButtons = (
      <>
        <button onClick={handlePrev}>Prev task</button>
        {/*<button onClick={handleSkip}>Skip task</button>*/}
        <button onClick={handleNext}>Next task</button>
      </>
    );
  } else {
    taskButtons = (
      <>
        <button onClick={handlePrev}>Prev task</button>
        <FinishButton />
      </>
    );
  }

  return (
    <div id="taskWindow">
      <div id="task">
        <h3>Task {taskno}</h3>
        <div dangerouslySetInnerHTML={{"__html":task_desc}}></div>
      </div>
      <div id="taskButtons">
        { taskButtons }
      </div>
    </div>
  );
}
