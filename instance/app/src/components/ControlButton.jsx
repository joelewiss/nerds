import "./ControlButton.css";

export default function ControlButton(props) {
  return (
    <button
      onClick={props.onClick}
      className="controlButton"
      id={props.id ? props.id : ""}
      disabled={props.disabled}
    >{props.title}</button>
  );
}
