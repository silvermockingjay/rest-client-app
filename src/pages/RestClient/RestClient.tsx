import './RestClient.scss';
import {
  useNavigate,
  useSearchParams,
  Navigate,
  useRouteLoaderData,
  useFetcher,
  type ActionFunctionArgs,
  useParams,
} from 'react-router-dom';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import RequestBar from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useEffect, useState } from 'react';
import Spinner from '@/components/Spinner/Spinner.tsx';
import { RequestDataEditorOrViewer } from '@/pages/RestClient/RequestDataEditorOrViewer/RequestDataEditorOrViewer.tsx';
import { apiRequestWithMetrics } from '@/utils/apiMetrics';
import axios from 'axios';
import { type User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import CodeSection from '@/pages/RestClient/CodeSection/CodeSection.tsx';
import { createClient } from '@/services/supabase/supabaseServer';
import { toBase64, fromBase64 } from '@/utils/encoding';

export default function RestClient() {
  const { method, encodedUrl, encodedBody } = useParams<{
    method?: string;
    encodedUrl?: string;
    encodedBody?: string;
  }>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [urlError, setUrlError] = useState<string>('');
  const [methodError, setMethodError] = useState<string>('');
  const user = useRouteLoaderData<User>('root');
  const fetcher = useFetcher<ActionData>();

  let viewerData;
  const { t } = useTranslation('rest-client');

  if (fetcher.data && 'errorMessage' in fetcher.data) {
    viewerData = {
      status: fetcher.data.status,
      errorMessage: JSON.stringify(fetcher.data.errorMessage),
    };
  } else {
    viewerData = {
      status: fetcher.data?.status,
      data: JSON.stringify(fetcher.data, null, 2),
    };
  }

  const {
    requestMethod,
    requestUrl,
    requestHeaders,
    requestBody,
    setRequestMethod,
    setRequestUrl,
    setRequestBody,
    addRequestHeader,
    clearRequestHeaders,
    interpolatedRequestUrl,
    interpolatedRequestBody,
    interpolatedRequestHeaders,
  } = restClientPageStore();

  useEffect(() => {
    document.body.style.overflow = fetcher.state === 'submitting' ? 'hidden' : '';
  }, [fetcher.state]);

  useEffect(() => {
    if (method) {
      setRequestMethod(method);
    }

    if (encodedUrl) {
      setRequestUrl(fromBase64(encodedUrl));
    }

    if (encodedBody) {
      setRequestBody(fromBase64(encodedBody));
    }

    clearRequestHeaders();

    searchParams.forEach((value, key) => {
      addRequestHeader({ name: key, value: value });
    });
  }, []);

  useEffect(() => {
    const lastHeader = requestHeaders.at(-1);

    if (!lastHeader || lastHeader?.name || lastHeader?.value) {
      addRequestHeader({ name: '', value: '' });
    }
  }, [requestHeaders]);

  const navigateAfterSendingRequest = () => {
    const headers = requestHeaders.filter((h) => h.name && h.value).map((h) => [h.name, h.value]);
    const segments = [
      '/rest-client',
      requestMethod,
      toBase64(requestUrl),
      requestBody ? toBase64(requestBody) : undefined,
    ].filter((s) => s !== undefined);

    const newUrlSearchParams = new URLSearchParams(headers);

    navigate({
      pathname: segments.join('/'),
      search: newUrlSearchParams.toString() ? `?${newUrlSearchParams}` : undefined,
    });
  };

  const handleSendingRequest = async () => {
    let hasError = false;

    if (!requestUrl) {
      setUrlError(t('requiredField'));
      hasError = true;
    }

    if (!requestMethod) {
      setMethodError(t('requiredField'));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    navigateAfterSendingRequest();

    await fetcher.submit(
      {
        method: requestMethod,
        url: interpolatedRequestUrl,
        body: interpolatedRequestBody,
        headers: JSON.stringify(
          interpolatedRequestHeaders.filter((h) => h.name && h.value).map((h) => [h.name, h.value])
        ),
      },
      { method: 'POST', action: '/rest-client' }
    );
  };

  const handleMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (methodError) {
      setMethodError('');
    }

    setRequestMethod(e.target.value);
  };

  const handleURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (urlError) {
      setUrlError('');
    }

    setRequestUrl(e.target.value);
  };

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="rest-client-page" data-testid="rest-client-page">
      <RequestBar
        initMethod={requestMethod}
        handleMethodOnChange={handleMethodChange}
        initSearchValue={requestUrl}
        handleEndpointOnChange={handleURLChange}
        handleButtonClick={handleSendingRequest}
        urlError={urlError}
        methodError={methodError}
      />
      <HeadersSection />
      <RequestDataEditorOrViewer mode="editor" />
      <RequestDataEditorOrViewer mode="viewer" viewerData={viewerData} />
      <CodeSection />
      {fetcher.state === 'submitting' && (
        <div className="bg-overlay">
          <Spinner />
        </div>
      )}
    </div>
  );
}

type ActionData =
  | {
      data?: unknown;
      status: number;
      headers: Record<string, string>;
    }
  | {
      errorMessage: string;
      status?: number;
    };

export async function action({ request }: ActionFunctionArgs): Promise<ActionData> {
  const { supabase } = createClient(request);

  const data = await request.formData();

  const method = data.get('method') as string;
  const url = data.get('url') as string;
  const body = data.get('body') as string | null;
  const headersJson = data.get('headers') as string;
  const headers = headersJson ? JSON.parse(headersJson) : {};

  try {
    const {
      metrics,
      data,
      status,
      headers: responseHeaders,
    } = await apiRequestWithMetrics({
      method,
      url,
      data: body,
      config: { headers },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from('history').insert([
      {
        user_id: user?.id,
        request_timestamp: metrics.timestamp,
        duration: metrics.duration,
        status_code: status,
        request_size: metrics.requestSize,
        response_size: metrics.responseSize,
        request_method: metrics.requestMethod,
        endpoint: metrics.endpoint,
        headers: headers,
        payload: body,
        error_details: metrics.error || null,
      },
    ]);

    return { data, status, headers: responseHeaders };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        errorMessage: error.response?.data || error.message,
      };
    }

    return {
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}
