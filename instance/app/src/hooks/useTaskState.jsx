import useSavedState from "./useSavedState";

// TODO: This is a hacky, temporary solution
const NUM_SLOTS = 6;

// Hook to store task-specific state given a task number
export default function useTaskState(keyName, taskNumber, initialValue) {
  const [state, set_state] = useSavedState(keyName, Array(NUM_SLOTS).fill(initialValue));

  let setTaskState = (value) => {
    /*console.debug(`Setting state for key ${keyName} taskno ${taskNumber} to ${value}`);*/
    if (typeof value === "function") {
      return set_state(curr_state => {
        const new_value = value(curr_state[taskNumber]);
        /*console.debug(`Updating storage backend for key ${keyName} taskno ${taskNumber} with value ${JSON.stringify(new_value)}`);*/
        return curr_state.with(taskNumber, new_value);
      });
    } else {
      /*console.debug(`Updating storage backend for key ${keyName} taskno ${taskNumber} with value ${JSON.stringify(value)}`);*/
      return set_state(curr_state => curr_state.with(taskNumber, value));
    }
  }
  
  // console.debug(`Sending state for key ${keyName} taskno ${taskNumber}`);

  return [state[taskNumber], setTaskState];
}
