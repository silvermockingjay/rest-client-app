import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    file: './layouts/MainLayout/MainLayout.tsx',
    children: [
      { index: true, file: './pages/Home/Home.tsx' },
      { path: 'signup', file: './pages/SignUp/SignUp.tsx' },
      { path: 'login', file: './pages/SignIn/SignIn.tsx' },
      {
        path: 'rest-client/:method?/:encodedUrl?/:encodedBody?',
        file: './pages/RestClient/RestClient.tsx',
      },
      {
        path: 'history',
        file: './pages/History/History.tsx',
      },
      {
        path: 'logout',
        file: './pages/Logout/Logout.tsx',
      },
      {
        path: 'variables',
        file: './pages/Variables/Variables.tsx',
      },
      {
        path: '*',
        file: './pages/NotFound/NotFound.tsx',
      },
    ],
  },
] satisfies RouteConfig;
