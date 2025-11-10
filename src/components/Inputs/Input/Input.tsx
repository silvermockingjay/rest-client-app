import './InputStyles.scss';
import clsx from 'clsx';

export interface InputError {
  id: number;
  message: string;
}

interface InputProps {
  id: string;
  type?: string;
  name?: string;
  value?: string;
  labelText?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  errors?: InputError[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  spaceForErrorMessage?: boolean;
  border?: boolean;
}

function Input({
  name,
  value,
  id,
  type = 'text',
  labelText,
  inputClassName = '',
  inputContainerClassName = '',
  errors,
  rightIcon,
  onChange,
  isDisabled,
  defaultValue,
  placeholder,
  spaceForErrorMessage = true,
  border = true,
}: InputProps) {
  const inputFieldClass = clsx(
    'input-field',
    border && 'border',
    `${inputClassName}`,
    `${rightIcon ? 'input-field--right-icon' : ''}`
  );

  const renderError = () => {
    if (spaceForErrorMessage || errors) {
      return (
        <div className="input-field--error">
          {errors?.map((error) => (
            <div key={error.id} data-testid="input-error">
              {error.message}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`input-container ${inputContainerClassName}`}>
      <label className="input-label" htmlFor={id}>
        {labelText}
      </label>
      <div className="input-wrapper">
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          className={inputFieldClass}
          onChange={onChange}
          disabled={isDisabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
        ></input>
        {rightIcon && <div className="input-right-icon">{rightIcon}</div>}
        {renderError()}
      </div>
    </div>
  );
}

export default Input;
