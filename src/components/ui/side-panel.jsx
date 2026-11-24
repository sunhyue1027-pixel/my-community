import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

/**
 * SidePanel 컴포넌트 - 사이드바용 제목 있는 카드
 *
 * Props:
 * @param {string} title - 패널 제목 [Required]
 * @param {node} children - 패널 내용 [Required]
 *
 * Example usage:
 * <SidePanel title="캘린더"><MiniCalendar /></SidePanel>
 */
function SidePanel({ title, children }) {
  return (
    <Paper variant="outlined" sx={ { p: 2.25, borderRadius: 3.5 } }>
      <Box sx={ { fontSize: 13, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.04em', mb: 1.5 } }>
        { title }
      </Box>
      { children }
    </Paper>
  );
}

export default SidePanel;
