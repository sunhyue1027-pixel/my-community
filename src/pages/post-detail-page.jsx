import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PageLayout from '../components/common/page-layout';
import AuthorCard from '../components/post/author-card';
import CommentSection from '../components/post/comment-section';
import DiaryBox from '../components/post/diary-box';
import CategoryBadge from '../components/ui/category-badge';
import EmptyState from '../components/ui/empty-state';
import LoadingView from '../components/ui/loading-view';
import MiniCalendar from '../components/ui/mini-calendar';
import SidePanel from '../components/ui/side-panel';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { formatDate, fromDateKey } from '../utils/date-utils';

/**
 * PostDetailPage 컴포넌트 - 게시물 상세 (다이어리, 본문, 캘린더, 작성자 정보, 댓글)
 *
 * Props: 없음 (URL의 :id 사용)
 *
 * Example usage:
 * <Route path="/posts/:id" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [authorPostCount, setAuthorPostCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isIgnored = false;

    async function load() {
      setIsLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('*, author:users(id, name, created_at)')
        .eq('id', id)
        .maybeSingle();
      if (isIgnored) return;
      setPost(data);

      if (data?.author) {
        const { count } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', data.author.id);
        if (!isIgnored) setAuthorPostCount(count ?? 0);
      }
      if (!isIgnored) setIsLoading(false);
    }

    load();
    return () => {
      isIgnored = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('이 기록을 삭제할까요?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) alert('삭제하지 못했어요.');
    else navigate('/');
  };

  if (isLoading) return <LoadingView />;

  if (!post) {
    return (
      <PageLayout maxWidth="md">
        <EmptyState message="게시물을 찾을 수 없어요.">
          <Button component={ RouterLink } to="/" variant="contained" size="small">목록으로</Button>
        </EmptyState>
      </PageLayout>
    );
  }

  const isOwner = profile?.id === post.user_id;
  const isEdited = new Date(post.updated_at) - new Date(post.created_at) > 1000;
  const marks = post.schedule_date ? { [post.schedule_date]: 1 } : {};
  const calendarStart = post.schedule_date ? fromDateKey(post.schedule_date) : new Date(post.created_at);

  return (
    <PageLayout>
      <Button component={ RouterLink } to="/" startIcon={ <ArrowBackIcon /> } sx={ { color: 'text.secondary', mb: 2 } }>
        목록으로
      </Button>

      <Grid container spacing={ 3.5 }>
        <Grid size={ { xs: 12, md: 9 } }>
          <Paper variant="outlined" component="article" sx={ { p: { xs: 2.5, md: 4 }, borderRadius: 3.5 } }>
            <CategoryBadge category={ post.category } />
            <Box
              component="h1"
              sx={ { m: 0, mt: 1.5, mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35 } }
            >
              { post.title }
            </Box>
            <Box
              sx={ {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 0.75,
                fontSize: 13.5,
                color: 'text.secondary',
                pb: 2.5,
                borderBottom: 1,
                borderColor: 'divider',
              } }
            >
              <span>{ post.author?.name }</span>
              <span>·</span>
              <span>작성 { formatDate(post.created_at, true) }</span>
              { isEdited && (
                <>
                  <span>·</span>
                  <span>수정 { formatDate(post.updated_at, true) }</span>
                </>
              ) }
              { isOwner && (
                <Box sx={ { ml: { sm: 'auto' }, display: 'flex', gap: 0.75, width: { xs: '100%', sm: 'auto' } } }>
                  <Button component={ RouterLink } to={ `/posts/${post.id}/edit` } size="small" variant="outlined">수정</Button>
                  <Button size="small" variant="outlined" color="error" onClick={ handleDelete }>삭제</Button>
                </Box>
              ) }
            </Box>

            <DiaryBox scheduleDate={ post.schedule_date } mood={ post.mood } />

            <Box sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 16, lineHeight: 1.85, pt: 3 } }>
              { post.content }
            </Box>
          </Paper>

          <CommentSection postId={ post.id } postAuthorId={ post.user_id } />
        </Grid>

        <Grid size={ { xs: 12, md: 3 } }>
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, position: { md: 'sticky' }, top: { md: 88 } } }>
            <SidePanel title="작성자">
              <AuthorCard author={ post.author } postCount={ authorPostCount } />
            </SidePanel>
            <SidePanel title="일정 캘린더">
              <MiniCalendar key={ post.id } marks={ marks } selected={ post.schedule_date } initialDate={ calendarStart } />
              <Box sx={ { fontSize: 12.5, color: 'text.secondary', mt: 1.25 } }>
                { post.schedule_date ? `🗓️ ${formatDate(post.schedule_date)} 일정이에요` : '등록된 일정 날짜가 없어요' }
              </Box>
            </SidePanel>
          </Box>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default PostDetailPage;
