import { screenObject } from "./start";

export function getMode() {
  return mode;
}

let mode: "production" | "development" = "production";

/**
 * Enables development mode.
 *
 * Features of development mode:
 * * Automatically reloads the CSS files when any of them change
 * * Component-based stacktraces
 *
 * Has to be called before performing any other `blessed-react` action.
 */
export function EnableDevelopmentMode() {
  if (screenObject)
    throw new Error(
      "Cannot call `EnableDevelopmentMode` after calling `Bootstrap`!"
    );
  mode = "development";
}

export function ResetMode() {
  mode = "production";
}
