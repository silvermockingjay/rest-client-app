import type { InputError } from '@/components/Inputs/Input/Input';
import * as yup from 'yup';
import i18n from '../i18n';

export function getAuthSchema() {
  return yup.object({
    name: yup.string().required(i18n.t('name.required', { ns: 'validation' })),
    email: yup
      .string()
      .required(i18n.t('email.required', { ns: 'validation' }))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        i18n.t('email.format', { ns: 'validation' })
      ),
    password: yup
      .string()
      .required(i18n.t('password.required', { ns: 'validation' }))
      .min(8, i18n.t('password.matchesLength', { ns: 'validation' }))
      .matches(/\p{L}/u, i18n.t('password.matchesLetter', { ns: 'validation' }))
      .matches(/\p{N}/u, i18n.t('password.matchesNumber', { ns: 'validation' }))
      .matches(/[^\p{L}\p{N}]/u, i18n.t('password.matchesSpecial', { ns: 'validation' })),
  });
}

export interface AuthErrors {
  name: InputError[];
  email: InputError[];
  password: InputError[];
  isError: boolean;
}
