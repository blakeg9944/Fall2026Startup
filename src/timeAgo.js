// "a moment ago", "42 seconds ago", "3 minutes ago". Used by the mock live feeds.
export function timeAgo(time) {
  const seconds = Math.round((Date.now() - time) / 1000);
  if (seconds < 10) return 'a moment ago';
  if (seconds < 60) return `${seconds} seconds ago`;
  return `${Math.floor(seconds / 60)} minutes ago`;
}
