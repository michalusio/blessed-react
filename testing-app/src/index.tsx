import BlessedReact, { loadStylesheet } from "blessed-react";

BlessedReact.EnableDevelopmentMode();

const styles = loadStylesheet("./src/styles.css");

const App = () => {
  return (
    <box top={0} width={"100%"} height={"100%"}>
      <B top={1} color="red" />
    </box>
  );
};

const B = ({ top, color }: { top: number; color: string }) => {
  throw new Error("something went wrong");
  return (
    <box className={styles.boxStyle} top={top} bg={color}>
      {color}
    </box>
  );
};

BlessedReact.Bootstrap(App);
