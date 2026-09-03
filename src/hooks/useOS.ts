export type OS = 'mac' | 'windows' | 'linux' | 'unknown'

export function useOS(): OS {
  const platform = navigator.platform?.toLowerCase() ?? ''
  if (platform.includes('mac') || platform.includes('darwin')) return 'mac'
  if (platform.includes('win')) return 'windows'
  if (platform.includes('linux')) return 'linux'
  return 'unknown'
}
