// server/public/js/utils/anon.js
export function getAnonId() {
  let anon = localStorage.getItem('anonId');
  if (!anon) {
    anon = crypto.randomUUID();
    localStorage.setItem('anonId', anon);
  }
  return anon;
}
