import { useLoaderData, redirect, Link, type LoaderFunctionArgs } from 'react-router-dom';
import { createClient } from '@/services/supabase/supabaseServer';
import { formatDate } from '@/utils/datesUtils';
import { type HistoryRow } from '@/types/types';
import HistoryDate from '@/components/HistoryDate/HistoryDate';
import { useTranslation } from 'react-i18next';

import './HistoryStyles.scss';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) return redirect('/');

  const { data } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user.id)
    .order('request_timestamp', { ascending: false });

  return data;
}

export default function HistoryPage() {
  const data = useLoaderData<HistoryRow[]>();
  const { t } = useTranslation('history');

  const rowsByDate = data.reduce((acc: Record<string, HistoryRow[]>, row) => {
    const date = formatDate(row.request_timestamp);
    if (!date) return acc;

    if (!acc[date]) acc[date] = [];
    acc[date].push(row);
    return acc;
  }, {});

  return (
    <>
      {data.length == 0 && (
        <p className="rest-suggestion">
          {t('suggestion')}&nbsp;
          <Link className="suggestion-link" to="/rest-client">
            {t('suggestionLink')}
          </Link>
        </p>
      )}
      <ul className="history-list">
        {Object.entries(rowsByDate).map(([date, rows]) => (
          <HistoryDate key={date} date={date} rows={rows} />
        ))}
      </ul>
    </>
  );
}
