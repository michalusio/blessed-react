import BlessedReact, { loadStylesheet } from "blessed-react";

BlessedReact.EnableDevelopmentMode();

const styles = loadStylesheet("./src/styles.css");

const ColorContext = BlessedReact.createContext("red");

const App = () => {
  return (
    <box top={0} width={"100%"} height={"100%"}>
      <B top={1} />
      <ColorContext.Provider value="green">
        <B top={8} />
      </ColorContext.Provider>
      <ColorContext.Provider value="blue">
        <B top={15} />
      </ColorContext.Provider>
    </box>
  );
};
const B = ({ top }: { top: number }) => {
  return (
    <ColorContext.Consumer>
      {(color: string) => (
        <box className={styles.boxStyle} top={top} bg={color}>
          {color}
        </box>
      )}
    </ColorContext.Consumer>
  );
};

BlessedReact.Bootstrap(App);

