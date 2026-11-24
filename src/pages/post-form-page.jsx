import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PageLayout from '../components/common/page-layout';
import LoadingView from '../components/ui/loading-view';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { CATEGORIES, MOODS } from '../utils/constants';
import { toDateKey } from '../utils/date-utils';

const labelSx = { fontSize: 13.5, fontWeight: 600, color: 'text.secondary', mb: 1 };

/**
 * PostFormPage 컴포넌트 - 새 기록 작성 / 수정 (URL에 :id가 있으면 수정 모드)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/write" element={ <PostFormPage /> } />
 */
function PostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    title: '',
    content: '',
    category: 'schedule',
    schedule_date: toDateKey(new Date()),
    mood: '',
  }));
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const backTo = isEdit ? `/posts/${id}` : '/';

  useEffect(() => {
    if (!isEdit || !profile) return;
    supabase
      .from('posts')
      .select('title, content, category, schedule_date, mood, user_id')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        // 본인 글이 아니면 상세 페이지로 돌려보냄
        if (!data || data.user_id !== profile.id) {
          navigate(`/posts/${id}`, { replace: true });
          return;
        }
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
          schedule_date: data.schedule_date ?? '',
          mood: data.mood ?? '',
        });
        setIsLoading(false);
      });
  }, [id, isEdit, profile, navigate]);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    if (!profile) {
      setError('프로필 정보를 불러오는 중이에요. 잠시 후 다시 시도해주세요.');
      return;
    }
    setIsSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      schedule_date: form.schedule_date || null,
      mood: form.mood || null,
    };

    const { data, error: saveError } = isEdit
      ? await supabase.from('posts').update(payload).eq('id', id).select('id').single()
      : await supabase.from('posts').insert({ ...payload, user_id: profile.id }).select('id').single();

    setIsSaving(false);
    if (saveError) {
      setError('저장하지 못했어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    navigate(`/posts/${data.id}`);
  };

  if (isLoading) return <LoadingView />;

  return (
    <PageLayout maxWidth="md">
      <Button component={ RouterLink } to={ backTo } startIcon={ <ArrowBackIcon /> } sx={ { color: 'text.secondary', mb: 2 } }>
        돌아가기
      </Button>

      <Paper
        variant="outlined"
        component="form"
        onSubmit={ handleSubmit }
        sx={ { p: { xs: 2.5, md: 4 }, borderRadius: 3.5, display: 'flex', flexDirection: 'column', gap: 3 } }
      >
        <Box component="h1" sx={ { m: 0, fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 800 } }>
          { isEdit ? '기록 수정하기' : '오늘의 기록 남기기' }
        </Box>

        <Box>
          <Box sx={ labelSx }>카테고리</Box>
          <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.75 } }>
            { CATEGORIES.map((c) => (
              <Chip
                key={ c.value }
                label={ `${c.icon} ${c.label}` }
                clickable
                onClick={ () => handleChange('category', c.value) }
                variant={ form.category === c.value ? 'filled' : 'outlined' }
                color={ form.category === c.value ? 'secondary' : 'default' }
              />
            )) }
          </Box>
        </Box>

        <Grid container spacing={ 2 }>
          <Grid size={ { xs: 12, sm: 6 } }>
            <Box sx={ labelSx }>일정 날짜 (캘린더에 표시돼요)</Box>
            <TextField
              type="date"
              fullWidth
              value={ form.schedule_date }
              onChange={ (e) => handleChange('schedule_date', e.target.value) }
            />
          </Grid>
          <Grid size={ { xs: 12, sm: 6 } }>
            <Box sx={ labelSx }>오늘의 기분</Box>
            <ToggleButtonGroup
              exclusive
              value={ form.mood }
              onChange={ (_e, value) => handleChange('mood', value ?? '') }
              aria-label="오늘의 기분"
            >
              { MOODS.map((m) => (
                <ToggleButton key={ m.value } value={ m.value } title={ m.label } aria-label={ m.label } sx={ { fontSize: 22, px: 1.5, py: 0.75 } }>
                  { m.icon }
                </ToggleButton>
              )) }
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        <TextField
          label="제목"
          value={ form.title }
          onChange={ (e) => handleChange('title', e.target.value) }
          placeholder="예) 이번 주 운동 루틴 정리"
          slotProps={ { htmlInput: { maxLength: 100 } } }
        />

        <TextField
          label="내용"
          value={ form.content }
          onChange={ (e) => handleChange('content', e.target.value) }
          multiline
          minRows={ 10 }
          placeholder={ '오늘의 일정, 소비, 운동 기록을 자유롭게 적어보세요.\n\n- 오전 9시 요가 30분\n- 점심 12,000원\n- 저녁 독서 1시간' }
          slotProps={ { htmlInput: { maxLength: 10000 } } }
        />

        { error && <Alert severity="error">{ error }</Alert> }

        <Box sx={ { display: 'flex', justifyContent: 'flex-end', gap: 1 } }>
          <Button component={ RouterLink } to={ backTo } variant="outlined" color="inherit" sx={ { borderColor: 'divider' } }>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={ isSaving }>
            { isSaving ? '저장 중…' : isEdit ? '수정 완료' : '기록하기' }
          </Button>
        </Box>
      </Paper>
    </PageLayout>
  );
}

export default PostFormPage;
