import { customJS } from './custom-js/flow-logic';
import { visibleElement } from './visible-element/flow-logic';
import { setElementProps } from './set-element-props/flow-logic';
import { interfaceRequest } from './interface-request/flow-logic';
import { condition } from './condition/flow-logic';
import { setGlobalVariable } from './set-global-variable/flow-logic';
import { emitElementAction } from './emit-element-action/flow-logic';
import { openModalDrawer } from './open-modal-drawer/flow-logic';
import { closeModalDrawer } from './close-modal-drawer/flow-logic';

export const logicNodes = {
  customJS,
  visibleElement,
  setElementProps,
  interfaceRequest,
  condition,
  setGlobalVariable,
  emitElementAction,
  openModalDrawer,
  closeModalDrawer,
};
