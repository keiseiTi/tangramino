import type { FlowExecuteContext } from '@tangramino/engine';
interface CustomJSNodeProps {
  code: string;
}

export const customJSLogic = (props: FlowExecuteContext<CustomJSNodeProps>) => {
  const { data } = props;
  const { code } = data;
  console.log('keiseiTi :>> ', 'code', code);
  // return new Function(code)();
};
