import { useContext } from 'react';

import { AuthContext } from './auth-context';

/**
 * 로그인 정보를 가져오는 커스텀 훅
 * @returns {{ session, user, profile, isLoading, signIn, signUp, signOut }}
 */
export function useAuth() {
  return useContext(AuthContext);
}
