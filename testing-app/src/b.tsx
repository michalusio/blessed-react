import BlessedReact, { loadStylesheet } from "blessed-react";

const styles = loadStylesheet("./src/styles.css");

const B: JSX.Component<{ top: number; color: string }> = ({
  top,
  color,
}: {
  top: number;
  color: string;
}) => {
  return (
    <box className={styles.boxStyle} top={top} bg={color}>
      {color}
    </box>
  );
};

export default B;
