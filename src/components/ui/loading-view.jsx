import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * LoadingView 컴포넌트 - 데이터 로딩 중 표시
 *
 * Props: 없음
 *
 * Example usage:
 * <LoadingView />
 */
function LoadingView() {
  return (
    <Box sx={ { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 } }>
      <CircularProgress size={ 32 } />
    </Box>
  );
}

export default LoadingView;
