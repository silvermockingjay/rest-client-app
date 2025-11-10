import enAuthorization from './en/authorization.json';
import enHeader from './en/header.json';
import enHistory from './en/history.json';
import enHome from './en/home.json';
import enLanguages from './en/languages.json';
import enNotFound from './en/not-found.json';
import enRestClient from './en/rest-client.json';
import enValidation from './en/validation.json';
import enVariables from './en/variables.json';
import ruAuthorization from './ru/authorization.json';
import ruHeader from './ru/header.json';
import ruHistory from './ru/history.json';
import ruHome from './ru/home.json';
import ruLanguages from './ru/languages.json';
import ruNotFound from './ru/not-found.json';
import ruRestClient from './ru/rest-client.json';
import ruValidation from './ru/validation.json';
import ruVariables from './ru/variables.json';

export const resources = {
  en: {
    authorization: enAuthorization,
    header: enHeader,
    history: enHistory,
    home: enHome,
    languages: enLanguages,
    'not-found': enNotFound,
    'rest-client': enRestClient,
    validation: enValidation,
    variables: enVariables,
  },
  ru: {
    authorization: ruAuthorization,
    header: ruHeader,
    history: ruHistory,
    home: ruHome,
    languages: ruLanguages,
    'not-found': ruNotFound,
    'rest-client': ruRestClient,
    validation: ruValidation,
    variables: ruVariables,
  },
};
