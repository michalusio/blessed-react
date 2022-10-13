import CSS from '@adobe/css-tools';
import { readFileSync } from 'node:fs';
import { blessedElementsTypes } from '../jsx';
import { applyBorderStyling } from './border';
import { applyPaddingStyling } from './padding';
import { splitProperty, transformPropertyName, transformPropertyValue } from './transforms';
import { applyVisibility } from './visibility';

const classIdentifierRegex = /^\.-?(?:[_a-zA-Z]|[\u00A0-\uFFFF])+(?:[_a-zA-Z0-9-]|[\u00A0-\uFFFF])*$/i;

export type CSSClass = Readonly<Record<string, string>>;
export type CSSStyleSheet = Record<string, CSSClass>;

export function loadStylesheet(path: string): CSSStyleSheet {
  const nodes = CSS.parse(readFileSync(path, { encoding: 'utf-8' }), { source: path });
  const rules = nodes.stylesheet.rules.filter((rule): rule is CSS.CssRuleAST => rule.type === CSS.CssTypes.rule);
  return Object.fromEntries(rules
  .flatMap(rule => rule.selectors.filter(selector => classIdentifierRegex.test(selector)).map(className => ([
    className.substring(1),
    Object.fromEntries(rule.declarations.filter((dec): dec is CSS.CssDeclarationAST => dec.type === CSS.CssTypes.declaration)
    .flatMap(dec => splitProperty(dec.property, dec.value))
    .map(dec => ([
      transformPropertyName[dec[0]] || dec[0],
      transformPropertyValue(dec[1])
    ])
    ))
  ]))));
}

const applicableDirectly = ['width', 'height', 'align', 'valign', 'top', 'right', 'bottom', 'left'];

export type AnyElement = blessedElementsTypes[keyof blessedElementsTypes];

export function applyClass(element: AnyElement, classData?: CSSClass): void {
  if (!classData) return;
  let classDataCopy = {...classData};
  applicableDirectly.forEach(key => {
    if (classDataCopy[key]) {
      (element as any)[key] = classDataCopy[key];
      delete classDataCopy[key];
    }
  });
  classDataCopy = applyVisibility(classDataCopy, element);
  classDataCopy = applyBorderStyling(classDataCopy, element);
  classDataCopy = applyPaddingStyling(classDataCopy, element);
  element.style = {
    ...element.style,
    ...classDataCopy
  };
}


