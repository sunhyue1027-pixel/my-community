import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';

import PageLayout from '../components/common/page-layout';
import BrandLogo from '../components/ui/brand-logo';
import { useAuth } from '../hooks/use-auth';

const ERROR_MESSAGES = {
  'Invalid login credentials': '아이디(이메일) 또는 비밀번호가 올바르지 않아요.',
  'Email not confirmed': '이메일 인증이 아직 완료되지 않았어요. 메일함을 확인해주세요.',
  'User already registered': '이미 가입된 이메일이에요.',
};

const FEATURES = ['🗓️ 캘린더로 보는 나의 일정', '💳 소비 기록과 습관 점검', '🏃 운동·자기관리 루틴 공유'];

const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' };

/**
 * AuthPage 컴포넌트 - 로그인 / 회원가입 탭 페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <AuthPage />
 */
function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = tab === 'signup';

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTabChange = (next) => {
    setTab(next);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (isSignup) {
      if (!form.name.trim()) return setError('이름을 입력해주세요.');
      if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 해요.');
      if (form.password !== form.confirm) return setError('비밀번호가 서로 일치하지 않아요.');
    }

    setIsSubmitting(true);
    if (isSignup) {
      const { data, error: signUpError } = await signUp(form.name.trim(), form.email.trim(), form.password);
      if (signUpError) {
        setError(ERROR_MESSAGES[signUpError.message] ?? signUpError.message);
      } else if (!data.session) {
        setNotice('가입 확인 메일을 보냈어요! 메일 인증 후 로그인해주세요.');
        setTab('login');
      }
    } else {
      const { error: signInError } = await signIn(form.email.trim(), form.password);
      if (signInError) setError(ERROR_MESSAGES[signInError.message] ?? signInError.message);
    }
    setIsSubmitting(false);
  };

  return (
    <PageLayout isVerticalCenter>
      <Grid container spacing={ { xs: 4, md: 6 } } sx={ { alignItems: 'center' } }>
        <Grid size={ { xs: 12, md: 7 } }>
          <BrandLogo size={ 28 } />
          <Box
            component="h1"
            sx={ {
              fontSize: { xs: '2rem', md: '2.6rem' },
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: '-0.03em',
              color: 'secondary.main',
              mt: { xs: 2, md: 3.5 },
              mb: 2,
            } }
          >
            오늘의 일상을<br />차곡차곡 정돈해요
          </Box>
          <Box sx={ { color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.6 } }>
            일정, 소비, 자기관리, 운동, 다이어리까지.<br />
            나의 루틴을 기록하고 함께 나누는 공간이에요.
          </Box>
          <Box sx={ { display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.25, mt: 3.5 } }>
            { FEATURES.map((feature) => (
              <Paper key={ feature } variant="outlined" sx={ { px: 2, py: 1.5, width: 'fit-content', borderRadius: 2.5 } }>
                { feature }
              </Paper>
            )) }
          </Box>
        </Grid>

        <Grid size={ { xs: 12, md: 5 } }>
          <Paper
            variant="outlined"
            sx={ { p: { xs: 3, md: 4 }, borderRadius: 5, boxShadow: '0 20px 60px rgba(42, 79, 143, 0.1)' } }
          >
            <Tabs
              value={ tab }
              onChange={ (_e, next) => handleTabChange(next) }
              variant="fullWidth"
              sx={ {
                mb: 3.5,
                bgcolor: '#EEF2F8',
                borderRadius: 3,
                p: 0.5,
                minHeight: 0,
                '& .MuiTabs-indicator': { height: '100%', borderRadius: 2.25, bgcolor: '#fff', boxShadow: '0 1px 4px rgba(22, 32, 58, 0.1)' },
                '& .MuiTab-root': { zIndex: 1, minHeight: 40, fontWeight: 700, fontSize: 15 },
              } }
            >
              <Tab value="login" label="로그인" />
              <Tab value="signup" label="회원가입" />
            </Tabs>

            <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
              { isSignup && (
                <TextField
                  label="이름"
                  name="name"
                  value={ form.name }
                  onChange={ handleChange }
                  placeholder="표시될 이름"
                  autoComplete="name"
                  slotProps={ { htmlInput: { maxLength: 30 } } }
                />
              ) }
              <TextField
                label="아이디 (이메일)"
                name="email"
                type="email"
                value={ form.email }
                onChange={ handleChange }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <TextField
                label="비밀번호"
                name="password"
                type="password"
                value={ form.password }
                onChange={ handleChange }
                placeholder="6자 이상"
                autoComplete={ isSignup ? 'new-password' : 'current-password' }
                required
              />
              { isSignup && (
                <TextField
                  label="비밀번호 확인"
                  name="confirm"
                  type="password"
                  value={ form.confirm }
                  onChange={ handleChange }
                  autoComplete="new-password"
                  required
                />
              ) }

              { error && <Alert severity="error">{ error }</Alert> }
              { notice && <Alert severity="success">{ notice }</Alert> }

              <Button type="submit" variant="contained" size="large" disabled={ isSubmitting } sx={ { py: 1.5 } }>
                { isSubmitting ? '처리 중…' : isSignup ? '가입하기' : '로그인' }
              </Button>
            </Box>

            <Box sx={ { mt: 2.75, textAlign: 'center', fontSize: 14, color: 'text.secondary' } }>
              { isSignup ? '이미 계정이 있으신가요?' : '아직 MO:ON 회원이 아니신가요?' }
              <Button
                size="small"
                onClick={ () => handleTabChange(isSignup ? 'login' : 'signup') }
                sx={ { ml: 0.5, fontWeight: 700 } }
              >
                { isSignup ? '로그인하기 →' : '회원가입하고 루틴 시작하기 →' }
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default AuthPage;
