const DRIVE_ID_PATTERN = /^[a-zA-Z0-9_-]{20,}$/;

const extractGoogleDriveId = (value = '') => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (DRIVE_ID_PATTERN.test(trimmed) && !trimmed.startsWith('http')) {
    return trimmed;
  }

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return '';
};

export const resolveImageUrl = (value = '') => {
  const trimmed = value?.trim?.() || '';
  if (!trimmed) return '';

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
  }

  return trimmed;
};

