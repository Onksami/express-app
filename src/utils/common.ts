export function genUniqId(): string {
  return Date.now() + "-" + Math.floor(Math.random() * 1000000000);
}
