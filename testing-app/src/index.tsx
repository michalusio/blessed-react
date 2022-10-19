import BlessedReact, { loadStylesheet, useContext } from 'blessed-react';

BlessedReact.EnableDevelopmentMode();

const styles = loadStylesheet('./src/styles.css');

const MyContext = BlessedReact.createContext("yellow");

const App = () => {
  return <box className={styles.myStyle}>
    <MyContext.Provider value="red">
      <B/>
    </MyContext.Provider>
    <MyContext.Provider value="blue">
      <B/>
    </MyContext.Provider>
    <B/>
  </box>;
}
const B = () => {
  return <MyContext.Consumer>{(value: string) => <box>{value}</box>}</MyContext.Consumer>;
}

BlessedReact.Bootstrap(App);
