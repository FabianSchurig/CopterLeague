export function isLoggedin() {
  return !!localStorage.getItem('token');
}