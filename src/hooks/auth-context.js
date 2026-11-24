import { createContext } from 'react';

/**
 * 로그인 상태를 공유하는 Context
 * 값: { session, user, profile, isLoading, signIn, signUp, signOut }
 */
export const AuthContext = createContext(null);
