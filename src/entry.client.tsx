import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { HydratedRouter } from 'react-router/dom';

import './styles/globals.scss';

ReactDOM.hydrateRoot(
  document,

  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>
);
