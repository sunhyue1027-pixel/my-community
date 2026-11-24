import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import { useAuth } from '../../hooks/use-auth';
import { supabase } from '../../lib/supabase';
import { timeAgo } from '../../utils/date-utils';
import UserAvatar from '../ui/user-avatar';

/**
 * CommentSection 컴포넌트 - 댓글 목록 + 작성 + 삭제
 *
 * Props:
 * @param {number} postId - 게시물 번호 [Required]
 * @param {number} postAuthorId - 게시물 작성자 번호 ('작성자' 배지 표시용) [Required]
 *
 * Example usage:
 * <CommentSection postId={ 1 } postAuthorId={ 3 } />
 */
function CommentSection({ postId, postAuthorId }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  /** 댓글 목록 다시 불러오기 */
  const reloadComments = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    let isIgnored = false;
    supabase
      .from('comments')
      .select('id, content, created_at, user_id, author:users(id, name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!isIgnored) setComments(data ?? []);
      });
    return () => {
      isIgnored = true;
    };
  }, [postId, reloadKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSending(true);
    const { error } = await supabase
      .from('comments')
      .insert({ content: content.trim(), post_id: postId, user_id: profile.id });
    setIsSending(false);
    if (error) {
      alert('댓글을 등록하지 못했어요.');
      return;
    }
    setContent('');
    reloadComments();
  };

  const handleDelete = async (commentId) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    reloadComments();
  };

  return (
    <Paper variant="outlined" sx={ { mt: 2.5, p: { xs: 2.5, md: 3.5 }, borderRadius: 3.5 } }>
      <Box component="h3" sx={ { m: 0, mb: 2, fontSize: 17 } }>
        댓글 <Box component="span" sx={ { color: 'primary.main' } }>{ comments.length }</Box>
      </Box>

      { profile ? (
        <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', gap: 1.25, alignItems: 'flex-start', mb: 1 } }>
          <UserAvatar name={ profile.name } size={ 36 } />
          <TextField
            value={ content }
            onChange={ (e) => setContent(e.target.value) }
            placeholder="따뜻한 응원의 댓글을 남겨주세요"
            multiline
            minRows={ 2 }
            fullWidth
            size="small"
            slotProps={ { htmlInput: { maxLength: 1000 } } }
          />
          <Button type="submit" variant="contained" disabled={ isSending || !content.trim() } sx={ { flexShrink: 0, alignSelf: 'stretch' } }>
            등록
          </Button>
        </Box>
      ) : (
        <Box sx={ { bgcolor: '#F1F5FF', borderRadius: 2.5, p: 1.75, fontSize: 14, color: 'text.secondary', textAlign: 'center' } }>
          <Box component={ RouterLink } to="/login" sx={ { color: 'primary.main', fontWeight: 700 } }>로그인</Box>하고 댓글을 남겨보세요.
        </Box>
      ) }

      <Box component="ul" sx={ { listStyle: 'none', m: 0, p: 0 } }>
        { comments.map((c, i) => (
          <Box component="li" key={ c.id } sx={ { display: 'flex', gap: 1.5, py: 2, borderTop: i ? 1 : 0, borderColor: 'divider' } }>
            <UserAvatar name={ c.author?.name } size={ 36 } />
            <Box sx={ { flex: 1, minWidth: 0 } }>
              <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, color: 'text.secondary', mb: 0.25 } }>
                <Box component="strong" sx={ { color: 'text.primary', fontSize: 14 } }>{ c.author?.name ?? '알 수 없음' }</Box>
                { c.user_id === postAuthorId && (
                  <Chip label="작성자" size="small" sx={ { height: 20, fontSize: 11, bgcolor: 'primary.light', color: 'primary.main' } } />
                ) }
                <span>{ timeAgo(c.created_at) }</span>
                { profile?.id === c.user_id && (
                  <Button size="small" color="error" onClick={ () => handleDelete(c.id) } sx={ { ml: 'auto', minWidth: 0, fontSize: 12.5 } }>
                    삭제
                  </Button>
                ) }
              </Box>
              <Box sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 15, lineHeight: 1.6 } }>{ c.content }</Box>
            </Box>
          </Box>
        )) }
        { comments.length === 0 && (
          <Box component="li" sx={ { textAlign: 'center', color: 'text.secondary', fontSize: 14, py: 3 } }>
            첫 댓글을 남겨주세요 ✨
          </Box>
        ) }
      </Box>
    </Paper>
  );
}

export default CommentSection;
