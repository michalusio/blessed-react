import { screenObject } from "./start";

export function getMode() {
  return mode;
}

let mode: 'production' | 'development' = 'production';

/**
  * Enables development mode, which automatically reloads the CSS files when any of them change.
  * 
  * Has to be called before performing any other `blessed-react` action.
  */
export function EnableDevelopmentMode() {
  if (screenObject) throw new Error('Cannot call `EnableDevelopmentMode` after calling `Bootstrap`!');
  mode = 'development';
}