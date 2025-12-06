import { formatDistanceToNow, parseISO } from 'date-fns';

// Token estimation (rough approximation)
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Rough estimation: ~4 characters per token for English
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 0.75);
}

// Character count
export function countChars(text: string): number {
  return text?.length || 0;
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: false })
      .replace('about ', '')
      .replace('less than a minute', 'just now')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' weeks', 'w')
      .replace(' week', 'w')
      .replace(' months', 'mo')
      .replace(' month', 'mo');
  } catch {
    return 'unknown';
  }
}

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Generate version number
export function generateVersionNumber(versions: { versionNumber: string }[]): string {
  if (versions.length === 0) return '1.0';
  
  const lastVersion = versions[0].versionNumber;
  const [major, minor] = lastVersion.split('.').map(Number);
  
  // Increment minor version
  return `${major}.${minor + 1}`;
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Extract variables from prompt template ({{variable}})
export function extractVariables(text: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = text.matchAll(regex);
  return [...new Set([...matches].map(m => m[1]))];
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Class name utility
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Local storage helpers
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Search filter helper
export function matchesSearch(prompt: { title: string; description: string; tags: string[] }, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    prompt.title.toLowerCase().includes(lowerQuery) ||
    prompt.description.toLowerCase().includes(lowerQuery) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Share code generation and parsing
const SHARE_PREFIX = 'PS-';

export function encodeShareData(data: object): string {
  try {
    const jsonString = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    return SHARE_PREFIX + base64;
  } catch {
    return '';
  }
}

export function decodeShareData<T>(shareCode: string): T | null {
  try {
    if (!shareCode.startsWith(SHARE_PREFIX)) return null;
    const base64 = shareCode.slice(SHARE_PREFIX.length);
    const jsonString = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

export function isShareCode(text: string): boolean {
  return text.trim().startsWith(SHARE_PREFIX);
}

export function getShareUrl(shareCode: string): string {
  return `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(shareCode)}`;
}

export function getShareCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('share');
}
