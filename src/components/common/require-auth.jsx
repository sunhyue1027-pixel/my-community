import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import LoadingView from '../ui/loading-view';

/**
 * RequireAuth 컴포넌트 - 로그인한 사용자만 접근 가능한 페이지 보호
 *
 * Props:
 * @param {node} children - 보호할 페이지 [Required]
 *
 * Example usage:
 * <RequireAuth><PostFormPage /></RequireAuth>
 */
function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingView />;
  return user ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;
