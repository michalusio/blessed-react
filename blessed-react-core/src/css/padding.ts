import { AnyElement } from "../utils";

const paddingSideRegex = /^(?:padding)(?:-(top|right|bottom|left))?$/g;

export function splitPaddings(
  key: string,
  value: string
): [string, string][] | null {
  const sidePadding = paddingSideRegex.exec(key);
  if (sidePadding) {
    const side = sidePadding[1];
    if (side) {
      return [["padding-" + side, value]];
    }
    return ["top", "right", "bottom", "left"].map((side) => [
      "padding-" + side,
      value,
    ]);
  }
  return null;
}

export function applyPaddingStyling(
  classData: Record<string, string>,
  element: AnyElement
): Record<string, string> {
  const {
    "padding-top": paddingTop,
    "padding-right": paddingRight,
    "padding-bottom": paddingBottom,
    "padding-left": paddingLeft,
    ...rest
  } = classData;

  const paddingData: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } =
    typeof element.style.padding === "number"
      ? {
          top: element.style.padding,
          right: element.style.padding,
          bottom: element.style.padding,
          left: element.style.padding,
        }
      : {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...(element.style.padding ?? {}),
        };

  if (typeof paddingTop === "string") {
    paddingData.top = +paddingTop;
  }
  if (typeof paddingRight === "string") {
    paddingData.right = +paddingRight;
  }
  if (typeof paddingBottom === "string") {
    paddingData.bottom = +paddingBottom;
  }
  if (typeof paddingLeft === "string") {
    paddingData.left = +paddingLeft;
  }
  (element as any).padding = paddingData;
  element.style = {
    ...(element.style ?? {}),
    padding: paddingData,
  };
  return rest;
}
