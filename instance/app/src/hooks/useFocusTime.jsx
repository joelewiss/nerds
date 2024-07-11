import {useEffect, useState} from "react";
import useSavedState from "./useSavedState";

const TICK_INTERVAL_MSEC = 1000;

export default function useFocusTime() {
  const [focus, set_focus] = useState(true);
  const [focus_time, set_focus_time] = useSavedState("focusTime", 0);

  function onFocus() {
    set_focus(true);
  }

  function onBlur() {
    set_focus(false);
  }

  function tickInterval() {
    if (focus) {
      set_focus_time(t => t + (TICK_INTERVAL_MSEC/1000));
    }
  }

  useEffect(() => {
    // Set focus and blur callbacks
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    // Set tickInterval interval
    const interval = setInterval(tickInterval, TICK_INTERVAL_MSEC);

    // Return a cleanup function
    return (() => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      clearInterval(interval);
    });
  });

  return focus_time;
}
