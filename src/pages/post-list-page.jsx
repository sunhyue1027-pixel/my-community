import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import PageLayout from '../components/common/page-layout';
import CategoryMenu from '../components/post/category-menu';
import PostCard from '../components/post/post-card';
import EmptyState from '../components/ui/empty-state';
import LoadingView from '../components/ui/loading-view';
import MiniCalendar from '../components/ui/mini-calendar';
import SidePanel from '../components/ui/side-panel';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { CATEGORIES, SORT_OPTIONS, getCategory } from '../utils/constants';

/** 정렬 기준 함수 모음 */
const byCreated = (a, b) => new Date(b.created_at) - new Date(a.created_at);
const SORTERS = {
  latest: byCreated,
  oldest: (a, b) => -byCreated(a, b),
  comments: (a, b) => b.commentCount - a.commentCount || byCreated(a, b),
  schedule: (a, b) => {
    if (!a.schedule_date) return 1;
    if (!b.schedule_date) return -1;
    return a.schedule_date.localeCompare(b.schedule_date);
  },
};

/**
 * PostListPage 컴포넌트 - 전체 게시물 목록 (카테고리 필터, 정렬, 검색, 캘린더 날짜 필터)
 *
 * Props: 없음
 *
 * Example usage:
 * <PostListPage />
 */
function PostListPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  const [query, setQuery] = useState('');
  const [date, setDate] = useState(null);

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, content, category, schedule_date, mood, created_at, author:users(id, name), comments(count)')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError('게시물을 불러오지 못했어요.');
        else setPosts(data.map((p) => ({ ...p, commentCount: p.comments[0]?.count ?? 0 })));
        setIsLoading(false);
      });
  }, []);

  /** 캘린더에 표시할 일정 날짜 */
  const marks = useMemo(() => {
    const result = {};
    posts.forEach((p) => {
      if (p.schedule_date) result[p.schedule_date] = (result[p.schedule_date] ?? 0) + 1;
    });
    return result;
  }, [posts]);

  /** 카테고리별 게시물 수 */
  const counts = useMemo(() => {
    const result = { all: posts.length };
    posts.forEach((p) => {
      result[p.category] = (result[p.category] ?? 0) + 1;
    });
    return result;
  }, [posts]);

  /** 필터 + 정렬 적용된 목록 */
  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return posts
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !date || p.schedule_date === date)
      .filter((p) => !keyword || p.title.toLowerCase().includes(keyword) || p.content.toLowerCase().includes(keyword))
      .sort(SORTERS[sort]);
  }, [posts, category, sort, query, date]);

  const currentCategory = category === 'all' ? null : getCategory(category);

  return (
    <PageLayout>
      <Grid container spacing={ 3.5 }>
        <Grid size={ { xs: 12, md: 3 } } sx={ { order: { xs: 2, md: 1 } } }>
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, position: { md: 'sticky' }, top: { md: 88 } } }>
            <SidePanel title="캘린더">
              <MiniCalendar marks={ marks } selected={ date } onSelect={ setDate } />
              <Box sx={ { fontSize: 12.5, color: 'text.secondary', mt: 1.25 } }>
                { date ? (
                  <>
                    📌 { date } 일정만 보는 중
                    <Button size="small" onClick={ () => setDate(null) } sx={ { minWidth: 0, ml: 0.5, py: 0 } }>해제</Button>
                  </>
                ) : '파란 점이 있는 날짜를 눌러 일정을 확인하세요' }
              </Box>
            </SidePanel>
            <SidePanel title="카테고리">
              <CategoryMenu selected={ category } counts={ counts } onSelect={ setCategory } />
            </SidePanel>
          </Box>
        </Grid>

        <Grid size={ { xs: 12, md: 9 } } sx={ { order: { xs: 1, md: 2 } } }>
          <Box sx={ { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2.5 } }>
            <Box>
              <Box sx={ { fontSize: 14, color: 'primary.main', fontWeight: 600, mb: 0.5 } }>
                { profile ? `${profile.name}님, 좋은 하루예요 ☀️` : 'MO:ON 커뮤니티' }
              </Box>
              <Box component="h1" sx={ { m: 0, fontSize: { xs: '1.6rem', md: '1.9rem' }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 } }>
                { currentCategory ? `${currentCategory.icon} ${currentCategory.label}` : '전체 게시물' }
              </Box>
            </Box>
            { profile && (
              <Button component={ RouterLink } to="/write" variant="contained" startIcon={ <AddIcon /> }>
                새 기록
              </Button>
            ) }
          </Box>

          <Box sx={ { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1.5, mb: 2.25 } }>
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.75 } }>
              { [{ value: 'all', label: '전체' }, ...CATEGORIES].map((c) => (
                <Chip
                  key={ c.value }
                  label={ c.label }
                  clickable
                  onClick={ () => setCategory(c.value) }
                  variant={ category === c.value ? 'filled' : 'outlined' }
                  color={ category === c.value ? 'secondary' : 'default' }
                  sx={ { bgcolor: category === c.value ? undefined : 'background.paper' } }
                />
              )) }
            </Box>
            <Box sx={ { display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } } }>
              <TextField
                size="small"
                value={ query }
                onChange={ (e) => setQuery(e.target.value) }
                placeholder="제목·내용 검색"
                sx={ { flex: 1, width: { sm: 200 }, bgcolor: 'background.paper' } }
                slotProps={ {
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                } }
              />
              <TextField
                select
                size="small"
                value={ sort }
                onChange={ (e) => setSort(e.target.value) }
                sx={ { minWidth: 130, bgcolor: 'background.paper' } }
                slotProps={ { htmlInput: { 'aria-label': '정렬' } } }
              >
                { SORT_OPTIONS.map((option) => (
                  <MenuItem key={ option.value } value={ option.value }>{ option.label }</MenuItem>
                )) }
              </TextField>
            </Box>
          </Box>

          { isLoading && <LoadingView /> }
          { !isLoading && error && <EmptyState message={ error } /> }
          { !isLoading && !error && visiblePosts.length === 0 && (
            <EmptyState message="아직 기록이 없어요.">
              <Button component={ RouterLink } to={ profile ? '/write' : '/login' } variant="contained" size="small">
                { profile ? '첫 기록 남기기' : '로그인하고 기록하기' }
              </Button>
            </EmptyState>
          ) }
          { !isLoading && !error && visiblePosts.length > 0 && (
            <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
              { visiblePosts.map((post) => <PostCard key={ post.id } post={ post } />) }
            </Box>
          ) }
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default PostListPage;
