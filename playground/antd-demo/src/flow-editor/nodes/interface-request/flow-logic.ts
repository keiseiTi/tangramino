import { request } from '@/utils/request';
import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface InterfaceRequestProps {
  url: HyperValue;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: HyperValue;
  queryParams?: HyperValue;
  bodyParams?: HyperValue;
}

export const interfaceRequest = async (ctx: FlowExecuteContext<InterfaceRequestProps>) => {
  const { data } = ctx;
  const { url, method, headers, queryParams, bodyParams } = data;
  const urlValue = executeHyperValue(ctx, url);
  const headersValue = executeHyperValue(ctx, headers);
  const queryParamsValue = executeHyperValue(ctx, queryParams);
  const bodyParamsValue = executeHyperValue(ctx, bodyParams);
  if (urlValue && method) {
    const res = await request({
      url: urlValue,
      method: method,
      headers: headersValue,
      queryParams: queryParamsValue,
      body: bodyParamsValue,
    });
  }
};
