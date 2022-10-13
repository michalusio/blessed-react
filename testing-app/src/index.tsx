import BlessedReact, { useOnResize, loadStylesheet } from '@blessed/react';

const styles = loadStylesheet('./src/styles.css');

const App = () => {
  useOnResize(BlessedReact.forceRerender);
  
  return <box className={styles.lol} onRender={()=>console.log}>
    Hello, testing-app!
  </box>;
}

BlessedReact.Bootstrap(App);