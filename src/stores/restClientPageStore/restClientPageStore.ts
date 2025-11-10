import { getVariableFromLS } from '@/utils/manageVariable';
import { create } from 'zustand';

interface RestClientPageStore {
  requestMethod: string;
  requestUrl: string;
  requestBody: string;
  requestHeaders: RestClientHeader[];
  interpolatedRequestUrl: string;
  interpolatedRequestBody: string;
  interpolatedRequestHeaders: RestClientHeader[];

  setRequestMethod: (method: string) => void;
  setRequestUrl: (url: string) => void;
  setRequestBody: (body: string) => void;
  addRequestHeader: (params: { name: string; value: string }) => void;
  updateRequestHeader: (params: { id: string; name?: string; value?: string }) => void;
  removeRequestHeader: (params: { id: string }) => void;
  clearRequestHeaders: () => void;
}

export interface RestClientHeader {
  id: string;
  name: string;
  value: string;
}

export const restClientPageStore = create<RestClientPageStore>((set) => ({
  requestMethod: '',
  requestUrl: '',
  requestBody: '',
  requestHeaders: [],
  interpolatedRequestUrl: '',
  interpolatedRequestBody: '',
  interpolatedRequestHeaders: [],

  setRequestMethod: (method: string) => {
    set({ requestMethod: method });
  },

  setRequestUrl: (url: string) => {
    const interpolatedRequestUrl = interpolateVariables(url);
    set({ requestUrl: url, interpolatedRequestUrl });
  },

  setRequestBody: (body: string) => {
    const interpolatedRequestBody = interpolateVariables(body);
    set({ requestBody: body, interpolatedRequestBody });
  },

  addRequestHeader: ({ name, value }) => {
    const id = crypto.randomUUID();
    const header = {
      id,
      name,
      value,
    };
    const interpolatedHeader = {
      id,
      name: name,
      value: interpolateVariables(value),
    };

    set((state) => ({
      requestHeaders: [...state.requestHeaders, header],
      interpolatedRequestHeaders: [...state.interpolatedRequestHeaders, interpolatedHeader],
    }));
  },

  updateRequestHeader: ({ id, name, value }) =>
    set((state) => {
      const headerIndex = state.requestHeaders.findIndex((h) => h.id === id);
      if (headerIndex === -1) {
        return state;
      }

      const requestHeaders = [...state.requestHeaders];
      const header = requestHeaders[headerIndex];
      requestHeaders[headerIndex] = {
        ...header,
        name: name ?? header.name,
        value: value ?? header.value,
      };

      const interpolatedRequestHeaders = [...state.interpolatedRequestHeaders];
      const interpolatedHeader = interpolatedRequestHeaders[headerIndex];
      interpolatedRequestHeaders[headerIndex] = {
        ...interpolatedHeader,
        name: requestHeaders[headerIndex].name,
        value: interpolateVariables(requestHeaders[headerIndex].value),
      };

      return {
        requestHeaders,
        interpolatedRequestHeaders,
      };
    }),

  removeRequestHeader: ({ id }) => {
    set((state) => {
      return {
        requestHeaders: state.requestHeaders.filter((header) => header.id !== id),
        interpolatedRequestHeaders: state.interpolatedRequestHeaders.filter(
          (header) => header.id !== id
        ),
      };
    });
  },

  clearRequestHeaders: () => {
    set(() => {
      return {
        requestHeaders: [],
        interpolatedRequestHeaders: [],
      };
    });
  },
}));

function interpolateVariables(stringToInterpolate: string) {
  const interpolateRegExp = /{{((?:(?!{{)[\s\S])+?)}}/g;
  const variableNames = stringToInterpolate.match(interpolateRegExp);
  let interpolatedString = stringToInterpolate;

  variableNames?.forEach((variable) => {
    const variableValue = getVariableFromLS(variable.slice(2, -2));

    if (variableValue !== undefined) {
      interpolatedString = interpolatedString.replace(variable, variableValue);
    }
  });

  return interpolatedString;
}
