import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';

import AuthProvider from './components/common/auth-provider';
import Footer from './components/common/footer';
import Header from './components/common/header';
import RequireAuth from './components/common/require-auth';
import AuthPage from './pages/auth-page';
import PostDetailPage from './pages/post-detail-page';
import PostFormPage from './pages/post-form-page';
import PostListPage from './pages/post-list-page';

/**
 * App 컴포넌트 - 라우팅 및 전체 레이아웃
 * GitHub Pages는 서버 라우팅이 없어 새로고침 시 404를 피하려고 HashRouter 사용
 *
 * Props: 없음
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Box sx={ { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' } }>
          <Header />
          <Box component="main" sx={ { flex: 1, display: 'flex', flexDirection: 'column' } }>
            <Routes>
              <Route path="/" element={ <PostListPage /> } />
              <Route path="/login" element={ <AuthPage /> } />
              <Route path="/posts/:id" element={ <PostDetailPage /> } />
              <Route path="/write" element={ <RequireAuth><PostFormPage /></RequireAuth> } />
              <Route path="/posts/:id/edit" element={ <RequireAuth><PostFormPage /></RequireAuth> } />
              <Route path="*" element={ <Navigate to="/" replace /> } />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
