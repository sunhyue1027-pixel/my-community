import Box from '@mui/material/Box';

import { getMood } from '../../utils/constants';
import { formatDate } from '../../utils/date-utils';

/**
 * DiaryBox 컴포넌트 - 게시물 상세의 '오늘의 다이어리' 영역 (날짜, 기분)
 *
 * Props:
 * @param {string} scheduleDate - 일정 날짜 'YYYY-MM-DD' [Optional]
 * @param {string} mood - 기분 값 [Optional]
 *
 * Example usage:
 * <DiaryBox scheduleDate="2026-11-24" mood="good" />
 */
function DiaryBox({ scheduleDate, mood }) {
  const moodInfo = getMood(mood);
  if (!scheduleDate && !moodInfo) return null;

  const items = [
    scheduleDate && { label: '날짜', value: formatDate(scheduleDate) },
    moodInfo && { label: '기분', value: `${moodInfo.icon} ${moodInfo.label}` },
  ].filter(Boolean);

  return (
    <Box
      sx={ {
        mt: 2.5,
        borderRadius: 2.5,
        border: 1,
        borderColor: 'primary.light',
        background: 'linear-gradient(135deg, #EEF2F8, #F7F9FC)',
        overflow: 'hidden',
      } }
    >
      <Box sx={ { fontSize: 13, fontWeight: 700, color: 'primary.dark', px: 2, py: 1.25, borderBottom: 1, borderColor: 'primary.light' } }>
        📔 오늘의 다이어리
      </Box>
      <Box sx={ { display: 'flex', gap: 4, px: 2, py: 1.75 } }>
        { items.map((item) => (
          <Box key={ item.label } sx={ { display: 'flex', flexDirection: 'column', gap: 0.25 } }>
            <Box sx={ { fontSize: 12, color: 'text.secondary' } }>{ item.label }</Box>
            <Box sx={ { fontWeight: 700 } }>{ item.value }</Box>
          </Box>
        )) }
      </Box>
    </Box>
  );
}

export default DiaryBox;
