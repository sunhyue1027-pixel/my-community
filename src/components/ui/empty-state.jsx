import Box from '@mui/material/Box';

/**
 * EmptyState 컴포넌트 - 데이터가 없거나 오류일 때 안내 박스
 *
 * Props:
 * @param {string} message - 안내 문구 [Required]
 * @param {node} children - 하단 버튼 등 추가 요소 [Optional]
 *
 * Example usage:
 * <EmptyState message="아직 기록이 없어요."><Button>글쓰기</Button></EmptyState>
 */
function EmptyState({ message, children }) {
  return (
    <Box
      sx={ {
        bgcolor: 'background.paper',
        border: '1px dashed #C6D6FF',
        borderRadius: 3.5,
        py: 7,
        px: 3,
        textAlign: 'center',
        color: 'text.secondary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.75,
      } }
    >
      <Box>{ message }</Box>
      { children }
    </Box>
  );
}

export default EmptyState;
