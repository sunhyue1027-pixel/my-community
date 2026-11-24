import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import { getCategory, getMood } from '../../utils/constants';
import { timeAgo } from '../../utils/date-utils';
import CategoryBadge from '../ui/category-badge';
import UserAvatar from '../ui/user-avatar';

/**
 * PostCard 컴포넌트 - 게시물 목록의 카드 한 개
 *
 * Props:
 * @param {object} post - 게시물 { id, title, content, category, schedule_date, mood, created_at, author, commentCount } [Required]
 *
 * Example usage:
 * <PostCard post={ post } />
 */
function PostCard({ post }) {
  const cat = getCategory(post.category);
  const mood = getMood(post.mood);

  return (
    <Paper
      variant="outlined"
      component={ RouterLink }
      to={ `/posts/${post.id}` }
      sx={ {
        display: 'flex',
        borderRadius: 3.5,
        overflow: 'hidden',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: '#C6D6FF',
          boxShadow: '0 10px 28px rgba(47, 107, 255, 0.12)',
        },
      } }
    >
      <Box sx={ { width: 4, flexShrink: 0, bgcolor: cat.color } } />
      <Box sx={ { p: { xs: 2, md: 2.5 }, flex: 1, minWidth: 0 } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' } }>
          <CategoryBadge category={ post.category } />
          { post.schedule_date && (
            <Chip size="small" variant="outlined" label={ `🗓️ ${post.schedule_date}` } sx={ { fontSize: 12, color: 'text.secondary' } } />
          ) }
          { mood && <Box component="span" title={ mood.label }>{ mood.icon }</Box> }
        </Box>
        <Box component="h2" sx={ { m: 0, mb: 0.5, fontSize: { xs: 16, md: 17 }, fontWeight: 700, lineHeight: 1.4 } }>
          { post.title }
        </Box>
        <Box
          sx={ {
            color: 'text.secondary',
            fontSize: 14,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } }
        >
          { post.content }
        </Box>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5, fontSize: 13, color: 'text.secondary' } }>
          <UserAvatar name={ post.author?.name } size={ 22 } />
          <span>{ post.author?.name ?? '알 수 없음' }</span>
          <Box component="span" sx={ { color: 'divider' } }>·</Box>
          <span>{ timeAgo(post.created_at) }</span>
          <Box sx={ { ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 } }>
            <ChatBubbleOutlineIcon sx={ { fontSize: 15 } } />
            { post.commentCount }
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default PostCard;
