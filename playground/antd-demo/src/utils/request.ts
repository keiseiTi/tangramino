import qs from 'qs';

interface RequestOptions {
  url: string;
  method: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: Record<string, string>;
}

export const request = async (options: RequestOptions) => {
  const { url, method, headers, queryParams, body } = options;

  let requestUrl = url;
  if (queryParams) {
    requestUrl += `?${qs.stringify(queryParams)}`;
  }

  const response = await fetch(requestUrl, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  return response.json();
};
