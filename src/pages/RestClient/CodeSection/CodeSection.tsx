import './CodeSection.scss';
import { Selector } from '@/components';
import { HTTPSnippet } from 'httpsnippet-lite';
import {
  type RestClientHeader,
  restClientPageStore,
} from '@/stores/restClientPageStore/restClientPageStore.ts';
import { useEffect, useState } from 'react';
import fetchToCurl from 'fetch-to-curl';
import { useTranslation } from 'react-i18next';

enum HumanReadableCodeOptions {
  Curl = 'curl',
  JavaScriptFetch = 'JavaScript (Fetch api)',
  JavaScriptXHR = 'JavaScript (XHR)',
  NodeJS = 'NodeJS',
  Python = 'Python',
  Java = 'Java',
  Csharp = 'C#',
  Go = 'Go',
}

enum CodeTargets {
  JavaScript = 'javascript',
  Node = 'node',
  Python = 'python',
  Java = 'java',
  Csharp = 'csharp',
  Go = 'go',
}

enum CodeClients {
  JavaScriptFetch = 'fetch',
  JavaScriptXHR = 'xhr',
  NodeJS = 'request',
  Python = 'requests',
  Java = 'okhttp',
  Csharp = 'restsharp',
  Go = 'native',
}

const getTargetAndClient = (option: HumanReadableCodeOptions) => {
  switch (option) {
    case HumanReadableCodeOptions.JavaScriptFetch:
      return { target: CodeTargets.JavaScript, client: CodeClients.JavaScriptFetch };
    case HumanReadableCodeOptions.JavaScriptXHR:
      return { target: CodeTargets.JavaScript, client: CodeClients.JavaScriptXHR };
    case HumanReadableCodeOptions.NodeJS:
      return { target: CodeTargets.Node, client: CodeClients.NodeJS };
    case HumanReadableCodeOptions.Python:
      return { target: CodeTargets.Python, client: CodeClients.Python };
    case HumanReadableCodeOptions.Java:
      return { target: CodeTargets.Java, client: CodeClients.Java };
    case HumanReadableCodeOptions.Csharp:
      return { target: CodeTargets.Csharp, client: CodeClients.Csharp };
    case HumanReadableCodeOptions.Go:
      return { target: CodeTargets.Go, client: CodeClients.Go };
    default:
      throw new Error(`Getting target for "${option}" code option is not implemented.`);
  }
};

const codeOptions = Object.values(HumanReadableCodeOptions);

export default function CodeSection() {
  const [codeOption, setCodeOption] = useState<HumanReadableCodeOptions>(
    HumanReadableCodeOptions.Csharp
  );
  const [codeResult, setCodeResult] = useState<string>('');

  const { t } = useTranslation('rest-client');

  const {
    requestMethod,
    interpolatedRequestUrl,
    interpolatedRequestHeaders,
    interpolatedRequestBody,
  } = restClientPageStore();

  const getRequestCode = async () => {
    const params: GetRequestCodeSnippetParams = {
      codeOption,
      method: requestMethod,
      url: interpolatedRequestUrl,
      headers: interpolatedRequestHeaders.filter((h) => h.name && h.value),
      body: interpolatedRequestBody,
    };

    const getRequestCodeSnippet =
      params.codeOption === HumanReadableCodeOptions.Curl
        ? getCurlRequestCodeSnippet
        : getGeneralRequestCodeSnippet;

    try {
      const codeSnippet = await getRequestCodeSnippet(params);
      setCodeResult(codeSnippet);
    } catch (error) {
      if (error instanceof Error) {
        setCodeResult(error.message);
      } else {
        setCodeResult('Error generating code');
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getRequestCode();
    })();
  }, [
    requestMethod,
    interpolatedRequestUrl,
    interpolatedRequestHeaders,
    interpolatedRequestBody,
    codeOption,
  ]);

  return (
    <div className="code-container" data-testid="code-section">
      <div className="title-container">
        <p className="title">{t('code')}:</p>
        <Selector
          id="code"
          data={codeOptions}
          onChange={(e) => setCodeOption(e.target.value as HumanReadableCodeOptions)}
          value={codeOption}
        />
      </div>
      <div className="content-container" data-testid="content-container">
        <pre data-testid="pre-code">{codeResult}</pre>
      </div>
    </div>
  );
}

interface GetRequestCodeSnippetParams {
  codeOption?: HumanReadableCodeOptions;
  method: string;
  url: string;
  headers: RestClientHeader[];
  body?: string;
}

const getGeneralRequestCodeSnippet = async ({
  codeOption,
  method,
  url,
  headers,
  body,
}: GetRequestCodeSnippetParams): Promise<string> => {
  if (!codeOption) {
    throw new Error(`Can't create request code snippet: codeOption parameter is required.`);
  }

  const headersForSnippet = headers.map((h) => ({ name: h.name, value: h.value }));

  const snippet = new HTTPSnippet({
    method,
    url,
    headers: headersForSnippet,
    postData: body ? { mimeType: 'application/json', text: body } : undefined,
    httpVersion: '1.1',
    cookies: [],
    queryString: [],
    headersSize: -1,
    bodySize: -1,
  });
  const { target, client } = getTargetAndClient(codeOption);
  const options = { indent: ' ' };
  const converted = snippet.convert(target, client, options);

  if (Array.isArray(converted)) {
    return converted.join('\n');
  }

  return (converted as Promise<string>) ?? '';
};

const getCurlRequestCodeSnippet = async ({
  method,
  url,
  headers,
  body,
}: GetRequestCodeSnippetParams): Promise<string> => {
  const headersForSnippet = headers.reduce<Record<string, string>>((headers, h) => {
    headers[h.name] = h.value;
    return headers;
  }, {});

  const converted = fetchToCurl({
    url,
    headers: headersForSnippet,
    method,
    body,
  });

  return converted.replace(`'${url}'`, `"${url}"`);
};
