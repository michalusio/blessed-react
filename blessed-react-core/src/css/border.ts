import { Border as BorderBroken } from '../blessing';
import { AnyElement, modeArray } from '../utils';

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
  const {
    'border-color': borderColor,
    'border-top-style': borderTopStyle,
    'border-right-style': borderRightStyle,
    'border-bottom-style': borderBottomStyle,
    'border-left-style': borderLeftStyle,
    'border-top-width': borderTopWidth,
    'border-right-width': borderRightWidth,
    'border-bottom-width': borderBottomWidth,
    'border-left-width': borderLeftWidth,
    ...rest
  } = classData;
  const borderData: Partial<Border> = {
    ch: ' ',
    top: true,
    bottom: true,
    left: true,
    right: true,
    ...(element.border ?? {}) as unknown as Border
  };
  const borderStyle = modeArray([borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle]);
  const borderWidth = modeArray([borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth]);

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
  if (borderWidth) {
    if (borderWidth === '0') {
      borderData.type = 'bg';
      borderData.top = false;
      borderData.bottom = false;
      borderData.left = false;
      borderData.right = false;
    }
  }
  if (['none', 'hidden'].includes(borderTopStyle) || borderTopWidth === '0') {
    borderData.top = false;
  }
  if (['none', 'hidden'].includes(borderRightStyle) || borderRightWidth === '0') {
    borderData.right = false;
  }
  if (['none', 'hidden'].includes(borderBottomStyle) || borderBottomWidth === '0') {
    borderData.bottom = false;
  }
  if (['none', 'hidden'].includes(borderLeftStyle) || borderLeftWidth === '0') {
    borderData.left = false;
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

const borderSideRegex = /^(?:border)-(top|right|bottom|left)(?:-width)?$/g;

export function splitBorders(key: string, value: string): [string, string][] | null {
  if (key === 'border') {
    const parts = value.split(' ').map(part => identifyBorderPart(part));
    return [
      ...parts.filter(part => part.type === 'color').map(part => (['border-' + part.type, part.value] as [string, string])),
      ...parts.filter(part => part.type !== 'color').flatMap(part => ['top', 'right', 'bottom', 'left'].map(side => (['border-' + side + '-' + part.type, part.value] as [string, string])))
    ];
  }
  const sideBorder = borderSideRegex.exec(key);
  if (sideBorder) {
    const side = sideBorder[1];
    const parts = value.split(' ').map(part => identifyBorderPart(part)).filter(part => part.type !== 'color');
    return parts.map(part => (['border-' + side + '-' + part.type, part.value]));
  }
  if (['border-color', 'border-style', 'border-width'].includes(key)) {
    const part = identifyBorderPart(value);
    if (part.type === 'color') {
      return [['border-color', part.value]];
    }
    return [
      ...['top', 'right', 'bottom', 'left'].map(side => (['border-' + side + '-' + part.type, part.value] as [string, string]))
    ];
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
  if (part.endsWith('px') || part.endsWith('rem') || part.endsWith('em') || part === '0') {
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
