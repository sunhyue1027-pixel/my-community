import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';

/**
 * BrandLogo 컴포넌트 - MO:ON 로고 (달 모양 마크 + 워드마크)
 *
 * Props:
 * @param {number} size - 글자 크기(px) [Optional, 기본값: 20]
 *
 * Example usage:
 * <BrandLogo size={ 28 } />
 */
function BrandLogo({ size = 20 }) {
  const mark = Math.round(size * 1.1);

  return (
    <Box
      component={ RouterLink }
      to="/"
      sx={ {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.02em',
        color: 'secondary.main',
      } }
    >
      <Box
        aria-hidden="true"
        sx={ {
          width: mark,
          height: mark,
          borderRadius: '30%',
          bgcolor: 'primary.main',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '50%',
            height: '50%',
            top: '25%',
            left: '25%',
            borderRadius: '50%',
            bgcolor: '#fff',
            boxShadow: `${mark * 0.12}px -${mark * 0.08}px 0 0 #2F6BFF inset`,
          },
        } }
      />
      <Box component="span">
        MO<Box component="span" sx={ { color: 'primary.main' } }>:</Box>ON
      </Box>
    </Box>
  );
}

export default BrandLogo;
