import './RequestBar.scss';
import Datalist from '../../../components/Inputs/Datalist/Datalist.tsx';
import { Button, Input } from '@/components';
import { ButtonStyle } from '@/components/Button/types.ts';
import type { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

const initRequestMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export interface RequestBarProps {
  handleMethodOnChange: ChangeEventHandler<HTMLInputElement>;
  handleEndpointOnChange: ChangeEventHandler<HTMLInputElement>;
  handleButtonClick: () => void;
  initMethod?: string;
  initSearchValue?: string;
  urlError?: string;
  methodError?: string;
}

export default function RequestBar(props: RequestBarProps) {
  const {
    initMethod,
    handleMethodOnChange,
    handleEndpointOnChange,
    handleButtonClick,
    initSearchValue = '',
    urlError = '',
    methodError = '',
  } = props;

  const { t } = useTranslation('rest-client');

  return (
    <div className="request-bar" data-testid="request-bar">
      <Datalist
        id={'id-method-options'}
        listName="method-options"
        onChange={handleMethodOnChange}
        value={initMethod}
        data={initRequestMethods}
        spaceForErrorMessage={true}
        errors={[{ id: 1, message: methodError }]}
        placeholder={t('method')}
      />
      <Input
        id="input-search"
        name="search"
        inputContainerClassName="input-container-search"
        inputClassName="input-search"
        value={initSearchValue}
        onChange={handleEndpointOnChange}
        errors={[{ id: 0, message: urlError }]}
        placeholder={t('endpoint')}
      />
      <Button style={ButtonStyle.Primary} onClick={handleButtonClick}>
        {t('send')}
      </Button>
    </div>
  );
}
