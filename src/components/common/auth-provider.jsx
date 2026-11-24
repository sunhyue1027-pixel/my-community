import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '../../hooks/auth-context';
import { supabase } from '../../lib/supabase';

/**
 * AuthProvider 컴포넌트 - Supabase Auth 세션과 users 테이블 프로필을 전역으로 제공
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** users 테이블에서 내 프로필(사용자 번호, 이름) 조회 */
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    // 회원가입 직후에는 트리거가 행을 만드는 중일 수 있어 몇 번 재시도
    for (let i = 0; i < 3; i++) {
      const { data } = await supabase
        .from('users')
        .select('id, name, created_at')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      if (data) {
        setProfile({ ...data, email: authUser.email });
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setProfile(null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // 콜백 안에서 바로 Supabase 호출을 await 하지 않도록 분리 (supabase-js 권장)
      setTimeout(() => loadProfile(newSession?.user), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    isLoading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (name, email, password) => supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    }),
    signOut: () => supabase.auth.signOut(),
  }), [session, profile, isLoading]);

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
