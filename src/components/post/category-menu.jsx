import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import { CATEGORIES } from '../../utils/constants';

/**
 * CategoryMenu 컴포넌트 - 사이드바 카테고리 목록 (게시물 수 표시)
 *
 * Props:
 * @param {string} selected - 선택된 카테고리 ('all' 또는 카테고리 값) [Required]
 * @param {object} counts - { all: n, schedule: n, ... } 카테고리별 개수 [Required]
 * @param {function} onSelect - 카테고리 클릭 시 실행 [Required]
 *
 * Example usage:
 * <CategoryMenu selected={ category } counts={ counts } onSelect={ setCategory } />
 */
function CategoryMenu({ selected, counts, onSelect }) {
  const items = [{ value: 'all', label: '전체 게시물', icon: '📋' }, ...CATEGORIES];

  return (
    <List disablePadding sx={ { display: 'flex', flexDirection: 'column', gap: 0.25 } }>
      { items.map((item) => {
        const isActive = selected === item.value;
        return (
          <ListItemButton
            key={ item.value }
            selected={ isActive }
            onClick={ () => onSelect(item.value) }
            sx={ {
              borderRadius: 2,
              py: 0.75,
              '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'primary.main', color: '#fff' },
            } }
          >
            <ListItemText
              primary={ `${item.icon} ${item.label}` }
              slotProps={ { primary: { sx: { fontSize: 14, fontWeight: isActive ? 700 : 400 } } } }
            />
            <Box component="span" sx={ { fontSize: 12, opacity: 0.7 } }>{ counts[item.value] ?? 0 }</Box>
          </ListItemButton>
        );
      }) }
    </List>
  );
}

export default CategoryMenu;
