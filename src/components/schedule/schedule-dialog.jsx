import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

/**
 * ScheduleDialog 컴포넌트 - 새 일정을 입력하는 창
 * 열릴 때마다 key를 바꿔서 마운트하면 입력값이 초기화된다.
 *
 * Props:
 * @param {boolean} isOpen - 창 열림 여부 [Required]
 * @param {string} defaultDate - 처음 채워질 날짜 'YYYY-MM-DD' [Required]
 * @param {function} onClose - 닫기 시 실행 [Required]
 * @param {function} onSubmit - 저장 시 실행, { title, scheduleDate, startTime }을 받아 에러 메시지(또는 null)를 반환 [Required]
 *
 * Example usage:
 * <ScheduleDialog isOpen={ isOpen } defaultDate="2026-11-24" onClose={ close } onSubmit={ addSchedule } />
 */
function ScheduleDialog({ isOpen, defaultDate, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !scheduleDate) {
      setError('일정 내용과 날짜를 입력해 주세요.');
      return;
    }
    setIsSaving(true);
    const message = await onSubmit({ title: title.trim(), scheduleDate, startTime });
    setIsSaving(false);
    if (message) setError(message);
    else onClose();
  };

  return (
    <Dialog open={ isOpen } onClose={ onClose } fullWidth maxWidth="xs" slotProps={ { paper: { sx: { borderRadius: 4 } } } }>
      <Box component="form" onSubmit={ handleSubmit } noValidate>
        <DialogTitle sx={ { fontWeight: 800, pb: 1 } }>🗓️ 새 일정</DialogTitle>
        <DialogContent sx={ { display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' } }>
          { error && <Alert severity="error">{ error }</Alert> }
          <TextField
            label="무엇을 하나요?"
            value={ title }
            onChange={ (e) => setTitle(e.target.value) }
            placeholder="예) 헬스장 PT, 카드값 정리"
            autoFocus
            fullWidth
            slotProps={ { htmlInput: { maxLength: 100 } } }
          />
          <Box sx={ { display: 'flex', gap: 1.5 } }>
            <TextField
              label="날짜"
              type="date"
              value={ scheduleDate }
              onChange={ (e) => setScheduleDate(e.target.value) }
              sx={ { flex: 1.4 } }
              slotProps={ { inputLabel: { shrink: true } } }
            />
            <TextField
              label="시간 (선택)"
              type="time"
              value={ startTime }
              onChange={ (e) => setStartTime(e.target.value) }
              sx={ { flex: 1 } }
              slotProps={ { inputLabel: { shrink: true } } }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={ { px: 3, pb: 2.5 } }>
          <Button onClick={ onClose } color="inherit">취소</Button>
          <Button type="submit" variant="contained" disabled={ isSaving }>
            { isSaving ? '저장 중…' : '일정 추가' }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ScheduleDialog;
