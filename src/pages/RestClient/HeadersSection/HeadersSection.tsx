import './HeadersSection.scss';
import { Button, Datalist, Input } from '@/components';
import { ButtonStyle } from '@/components/Button/types.ts';
import IconTrash from '@/assets/icons/trash.svg?react';
import {
  type RestClientHeader,
  restClientPageStore,
} from '@/stores/restClientPageStore/restClientPageStore.ts';
import { useTranslation } from 'react-i18next';

const HEADERS_COLLECTION = [
  'Content-Type',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
];
const tableHeaders = ['key', 'value', ''];

export default function HeadersSection() {
  const { requestHeaders, updateRequestHeader, removeRequestHeader } = restClientPageStore();
  const { t } = useTranslation('rest-client');

  function getTableRow(params: RestClientHeader) {
    const { id, name, value } = params;
    const isBtnDisabled = requestHeaders.length === 1 || requestHeaders.at(-1)?.id === id;

    return (
      <tr key={`table-row-${id}`} className="tr" data-testid="table-row">
        <td className="td">
          <Datalist
            id={`key-${id}`}
            value={name}
            data={HEADERS_COLLECTION}
            listName={`options-${id}`}
            placeholder={t('key')}
            onChange={(e) => updateRequestHeader({ id, name: e.target.value })}
            spaceForErrorMessage={false}
            border={false}
          />
        </td>
        <td className="td">
          <Input
            id={`value-${id}`}
            placeholder={t('value')}
            onChange={(e) => updateRequestHeader({ id, value: e.target.value })}
            spaceForErrorMessage={false}
            border={false}
            value={value}
          />
        </td>
        <td className="td">
          <Button
            style={ButtonStyle.IconBtn}
            onClick={() => removeRequestHeader({ id })}
            isDisabled={isBtnDisabled}
          >
            <IconTrash />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <div className="headers-container" data-testid="headers-section">
      <p className="title" data-testid="title">
        {t('headers')}:
      </p>
      <div className="content-container" data-testid="content-container">
        <table className="table">
          <thead className="thead">
            <tr className="tr">
              {tableHeaders.map((header, index) => (
                <td key={`${header}-${index}`} className={`td ${header}`}>
                  {header && t(header)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="tbody">{requestHeaders.map((r) => getTableRow(r))}</tbody>
        </table>
      </div>
    </div>
  );
}
