import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/**
 * PageLayout 컴포넌트 - 디자인 시스템의 전체 페이지 중앙정렬 패턴
 *
 * Props:
 * @param {node} children - 페이지 내용 [Required]
 * @param {string} maxWidth - Container 최대 너비 [Optional, 기본값: 'lg']
 * @param {boolean} isVerticalCenter - 세로 중앙 정렬 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <PageLayout maxWidth="md">...</PageLayout>
 */
function PageLayout({ children, maxWidth = 'lg', isVerticalCenter = false }) {
  return (
    <Box
      sx={ {
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: isVerticalCenter ? 'center' : 'flex-start',
        py: { xs: 2, md: 4 },
      } }
    >
      <Container maxWidth={ maxWidth } sx={ { px: { xs: 2, md: 3 } } }>
        { children }
      </Container>
    </Box>
  );
}

export default PageLayout;
