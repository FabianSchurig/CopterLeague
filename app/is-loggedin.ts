export function isLoggedin() {
  return !!localStorage.getItem('token');
}
export function pilotId() {
  return localStorage.getItem('id');
}