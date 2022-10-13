import BlessedReact, { useOnResize, loadStylesheet, useState } from 'blessed-react';

const styles = loadStylesheet('./src/styles.css');

const App = () => {
  useOnResize(BlessedReact.forceRerender);
  
  const [value, setValue] = useState(0);

  return <box className={styles.lol} onRender={()=> setTimeout(() => setValue(i => i + 1), 500)}>
    Hello, testing-app! {value}
  </box>;
}

BlessedReact.Bootstrap(App);