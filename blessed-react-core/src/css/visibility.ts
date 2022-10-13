import { AnyElement } from ".";

export function applyVisibility(classData: Record<string, string>, element: AnyElement): Record<string, string> {
  const { visibility, ...rest } = classData;

  switch (visibility) {
    case 'hidden':
    case 'collapse':
      element.hidden = true;
    break;
    case 'visible':
      element.hidden = false;
    break;
  }

  return rest;
}