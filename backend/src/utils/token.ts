import { nanoid } from 'nanoid';

// Generate a unique refresh token
export function generateRefreshToken(): string {
  return nanoid(64);
}

// Generate a short share code
export function generateShareCode(): string {
  return nanoid(8);
}

// Generate a verification/reset token
export function generateVerificationToken(): string {
  return nanoid(32);
}

// Generate version number based on current version
export function generateVersionNumber(
  existingVersions: { id: string; versionNumber: string }[],
  currentVersionId: string,
  type: 'major' | 'minor' = 'minor'
): string {
  if (existingVersions.length === 0) {
    return '1.0';
  }

  // Find current version
  const currentVersion = existingVersions.find((v) => v.id === currentVersionId);
  if (!currentVersion) {
    // Fallback: use the first version
    const fallback = existingVersions[0];
    const [major, minor = '0'] = fallback.versionNumber.split('.');
    return type === 'major'
      ? `${Number(major) + 1}.0`
      : `${major}.${Number(minor) + 1}`;
  }

  // Parse current version number
  const [currentMajorStr, currentMinorStr = '0'] = currentVersion.versionNumber.split('.');
  const currentMajor = Number(currentMajorStr);
  const currentMinor = Number(currentMinorStr);

  if (Number.isNaN(currentMajor) || Number.isNaN(currentMinor)) {
    return '1.0';
  }

  // Parse all existing version numbers for conflict checking
  const existingVersionNumbers = new Set(existingVersions.map((v) => v.versionNumber));

  // Generate new version based on type
  let newMajor: number;
  let newMinor: number;

  if (type === 'major') {
    // Major bump: increment major, reset minor to 0
    newMajor = currentMajor + 1;
    newMinor = 0;
  } else {
    // Minor bump: keep major, increment minor
    newMajor = currentMajor;
    newMinor = currentMinor + 1;
  }

  // Check for conflicts and increment if necessary
  let newVersionNumber = `${newMajor}.${newMinor}`;
  while (existingVersionNumbers.has(newVersionNumber)) {
    if (type === 'major') {
      newMajor++;
      newVersionNumber = `${newMajor}.0`;
    } else {
      newMinor++;
      newVersionNumber = `${newMajor}.${newMinor}`;
    }
  }

  return newVersionNumber;
}

// Parse duration string to milliseconds
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}
