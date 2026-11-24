import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { toDateKey } from '../../utils/date-utils';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * MiniCalendar 컴포넌트 - 일정이 있는 날짜에 점을 찍어 보여주는 월간 캘린더
 *
 * Props:
 * @param {object} marks - { 'YYYY-MM-DD': 개수 } 일정 표시 날짜 [Optional, 기본값: {}]
 * @param {string} selected - 선택된 날짜 키 [Optional]
 * @param {function} onSelect - 날짜 클릭 시 실행 (없으면 읽기 전용) [Optional]
 * @param {Date} initialDate - 처음 보여줄 달 [Optional, 기본값: 오늘]
 *
 * Example usage:
 * <MiniCalendar marks={ { '2026-11-24': 2 } } selected={ date } onSelect={ setDate } />
 */
function MiniCalendar({ marks = {}, selected, onSelect, initialDate }) {
  const [view, setView] = useState(() => {
    const start = initialDate ?? new Date();
    return new Date(start.getFullYear(), start.getMonth(), 1);
  });
  const [todayKey] = useState(() => toDateKey(new Date()));
  const isReadOnly = !onSelect;

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <Box>
      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 } }>
        <IconButton size="small" onClick={ () => setView(new Date(year, month - 1, 1)) } aria-label="이전 달">
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Box sx={ { fontWeight: 700, fontSize: 15 } }>{ year }년 { month + 1 }월</Box>
        <IconButton size="small" onClick={ () => setView(new Date(year, month + 1, 1)) } aria-label="다음 달">
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25, textAlign: 'center' } }>
        { WEEK_DAYS.map((day, i) => (
          <Box
            key={ day }
            sx={ {
              fontSize: 11,
              fontWeight: 600,
              py: 0.5,
              color: i === 0 ? '#E5737A' : i === 6 ? '#5A78AE' : 'text.secondary',
            } }
          >
            { day }
          </Box>
        )) }

        { cells.map((date, i) => {
          if (!date) return <Box key={ `empty-${i}` } />;
          const key = toDateKey(date);
          const isToday = key === todayKey;
          const isSelected = key === selected;
          const hasMark = Boolean(marks[key]);

          return (
            <Box
              component="button"
              type="button"
              key={ key }
              disabled={ isReadOnly }
              onClick={ () => onSelect?.(isSelected ? null : key) }
              sx={ {
                aspectRatio: '1',
                border: 0,
                borderRadius: 2,
                position: 'relative',
                font: 'inherit',
                fontSize: 13,
                cursor: isReadOnly ? 'default' : 'pointer',
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? '#fff' : isToday ? 'primary.main' : 'text.primary',
                fontWeight: isToday ? 800 : 400,
                boxShadow: isToday && !isSelected ? 'inset 0 0 0 1.5px #C5D0E3' : 'none',
                '&:hover': { bgcolor: isReadOnly || isSelected ? undefined : 'primary.light' },
                '&::after': hasMark ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor: isSelected ? '#fff' : 'primary.main',
                } : undefined,
              } }
            >
              { date.getDate() }
            </Box>
          );
        }) }
      </Box>
    </Box>
  );
}

export default MiniCalendar;
