import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { CATEGORIES } from '../../utils/constants';

/**
 * ScheduleCategoryFilter 컴포넌트 - 카테고리 색상 칩 묶음 (필터 / 선택 겸용)
 *
 * Props:
 * @param {string} selected - 선택된 카테고리 값 ('all' 포함) [Required]
 * @param {function} onSelect - 칩 클릭 시 실행, 카테고리 값을 받음 [Required]
 * @param {boolean} hasAll - '전체' 칩 표시 여부 [Optional, 기본값: false]
 * @param {object} counts - { 카테고리값: 개수 } 칩 옆에 표시할 개수 [Optional]
 *
 * Example usage:
 * <ScheduleCategoryFilter selected={ filter } onSelect={ setFilter } hasAll counts={ counts } />
 */
function ScheduleCategoryFilter({ selected, onSelect, hasAll = false, counts }) {
  const options = hasAll
    ? [{ value: 'all', label: '전체', icon: '', color: '#2A4F8F' }, ...CATEGORIES]
    : CATEGORIES;

  return (
    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
      { options.map((c) => {
        const isSelected = selected === c.value;
        const count = counts?.[c.value];
        return (
          <Chip
            key={ c.value }
            size="small"
            clickable
            onClick={ () => onSelect(c.value) }
            label={ `${c.icon ? `${c.icon} ` : ''}${c.label}${count ? ` ${count}` : ''}` }
            sx={ {
              fontSize: 11.5,
              height: 24,
              color: isSelected ? '#fff' : c.color,
              bgcolor: isSelected ? c.color : `${c.color}14`,
              '&:hover': { bgcolor: isSelected ? c.color : `${c.color}26` },
            } }
          />
        );
      }) }
    </Box>
  );
}

export default ScheduleCategoryFilter;
