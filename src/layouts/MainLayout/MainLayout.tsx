import { Outlet } from 'react-router-dom';

import { Footer, Header, ErrorBoundary, MainFallback } from '@/components';

export default function MainLayout() {
  return (
    <>
      <Header />
      <ErrorBoundary fallback={<MainFallback />}>
        <main className="main">
          <Outlet />
        </main>
      </ErrorBoundary>
      <Footer />
    </>
  );
}
