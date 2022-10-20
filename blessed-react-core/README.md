# Blessed-React

[![NPM Version](https://badge.fury.io/js/blessed-react.svg)](https://badge.fury.io/js/blessed-react)
![NPM](https://img.shields.io/npm/l/blessed-react)
![GitHub Workflow Status (master)](https://img.shields.io/github/workflow/status/michalusio/blessed-react/CI/master)

A `reblessed` wrapper providing a TSX way of defining the nodes.

The package supports only function components, as they are recommended by the React team.

## Feature List:

Legend:  
:heavy_check_mark: - Done  
:hammer: - In Progress  
:o: - Not Done Yet  
:x: - Probably won't be supported

- :heavy_check_mark: No dependency on actual React
- :o: Support of other forks of `blessed`

- :heavy_check_mark: Defining nodes using JSX:
  - :heavy_check_mark: Support for all `blessed` nodes
  - :o: Support for all `blessed-contrib` nodes
  - :o: Diffing the state to replace only changed nodes

- :heavy_check_mark: Loading CSS files:
  - :heavy_check_mark: Applying CSS classes to elements
  - :o: Other selectors support (`*`, `>`, `~`, etc.)
  - :o: CSS scoping
  - :hammer: Styling:
    - :heavy_check_mark: `border`, `border-width`, `border-color`, `border-style` (top|right|bottom|left)
    - :heavy_check_mark: `padding` (top|right|bottom|left)
    - :x: `margin` - not supported by blessed
    - :heavy_check_mark: `visibility`
    - :heavy_check_mark: `color`, `background-color`
    - :heavy_check_mark: `text-align`, `vertical-align`
    - :heavy_check_mark: `width`, `height`
    - :heavy_check_mark: `top`, `right`, `bottom`, `left`
    - :o: Others

- :heavy_check_mark: Hooks:
  - :heavy_check_mark: useState
  - :heavy_check_mark: useEffect
  - :hammer: useRef
  - :heavy_check_mark: useMemo
  - :heavy_check_mark: useCallback
  - :heavy_check_mark: useOnKey
  - :heavy_check_mark: useOnResize
  - :o: useTransition
  - :o: useDeferredValue
  - :heavy_check_mark: useContext
  - :o: useReducer
  - :o: useId

- :heavy_check_mark: Development Mode
  - :heavy_check_mark: CSS watch and refresh-on-change
  - :hammer: Diagnostics
  - :o: Helpful Stacktrace
  - :o: Strict Mode

- :o: Additional features
  - :hammer: \<Suspense\> component
  - :hammer: ErrorBoundary component
  - :o: Portals
  - :heavy_check_mark: Contexts

## Example usage:

    import BlessedReact, { useOnResize, loadStylesheet, useState } from 'blessed-react';

    // Enable dev mode to auto-update CSS on any changes
    BlessedReact.EnableDevelopmentMode();

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

## License & Contributing

The project is licensed under the MIT License.

By contributing to the project you agree to release the code added under the same license (MIT).