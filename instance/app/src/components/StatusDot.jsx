import "./StatusDot.css";

export default function StatusDot(props) {
  let color = "green";
  if (!props.status) {
    color = "red";
  }
  let label = null;
  if (props.label) {
    label = (<span className="statusLabel">{props.label}</span>);
  }

  return (
    <>
      {label}
      <div style={{"backgroundColor":color}} className="statusDot"/>
    </>)
  }
