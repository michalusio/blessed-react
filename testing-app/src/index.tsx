import BlessedReact, { Suspense } from "blessed-react";

BlessedReact.EnableDevelopmentMode();

const B = BlessedReact.lazy(() => import("./b.js"));

const App = () => {
  return (
    <box top={0} width={"100%"} height={"100%"}>
      <Suspense fallback={"loading red"}>
        <B top={1} color="red" />
      </Suspense>
      <Suspense fallback={"loading green"}>
        <B top={8} color="green" />
      </Suspense>
      <Suspense fallback={"loading blue"}>
        <B top={15} color="blue" />
      </Suspense>
    </box>
  );
};

BlessedReact.Bootstrap(App);
