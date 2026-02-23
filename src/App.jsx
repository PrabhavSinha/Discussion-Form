import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ForumProvider } from './context/ForumContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import NotificationContainer from './components/UI/Notifications.jsx';
import { LoadingState } from './components/UI/LoadingSpinner.jsx';

// Lazy load pages for code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const ThreadPage = lazy(() => import('./pages/ThreadPage.jsx'));
const NewThreadPage = lazy(() => import('./pages/NewThreadPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageLoader() {
  return <LoadingState message="Loading page…" />;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] paper-texture">
      <Navigation />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/thread/:threadId" element={<ThreadPage />} />
          <Route path="/new" element={<NewThreadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <NotificationContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ForumProvider>
          <AppLayout />
        </ForumProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
