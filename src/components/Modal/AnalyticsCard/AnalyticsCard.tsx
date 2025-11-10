import { Button } from '@/components/Button';
import { ButtonStyle } from '@/components/Button/types';
import type { HistoryRow } from '@/types/types';
import { formatDate } from '@/utils/datesUtils';
import { useTranslation } from 'react-i18next';

import './AnalyticsCard.scss';

import CalendarIcon from '@/assets/icons/calendar.svg?react';
import DownloadIcon from '@/assets/icons/download.svg?react';
import UploadIcon from '@/assets/icons/upload.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import ExclamationIcon from '@/assets/icons/exclamation.svg?react';
import CrossIcon from '@/assets/icons/cross.svg?react';

interface AnalyticsCardProps {
  closeModal: () => void;
  row: HistoryRow;
}

export default function AnalyticsCard({ closeModal, row }: AnalyticsCardProps) {
  const { t } = useTranslation('history');

  const dateTime = formatDate(row.request_timestamp, true);

  return (
    <div className="analytics-card">
      <Button style={ButtonStyle.IconBtn} customClass="close-modal-bttn" onClick={closeModal}>
        <CrossIcon className="cross-icon" />
      </Button>
      <div className="request-date-container">
        <CalendarIcon className="icon" />
        <span>{dateTime}</span>
      </div>
      <div className="endpoint-container">
        <span className={`method method--${row.request_method}`}>{row.request_method}</span>
        <span className="endpoint">{row.endpoint}</span>
      </div>
      <div className="main-analytics-container">
        <div className="analytics-container request-analytics-container">
          <h4>{t('request')}</h4>
          <div className="analytics-border"></div>
          <div className="analytics-data">
            <div>
              <ClockIcon className="icon" />
              <span>{`${t('duration')} ${row.duration} ${t('ms')}`}</span>
            </div>
            <div>
              <UploadIcon className="icon" />
              <span>{`${t('payload')} ${row.request_size} ${t('bytes')}`}</span>
            </div>
          </div>
        </div>
        <div className="analytics-container request-analytics-container">
          <h4>{t('response')}</h4>
          <div className="analytics-border"></div>
          <div className="analytics-data">
            <div
              className={`status-code-container status-code-container--${(row.status_code && row.status_code >= 400) || row.status_code === 0 ? 'error' : 'ok'}`}
            >
              <span>{row.status_code}</span>
            </div>

            <div>
              <DownloadIcon className="icon" />
              <span>{`${t('payload')} ${row.response_size} ${t('bytes')}`}</span>
            </div>
          </div>
        </div>
      </div>
      {row.error_details && (
        <div className="error-container">
          <ExclamationIcon className="icon exclamation-icon" />
          <span>{row.error_details}</span>
        </div>
      )}
    </div>
  );
}
