import { NavLink } from 'react-router-dom';
import Tab from "./Tab";

export default function TabNav(props) {
  function codeTab() {
    props.setTab("code");
  }

  function browseTab() {
    props.setTab("browser");
  }

  return (
    <>
      <Tab title="CODE" onClick={codeTab} activeTab={props.tab} />
      <Tab title="BROWSER" onClick={browseTab} activeTab={props.tab} />
    </>
  );
}
