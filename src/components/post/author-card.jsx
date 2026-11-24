import Box from '@mui/material/Box';

import { formatDate } from '../../utils/date-utils';
import UserAvatar from '../ui/user-avatar';

/**
 * AuthorCard 컴포넌트 - 게시물 작성자 정보 (사용자 번호, 기록 수, 가입일)
 *
 * Props:
 * @param {object} author - 작성자 { id, name, created_at } [Required]
 * @param {number} postCount - 작성자의 게시물 수 [Optional]
 *
 * Example usage:
 * <AuthorCard author={ post.author } postCount={ 5 } />
 */
function AuthorCard({ author, postCount }) {
  const stats = [
    { label: '기록', value: postCount ?? '-' },
    { label: '가입일', value: author ? formatDate(author.created_at) : '-' },
  ];

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } }>
      <UserAvatar name={ author?.name } size={ 64 } />
      <Box sx={ { fontSize: 17, fontWeight: 700, mt: 1.5 } }>{ author?.name ?? '알 수 없음' }</Box>
      <Box sx={ { fontSize: 13, color: 'text.secondary' } }>MO:ON 멤버 #{ author?.id }</Box>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
        } }
      >
        { stats.map((stat, i) => (
          <Box key={ stat.label } sx={ { borderLeft: i ? 1 : 0, borderColor: 'divider' } }>
            <Box sx={ { fontWeight: 700, fontSize: 15, color: 'secondary.main' } }>{ stat.value }</Box>
            <Box sx={ { fontSize: 12, color: 'text.secondary' } }>{ stat.label }</Box>
          </Box>
        )) }
      </Box>
    </Box>
  );
}

export default AuthorCard;
