/**
 * Helper formatters for data display
 */

export function formatMatchScore(score) {
  if (typeof score !== 'number') return null;
  // If score is 0–1, multiply by 100
  const normalized = score <= 1 ? Math.round(score * 100) : Math.round(score);
  return `${normalized}%`;
}

export function formatIssueNumber(issueNumber, url) {
  if (typeof issueNumber === 'number' || typeof issueNumber === 'string') {
    return `#${issueNumber}`;
  }
  if (url) {
    const match = url.match(/\/issues\/(\d+)/);
    if (match) return `#${match[1]}`;
  }
  return null;
}

export function formatStarCount(stars) {
  if (typeof stars !== 'number') return null;
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toLocaleString();
}
