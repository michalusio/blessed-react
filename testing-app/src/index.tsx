import Exalted, { useOnResize, loadStylesheet } from 'exalted';

const styles = loadStylesheet('./src/styles.css');

const App = () => {
  useOnResize(Exalted.forceRerender);
  
  return <box className={styles.lol} onRender={()=>console.log}>
    Hello, testing-app!
  </box>;
}

Exalted.Bootstrap(App);