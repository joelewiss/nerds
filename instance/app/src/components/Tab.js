import "./Tab.css";

export default function Tab(props) {
  const active = props.activeTab == props.title.toLowerCase() ? "active" : "";

  return (
    <>
      <div className={"tab " + active} onClick={props.onClick}>
        <span>{props.title}</span>
      </div>
    </>
  );
}
