const DEV_MODE = process.env.NODE_ENV === "development";
//const DEV_MODE = true;
const BACKEND_PRESENT = true;

// If we're not in dev mode, override console.debug
if (!DEV_MODE) {
  console.debug = () => {};
}

// From https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript
function isUndefined(v) {
  return (typeof v === "undefined");
}

function getCookie(cookie) {
  return document.cookie.split(";")
    .find((item) => item.trim().startsWith(`${cookie}=`))
    ?.split("=")[1];
}

function setCookie(cookie, value) {
  document.cookie = `${cookie}=${value}; SameSite=Strict`;
}

export {isUndefined, getCookie, setCookie, DEV_MODE, BACKEND_PRESENT}
