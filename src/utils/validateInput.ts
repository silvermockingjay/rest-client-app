import { getAuthSchema, type AuthErrors } from './schema';
import { ValidationError } from 'yup';

export type InputName = 'email' | 'name' | 'password';

interface validateInputProps {
  key: InputName;
  value: string;
  setErrors: React.Dispatch<React.SetStateAction<AuthErrors>>;
}

export const validateInput = async ({ key, value, setErrors }: validateInputProps) => {
  try {
    const authFormSchema = getAuthSchema();
    await authFormSchema.validateAt(key, { [key]: value });
    setErrors((prev) => {
      const updatedErrors = { ...prev, [key]: [{ id: 0, message: '' }] };
      const isErrorUpdated = Object.values(updatedErrors)
        .flat()
        .some((error) => typeof error !== 'boolean' && error.message !== '');
      return { ...updatedErrors, isError: isErrorUpdated };
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      setErrors((prev) => ({
        ...prev,
        [key]: [{ id: 0, message: error.message }],
        isError: true,
      }));
    }
  }
};
