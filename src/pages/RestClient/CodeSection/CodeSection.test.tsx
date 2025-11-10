import { beforeEach, describe, test, expect, afterEach } from 'vitest';
import CodeSection from '@/pages/RestClient/CodeSection/CodeSection.tsx';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import userEvent from '@testing-library/user-event';

async function renderComponent() {
  return await act(() => {
    return render(<CodeSection />);
  });
}

describe('<CodeSection>', () => {
  beforeEach(() => {
    restClientPageStore.setState(restClientPageStore.getInitialState());
  });

  afterEach(() => {
    cleanup();
  });

  describe('the necessary elements', () => {
    test('renders a selection of languages', async () => {
      await renderComponent();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('renders a content', async () => {
      await renderComponent();

      expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });
  });

  describe('test common case', () => {
    const initStoreValue = {
      requestMethod: 'GET',
      interpolatedRequestUrl: 'https://stapi.co/animal/search',
      interpolatedRequestHeaders: [{ id: 'id', name: 'Content-Type', value: 'application/json' }],
      interpolatedRequestBody: 'testBody',
    };

    test('checks content for curl', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'curl');

      const code =
        'curl "https://stapi.co/animal/search" -X GET -H "Content-Type: application/json" --data-binary \'testBody\'';
      await waitFor(() => {
        expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
      });
    });

    test('checks content for JavaScript (Fetch api)', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'JavaScript (Fetch api)');

      const code = `
const url = 'https://stapi.co/animal/search';
const options = {method: 'GET', headers: {'Content-Type': 'application/json'}, body: 'testBody'};
try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for JavaScript (XHR)', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'JavaScript (XHR)');

      const code = `
const data = 'testBody';

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
 if (this.readyState === this.DONE) {
  console.log(this.responseText);
 }
});

xhr.open('GET', 'https://stapi.co/animal/search');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.send(data);
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for JNodeJS', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'NodeJS');

      const code = `
const request = require('request');

const options = {
  method: 'GET',
  url: 'https://stapi.co/animal/search',
  headers: {'Content-Type': 'application/json'},
  body: 'testBody'
};

request(options, function (error, response, body) {
 if (error) throw new Error(error);

 console.log(body);
});
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for Python', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Python');

      const code = `
import requests

url = "https://stapi.co/animal/search"

payload = "testBody"
headers = {"Content-Type": "application/json"}

response = requests.get(url, data=payload, headers=headers)

print(response.json())
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for Java', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Java');

      const code = `
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("text/plain");
RequestBody body = RequestBody.create(mediaType, "testBody");
Request request = new Request.Builder()
 .url("https://stapi.co/animal/search")
 .get()
 .addHeader("Content-Type", "application/json")
 .build();

Response response = client.newCall(request).execute();
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for C#', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'C#');

      const code = `
var client = new RestClient("https://stapi.co/animal/search");
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "testBody", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });

    test('checks content for Go', async () => {
      restClientPageStore.setState(initStoreValue);

      await renderComponent();
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Go');

      const code = `
package main

import (
\t"fmt"
\t"strings"
\t"net/http"
\t"io"
)

func main() {

\turl := "https://stapi.co/animal/search"

\tpayload := strings.NewReader("testBody")

\treq, _ := http.NewRequest("GET", url, payload)

\treq.Header.Add("Content-Type", "application/json")

\tres, _ := http.DefaultClient.Do(req)

\tdefer res.Body.Close()
\tbody, _ := io.ReadAll(res.Body)

\tfmt.Println(res)
\tfmt.Println(string(body))

}
`
        .replace(/\s+/g, ' ')
        .trim();

      expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
    });
  });
});
