import Box from '@mui/material/Box';

/**
 * Footer 컴포넌트 - 하단 정보 영역
 *
 * Props: 없음
 *
 * Example usage:
 * <Footer />
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={ {
        textAlign: 'center',
        fontSize: 13,
        color: 'text.secondary',
        py: 3,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      } }
    >
      MO:ON · 일상을 정돈하는 라이프스타일 커뮤니티
    </Box>
  );
}

export default Footer;
