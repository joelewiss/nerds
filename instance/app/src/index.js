import 'react-app-polyfill/stable'; // Do polyfills
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {getCookie, setCookie} from "./util";

// Check stored userID. If it does not match our own user id, clear the storage
const userID = getCookie("userId");
const storedUserID = localStorage.getItem("userid");
if (userID && storedUserID && userID !== storedUserID) {
  console.debug("userid mismatch, clearing local storage");
  localStorage.clear();
}
localStorage.setItem("userid", userID);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

