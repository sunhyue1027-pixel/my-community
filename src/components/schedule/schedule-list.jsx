import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ScheduleList 컴포넌트 - 하루치 개인 일정 목록 (완료 체크, 삭제)
 *
 * Props:
 * @param {array} schedules - 일정 배열 { id, title, start_time, is_done } [Required]
 * @param {function} onToggle - 체크 시 실행, 일정 객체를 받음 [Required]
 * @param {function} onRemove - 삭제 시 실행, 일정 id를 받음 [Required]
 *
 * Example usage:
 * <ScheduleList schedules={ todaySchedules } onToggle={ toggleSchedule } onRemove={ removeSchedule } />
 */
function ScheduleList({ schedules, onToggle, onRemove }) {
  if (schedules.length === 0) {
    return (
      <Box sx={ { fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 1 } }>
        일정이 없어요. + 를 눌러 추가해 보세요
      </Box>
    );
  }

  return (
    <Box component="ul" sx={ { listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 } }>
      { schedules.map((schedule) => (
        <Box
          component="li"
          key={ schedule.id }
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            pr: 0.25,
            borderRadius: 2,
            bgcolor: 'background.default',
            '&:hover .schedule-list__remove': { opacity: 1 },
          } }
        >
          <Checkbox
            size="small"
            checked={ schedule.is_done }
            onChange={ () => onToggle(schedule) }
            slotProps={ { input: { 'aria-label': `${schedule.title} 완료` } } }
          />
          { schedule.start_time && (
            <Box sx={ { fontSize: 12, fontWeight: 700, color: 'primary.main', flexShrink: 0 } }>
              { schedule.start_time.slice(0, 5) }
            </Box>
          ) }
          <Box
            sx={ {
              flex: 1,
              minWidth: 0,
              fontSize: 13.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: schedule.is_done ? 'text.disabled' : 'text.primary',
              textDecoration: schedule.is_done ? 'line-through' : 'none',
            } }
          >
            { schedule.title }
          </Box>
          <IconButton
            className="schedule-list__remove"
            size="small"
            onClick={ () => onRemove(schedule.id) }
            aria-label={ `${schedule.title} 삭제` }
            sx={ { opacity: { xs: 1, md: 0 }, transition: 'opacity 0.15s' } }
          >
            <CloseIcon sx={ { fontSize: 16 } } />
          </IconButton>
        </Box>
      )) }
    </Box>
  );
}

export default ScheduleList;
