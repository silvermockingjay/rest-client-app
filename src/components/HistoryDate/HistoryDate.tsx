import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type HistoryRow } from '@/types/types';
import { Modal, AnalyticsCard } from '@/components/Modal';
import IconThreeDots from '@/assets/icons/three-dots.svg?react';
import { toBase64 } from '@/utils/encoding';
import chevronRight from '@/assets/icons/chevron-right.svg';

interface HistoryDateProps {
  date: string;
  rows: HistoryRow[];
}

export default function HistoryDate({ date, rows }: HistoryDateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const handleCloseModal = () => {
    setOpenRowId(null);
  };

  function restoreUrl(historyRow: HistoryRow) {
    const { request_method, endpoint, headers, payload } = historyRow;

    if (!request_method || !endpoint) return '/rest-client';

    let url = `/rest-client/${request_method}/${toBase64(endpoint)}`;
    if (payload) url = url.concat('/', toBase64(payload));

    if (headers) {
      const requestHeaders = JSON.parse(headers) as string[][];
      const headersParams = new URLSearchParams(requestHeaders);
      url = url.concat(`?${headersParams}`);
    }

    return url;
  }

  return (
    <>
      <li key={date.toString()} onClick={() => setIsOpened((prev) => !prev)}>
        <div className="closed-list-container">
          <img
            src={chevronRight}
            alt="chevron right"
            className={isOpened ? `list-icon--opened-list` : `list-icon--closed-list`}
          />
          {date}
        </div>
      </li>
      {isOpened && (
        <ul className="opened-list-container">
          {rows.map((historyRow) => (
            <li className="request-row" key={historyRow.id}>
              <span className={`method method--${historyRow.request_method}`}>
                {historyRow.request_method}
              </span>
              <Link className="url-link" to={restoreUrl(historyRow)}>
                {historyRow.endpoint}
              </Link>
              <div
                data-testid="open request info"
                className="icon-container"
                onClick={() => {
                  setOpenRowId(historyRow.id);
                }}
              >
                <IconThreeDots />
              </div>
              {openRowId === historyRow.id && (
                <Modal closeModal={handleCloseModal}>
                  <AnalyticsCard closeModal={handleCloseModal} row={historyRow} />
                </Modal>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
