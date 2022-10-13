# Blessed-React

[![NPM Version](https://badge.fury.io/js/blessed-react.svg)](https://badge.fury.io/js/blessed-react)
![NPM](https://img.shields.io/npm/l/blessed-react)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/michalusio/blessed-react/CI/master)

A `reblessed` wrapper providing a TSX way of defining the nodes.

The package supports only function components, as they are recommended by the React team.

## Feature List:

Legend:  
:heavy_check_mark: - Done  
:hammer: - In Progress  
:x: - Not Done Yet

- :heavy_check_mark: No dependency on actual React
- :x: Support of other forks of `blessed`

- :heavy_check_mark: Defining nodes using JSX:
  - :heavy_check_mark: Support for all `blessed` nodes
  - :x: Support for all `blessed-contrib` nodes
  - :x: Diffing the state to replace only changed nodes

- :heavy_check_mark: Loading CSS files:
  - :heavy_check_mark: Applying CSS classes to elements
  - :x: Other selectors support (`*`, `>`, `~`, etc.)
  - :x: CSS scoping
  - :hammer: Styling:
    - :heavy_check_mark: `border`, `border-width`, `border-color`, `border-style` (top|right|bottom|left)
    - :heavy_check_mark: `padding` (top|right|bottom|left)
    - :x: `margin` (top|right|bottom|left)
    - :heavy_check_mark: `visibility`
    - :heavy_check_mark: `color`, `background-color`
    - :heavy_check_mark: `text-align`, `vertical-align`
    - :heavy_check_mark: `width`, `height`
    - :heavy_check_mark: `top`, `right`, `bottom`, `left`
    - :x: Others

- :heavy_check_mark: Hooks:
  - :heavy_check_mark: useState
  - :heavy_check_mark: useEffect
  - :hammer: useRef
  - :heavy_check_mark: useMemo
  - :x: useCallback
  - :heavy_check_mark: useOnKey
  - :heavy_check_mark: useOnResize

### Example usage:

    import BlessedReact, { useOnResize, loadStylesheet, useState } from 'blessed-react';

    const styles = loadStylesheet('./src/styles.css');

    const App = () => {
      useOnResize(BlessedReact.forceRerender);
  
      const [value, setValue] = useState(0);
      const onRender = () => setTimeout(() => setValue(i => i + 1), 500);

      return (<box // Use the names from blessed
              className={styles.myClass}
              onRender={onRender}>
        The value is: {value}
      </box>);
    }

    BlessedReact.Bootstrap(App);