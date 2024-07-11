import './TabView.css';

export default function TabView(props) {
  return (
    <div className="tabView" style={{"display": props.tabName === props.currentTab ? "block" : "none"}}>
      {props.children}
    </div>
  );
}
