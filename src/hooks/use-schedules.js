import { useCallback, useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

/** 같은 날짜 안에서는 시간 순(시간 없는 일정은 뒤로) 정렬 */
function sortSchedules(list) {
  return [...list].sort((a, b) =>
    a.schedule_date.localeCompare(b.schedule_date)
    || (a.start_time ?? '99').localeCompare(b.start_time ?? '99')
    || a.id - b.id);
}

/**
 * 로그인한 사용자의 개인 일정(schedules 테이블)을 관리하는 커스텀 훅
 * @param {number} userId - users 테이블의 사용자 번호 (없으면 빈 목록)
 * @returns {{ schedules, addSchedule, toggleSchedule, removeSchedule }}
 */
export function useSchedules(userId) {
  // 어떤 사용자의 목록인지 함께 저장해서, 로그아웃/계정 전환 시 이전 목록이 보이지 않게 함
  const [state, setState] = useState({ ownerId: null, list: [] });
  const schedules = state.ownerId === userId ? state.list : [];

  /** 목록 갱신 헬퍼 */
  const setSchedules = useCallback((updater) => {
    setState((prev) => ({ ...prev, list: updater(prev.list) }));
  }, []);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('schedules')
      .select('id, title, category, schedule_date, start_time, is_done')
      .eq('user_id', userId)
      .then(({ data }) => setState({ ownerId: userId, list: sortSchedules(data ?? []) }));
  }, [userId]);

  /** 일정 추가 - 성공 시 null, 실패 시 에러 메시지 반환 */
  const addSchedule = useCallback(async ({ title, category, scheduleDate, startTime }) => {
    const { data, error } = await supabase
      .from('schedules')
      .insert({ user_id: userId, title, category, schedule_date: scheduleDate, start_time: startTime || null })
      .select('id, title, category, schedule_date, start_time, is_done')
      .single();
    if (error) return '일정을 저장하지 못했어요.';
    setSchedules((prev) => sortSchedules([...prev, data]));
    return null;
  }, [userId, setSchedules]);

  /** 완료 체크 토글 */
  const toggleSchedule = useCallback(async (schedule) => {
    const isDone = !schedule.is_done;
    setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? { ...s, is_done: isDone } : s)));
    const { error } = await supabase.from('schedules').update({ is_done: isDone }).eq('id', schedule.id);
    if (error) {
      setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? { ...s, is_done: !isDone } : s)));
    }
  }, [setSchedules]);

  /** 일정 삭제 */
  const removeSchedule = useCallback(async (scheduleId) => {
    const { error } = await supabase.from('schedules').delete().eq('id', scheduleId);
    if (!error) setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  }, [setSchedules]);

  return { schedules, addSchedule, toggleSchedule, removeSchedule };
}
