/**
 * 카테고리 목록 (DB category 값 ↔ 화면 표시)
 */
export const CATEGORIES = [
  { value: 'schedule', label: '일정관리', icon: '🗓️', color: '#2A4F8F' },
  { value: 'spending', label: '소비기록', icon: '💳', color: '#0E9F9E' },
  { value: 'selfcare', label: '자기관리', icon: '🌱', color: '#7C5CFF' },
  { value: 'diary', label: '다이어리', icon: '📔', color: '#D9578F' },
  { value: 'workout', label: '운동', icon: '🏃', color: '#E5801F' },
  { value: 'free', label: '자유', icon: '💬', color: '#64748B' },
];

/**
 * 카테고리 값으로 카테고리 정보 찾기
 * @param {string} value - 카테고리 값
 * @returns {object} 카테고리 정보 (없으면 '자유')
 */
export function getCategory(value) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
}

/**
 * 다이어리용 오늘의 기분 목록
 */
export const MOODS = [
  { value: 'great', label: '최고', icon: '😆' },
  { value: 'good', label: '좋음', icon: '🙂' },
  { value: 'calm', label: '평온', icon: '😌' },
  { value: 'tired', label: '피곤', icon: '😪' },
  { value: 'sad', label: '우울', icon: '😢' },
];

/**
 * 기분 값으로 기분 정보 찾기
 * @param {string} value - 기분 값
 * @returns {object|undefined} 기분 정보
 */
export function getMood(value) {
  return MOODS.find((m) => m.value === value);
}

/**
 * 게시물 정렬 옵션
 */
export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'comments', label: '댓글많은순' },
  { value: 'schedule', label: '일정 가까운순' },
];
