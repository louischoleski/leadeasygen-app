// Client-side user-agent parsing for the security screens. The server stores
// the raw UA (parsing is a display concern, and keeps the wire payload honest);
// this turns it into a friendly label and a coarse device kind. Deliberately
// small — enough to read "Chrome on macOS" at a glance, not a UA database.

export type DeviceKind = 'phone' | 'laptop'

export interface ParsedUserAgent {
  browser: string
  os: string
  device: DeviceKind
  // "Chrome • macOS" — the human line under the device name.
  summary: string
}

function matchBrowser(ua: string): string {
  // Order matters: Edge/Opera masquerade as Chrome; Chrome masquerades as Safari.
  if (/\bEdg\//.test(ua)) return 'Edge'
  if (/\bOPR\/|\bOpera\b/.test(ua)) return 'Opera'
  if (/\bFirefox\//.test(ua)) return 'Firefox'
  if (/\bChrome\//.test(ua)) return 'Chrome'
  if (/\bSafari\//.test(ua) && /\bVersion\//.test(ua)) return 'Safari'
  if (/\bcurl\//.test(ua)) return 'curl'
  return 'Unknown browser'
}

function matchOs(ua: string): { os: string; device: DeviceKind } {
  if (/\biPhone\b/.test(ua)) return { os: 'iOS', device: 'phone' }
  if (/\biPad\b/.test(ua)) return { os: 'iPadOS', device: 'phone' }
  if (/\bAndroid\b/.test(ua)) return { os: 'Android', device: 'phone' }
  if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) return { os: 'macOS', device: 'laptop' }
  if (/\bWindows\b/.test(ua)) return { os: 'Windows', device: 'laptop' }
  if (/\bLinux\b/.test(ua)) return { os: 'Linux', device: 'laptop' }
  return { os: 'Unknown OS', device: 'laptop' }
}

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  if (!ua) {
    return { browser: 'Unknown', os: 'Unknown', device: 'laptop', summary: 'Unknown device' }
  }
  const browser = matchBrowser(ua)
  const { os, device } = matchOs(ua)
  return { browser, os, device, summary: `${browser} • ${os}` }
}
