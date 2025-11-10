import { useEffect, useState, type ChangeEventHandler } from 'react';
import { useRouteLoaderData, Navigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import Table from './Table/Table';
import InputRow from './InputRow/InputRow';
import IconTrash from '@/assets/icons/trash.svg?react';
import { Message } from '@/components';
import {
  removeVariableFromLS,
  setVariableToLS,
  getVariablesFromLS,
  type Variables,
} from '@/utils/manageVariable';
import { removeDynamicKey } from '@/utils/helpers';

import './VariablesStyles.scss';

export default function Variables() {
  const user = useRouteLoaderData<User>('root');
  const [variables, setVariables] = useState<Variables>({});
  const [newVariable, setNewVariable] = useState({
    key: '',
    value: '',
  });
  const [newRow, setNewRow] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('variables');
  const headers = ['key', 'value', ''];
  const rows = Object.entries(variables);

  useEffect(() => {
    setVariables(getVariablesFromLS());
  }, []);

  const onAddBtnClick = () => setNewRow(true);
  const onSaveBtnClick = () => {
    if (!newVariable.key || !newVariable.value) {
      setError(t('emptyVariableError'));
      return;
    }
    if (variables[newVariable.key]) {
      setError(t('duplicateVariableError'));
      return;
    }
    setVariableToLS(newVariable);
    setNewRow(false);
    setVariables((prev) => ({ ...prev, [newVariable.key]: newVariable.value }));
    setNewVariable({ key: '', value: '' });
    setError('');
  };

  const getTableRow = (row: [string, string]) => {
    return (
      <tr key={row[0]}>
        <td className="td custom-input">{row[0]}</td>
        <td className="td custom-input">{row[1]}</td>
        <td className="td custom-icon">
          <Button style={ButtonStyle.IconBtn} onClick={() => removeVariable(row[0])}>
            <IconTrash />
          </Button>
        </td>
      </tr>
    );
  };

  const removeVariable = (key: string) => {
    removeVariableFromLS(key);
    setVariables((prev) => removeDynamicKey(prev, key));
  };

  const onInputRowChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { id, value } = e.target;
    setNewVariable((prev) => {
      if (id === 'variableName') {
        return {
          ...prev,
          ['key']: value.trim(),
        };
      } else {
        return {
          ...prev,
          ['value']: value.trim(),
        };
      }
    });
  };

  const removeInputRow = () => {
    setNewRow(false);
    setNewVariable({ key: '', value: '' });
    setError('');
  };

  const renderInputRow = () => {
    return (
      <InputRow
        value1={newVariable.key}
        value2={newVariable.value}
        onChange={onInputRowChange}
        onClick={removeInputRow}
      />
    );
  };

  if (!user) return <Navigate to="/" replace />;
  return (
    <div className="variables__container">
      {rows.length === 0 && <p className="variables__no-content">{t('no-content')}</p>}
      <div className="variables__actions">
        <Button style={ButtonStyle.Primary} type={ButtonType.Button} onClick={onAddBtnClick}>
          {t('addBtn')}
        </Button>
        {newRow && (
          <Button style={ButtonStyle.Secondary} type={ButtonType.Button} onClick={onSaveBtnClick}>
            {t('saveBtn')}
          </Button>
        )}
      </div>
      <div className="variables__content">
        {newRow || rows.length > 0 ? (
          <Table
            headers={headers}
            rows={rows}
            showHeaders={newRow || rows.length > 0}
            inputRow={newRow}
            renderInputRow={renderInputRow}
            translation="variables"
            getTableRow={getTableRow}
            customClass="variables-table"
          />
        ) : (
          <p className="variables__placeholder">{t('no-variables')}</p>
        )}
      </div>
      <div className="variables-error">
        {error && <Message text={error} messageType="warning" />}
      </div>
    </div>
  );
}
