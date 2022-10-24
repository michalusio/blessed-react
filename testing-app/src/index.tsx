import BlessedReact, { loadStylesheet } from "blessed-react";

BlessedReact.EnableDevelopmentMode();

const styles = loadStylesheet("./src/styles.css");

const Component1 = () => {
  throw new Error("Something happened!");
  return <box />;
};
const Component2 = () => {
  return <Component1 />; //jsx(Component1)
};
const Component3 = () => {
  return <box />;
};
const Component4 = () => {
  return (
    //jsx(Fragment, null, jsx(Component3), jsx(Component2))
    <>
      <Component3 />
      <Component2 />
    </>
  );
};

const App = () => {
  return (
    <box top={0} width={"100%"} height={"100%"}>
      <B top={1} color="red" />
    </box>
  );
};

const B = ({ top, color }: { top: number; color: string }) => {
  return (
    <box className={styles.boxStyle} top={top} bg={color}>
      {color}
    </box>
  );
};

BlessedReact.Bootstrap(App);
