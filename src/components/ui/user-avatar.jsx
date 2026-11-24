import Avatar from '@mui/material/Avatar';

/**
 * UserAvatar 컴포넌트 - 이름 첫 글자로 만든 블루 그라데이션 아바타
 *
 * Props:
 * @param {string} name - 사용자 이름 [Optional, 기본값: '?']
 * @param {number} size - 지름(px) [Optional, 기본값: 32]
 *
 * Example usage:
 * <UserAvatar name="홍길동" size={ 40 } />
 */
function UserAvatar({ name = '?', size = 32 }) {
  return (
    <Avatar
      sx={ {
        width: size,
        height: size,
        fontSize: size * 0.42,
        fontWeight: 700,
        background: 'linear-gradient(135deg, #6B93FF, #1F55E0)',
      } }
    >
      { name?.[0] ?? '?' }
    </Avatar>
  );
}

export default UserAvatar;
