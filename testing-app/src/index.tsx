import BlessedReact, { useOnResize, loadStylesheet } from 'blessed-react';

BlessedReact.EnableDevelopmentMode();

const styles = loadStylesheet('./src/styles.css');

const App = () => {
  useOnResize(BlessedReact.forceRerender);
  return <box className={styles.myStyle}>
    Hello, testing-app!{'\n'}
    {styles.myStyle['border-color']}
  </box>;
}

BlessedReact.Bootstrap(App);
