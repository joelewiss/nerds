import {useState, useEffect} from "react";

const USE_STORAGE = true;

export default function useSavedState(keyName, initialValue) {
  let initialState = initialValue;
  const storageVal = localStorage.getItem(keyName);
  const [state, set_state] = useState(storageVal && USE_STORAGE ? JSON.parse(storageVal) : initialState);

  // Effect to store state to storage every time it changes
  useEffect(() => {
    // Prevent overwriting state before we load it
    if (USE_STORAGE) {
      localStorage.setItem(keyName, JSON.stringify(state));
    }
  }, [state, keyName]);

  return [state, set_state];
}


/* VERSION 1: ISSUE: GENERATES CHANGE EVENT WHEN DATA IS LOADED FROM STORAGE
export default function useSavedState(keyName, initialValue) {
  let initialState = initialValue;
  const [state, set_state] = useState(initialState);
  // Flag if load from storage has been atempted
  const [loaded, set_loaded] = useState(false);

  // Initial effect, runs only once to load stored value
  useEffect(() => {
    const storageVal = localStorage.getItem(keyName);
    if (storageVal) {
      //console.debug(`Loading saved state from storage for key ${keyName}:${storageVal}`);
      set_state(JSON.parse(storageVal));
    }
    set_loaded(true);
  }, []);

  // Effect to store state to storage every time it changes
  useEffect(() => {
    // Prevent overwriting state before we load it
    if (loaded)  {
      //console.debug(`Setting storage key ${keyName}:${state}`);
      localStorage.setItem(keyName, JSON.stringify(state));
    }
  }, [state, loaded]);

  return [state, set_state];
}*/
