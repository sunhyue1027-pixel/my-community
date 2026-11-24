import Chip from '@mui/material/Chip';

import { getCategory } from '../../utils/constants';

/**
 * CategoryBadge 컴포넌트 - 카테고리 색상 배지
 *
 * Props:
 * @param {string} category - 카테고리 값 (schedule, spending ...) [Required]
 *
 * Example usage:
 * <CategoryBadge category="workout" />
 */
function CategoryBadge({ category }) {
  const cat = getCategory(category);

  return (
    <Chip
      size="small"
      label={ `${cat.icon} ${cat.label}` }
      sx={ { color: cat.color, bgcolor: `${cat.color}14`, fontSize: 12 } }
    />
  );
}

export default CategoryBadge;
