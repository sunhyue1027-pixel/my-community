import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

/**
 * SidePanel 컴포넌트 - 사이드바용 제목 있는 카드
 *
 * Props:
 * @param {string} title - 패널 제목 [Required]
 * @param {node} action - 제목 오른쪽에 놓을 버튼 등 [Optional]
 * @param {node} children - 패널 내용 [Required]
 *
 * Example usage:
 * <SidePanel title="캘린더" action={ <IconButton /> }><MiniCalendar /></SidePanel>
 */
function SidePanel({ title, action, children }) {
  return (
    <Paper variant="outlined" sx={ { p: 2.25, borderRadius: 3.5 } }>
      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, minHeight: 20 } }>
        <Box sx={ { fontSize: 13, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.04em' } }>
          { title }
        </Box>
        { action }
      </Box>
      { children }
    </Paper>
  );
}

export default SidePanel;
