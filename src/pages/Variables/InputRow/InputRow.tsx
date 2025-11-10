import { Input } from '@/components/Inputs';
import IconTrash from '@/assets/icons/trash.svg?react';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button } from '@/components/Button';
import { ButtonStyle } from '@/components/Button/types';
import { useTranslation } from 'react-i18next';

export interface InputRowProps {
  value1: string;
  value2: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function InputRow({ value1, value2, onChange, onClick }: InputRowProps) {
  const { t } = useTranslation('variables');
  return (
    <tr data-testid="input-row">
      <td className="td">
        <Input
          id="variableName"
          placeholder={t('key')}
          onChange={onChange}
          spaceForErrorMessage={false}
          border={false}
          value={value1}
        />
      </td>
      <td className="td">
        <Input
          id="variableValue"
          placeholder={t('value')}
          onChange={onChange}
          spaceForErrorMessage={false}
          border={false}
          value={value2}
        />
      </td>
      <td className="td custom-icon">
        <Button style={ButtonStyle.IconBtn} onClick={onClick}>
          <IconTrash />
        </Button>
      </td>
    </tr>
  );
}
