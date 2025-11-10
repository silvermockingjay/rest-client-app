import { removeDynamicKey } from './helpers';

export type Variables = Record<string, string>;

export function getVariablesFromLS(): Variables {
  try {
    return JSON.parse(localStorage.getItem('variables') ?? '{}');
  } catch {
    return {};
  }
}

export function getVariableFromLS(key: string): string {
  const variables = getVariablesFromLS();
  return variables[key] ?? '';
}

interface setVariableProps {
  key: string;
  value: string;
}

export function setVariableToLS({ key, value }: setVariableProps): void {
  const variables = getVariablesFromLS();
  const updatedVariables = { ...variables, [key]: value };
  localStorage.setItem('variables', JSON.stringify(updatedVariables));
}

export function removeVariableFromLS(key: string): void {
  const variables = getVariablesFromLS();
  const updatedVariables = removeDynamicKey(variables, key);
  localStorage.setItem('variables', JSON.stringify(updatedVariables));
}
