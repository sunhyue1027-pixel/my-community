/**
 * 숫자를 두 자리 문자열로 변환
 * @param {number} n - 숫자
 * @returns {string} 두 자리 문자열
 */
export function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Date 객체를 'YYYY-MM-DD' 키로 변환 (로컬 시간 기준)
 * @param {Date} date - 날짜
 * @returns {string} 날짜 키
 */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 'YYYY-MM-DD' 문자열을 로컬 Date 객체로 변환
 * @param {string} key - 날짜 키
 * @returns {Date} 날짜
 */
export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * 날짜를 'YYYY.MM.DD (HH:mm)' 형식으로 표시
 * @param {string} value - ISO 문자열 또는 'YYYY-MM-DD'
 * @param {boolean} hasTime - 시간 포함 여부
 * @returns {string} 표시용 문자열
 */
export function formatDate(value, hasTime = false) {
  // 날짜만 있는 값은 시간대 변환 없이 그대로 표시
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.replaceAll('-', '.');
  const d = new Date(value);
  const date = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  return hasTime ? `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}` : date;
}

/**
 * 상대 시간 표시 ('방금 전', '3분 전' 등)
 * @param {string} value - ISO 문자열
 * @returns {string} 상대 시간
 */
export function timeAgo(value) {
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return formatDate(value);
}
