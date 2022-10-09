import { Border as BorderBroken } from '../blessing';
import { AnyElement } from ".";

type Border = Omit<BorderBroken, 'bold' | 'underline' | 'fg' | 'bg' > & {
  left?: boolean,
  right?: boolean,
  top?: boolean,
  bottom?: boolean,
  bold?: string | boolean | (() => boolean),
  underline?: string | boolean | (() => boolean),
  fg?: string | number,
  bg?: string | number
};

export function applyBorderStyling(classData: Record<string, string>, element: AnyElement): Record<string, string> {
  const { 'border-style': borderStyle, 'border-width': borderWidth, 'border-color': borderColor,...rest} = classData;
  const borderData: Partial<Border> = {
    ch: ' ',
    top: true,
    bottom: true,
    left: true,
    right: true,
    ...(element.border ?? {}) as unknown as Border
  };
  if (borderStyle) {
    switch (borderStyle as 'bg' | 'line' | 'line-groove' | 'none') {
      case 'none':
        borderData.type = 'bg';
        borderData.top = false;
        borderData.bottom = false;
        borderData.left = false;
        borderData.right = false;
        break;
      case 'line':
        borderData.type = 'line';
        borderData.bold = false;
        borderData.underline = false;
        break;
      case 'line-groove':
        borderData.type = 'line';
        borderData.bold = true;
        borderData.underline = true;
        break;
      case 'bg':
        borderData.type = 'bg';
        break;
    }
  }
  if (borderColor) {
    if (borderData.type === 'bg') {
      borderData.bg = borderColor;
    } else {
      borderData.fg = borderColor;
    }
  }
  borderData.underline = true;
  if (borderWidth) {
    if (borderWidth === '0') {
      borderData.type = 'bg';
      borderData.top = false;
      borderData.bottom = false;
      borderData.left = false;
      borderData.right = false;
    }
  }
  element.border = borderData as unknown as BorderBroken;
  element.style = {
    ...(element.style ?? {}),
    border: {
      ...(element.style?.border ?? {}),
      ...borderData
    }
  };
  return rest;
}

export function splitBorders(key: string, value: string): [string, string][] | null {
  if (key === 'border') {
    const parts = value.split(' ').map(part => identifyBorderPart(part));
    return parts.map(part => (['border-' + part.type, part.value]));
  }
  if (['border-color', 'border-style', 'border-width'].includes(key)) {
    const part = identifyBorderPart(value);
    return [['border-' + part.type, part.value]];
  }
  return null;
}

type BorderPart = 
| {
  type: 'width',
  value: string
}
| {
  type: 'style',
  value: 'bg' | 'line' | 'line-groove' | 'none'
}
| {
  type: 'color',
  value: string
}

function identifyBorderPart(part: string): BorderPart {
  if (['none', 'hidden'].includes(part)) {
    return {
      type: 'style',
      value: 'none'
    }
  }
  if (['dashed', 'dotted', 'ridge'].includes(part)) {
    return {
      type: 'style',
      value: 'line'
    }
  }
  if (['groove', 'inset', 'outset'].includes(part)) {
    return {
      type: 'style',
      value: 'line-groove'
    }
  }
  if (['solid', 'double'].includes(part)) {
    return {
      type: 'style',
      value: 'bg'
    }
  }
  if (part.endsWith('px') || part.endsWith('rem') || part.endsWith('em')) {
    return {
      type: 'width',
      value: part
    }
  }
  return {
    type: 'color',
    value: part
  };
}
