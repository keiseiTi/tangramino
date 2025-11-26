import { start } from './start';
import { interfaceRequest } from './interface-request';
import { customJS } from './custom-js';
import { setElementProps } from './set-element-props';
import { visibleElement } from './visible-element';
import { condition } from './condition';
import { setGlobalVariable } from './set-global-variable';
import { emitElementAction } from './emit-element-action';

export const nodes = [
  start,
  interfaceRequest,
  customJS,
  setElementProps,
  emitElementAction,
  visibleElement,
  condition,
  setGlobalVariable,
];
