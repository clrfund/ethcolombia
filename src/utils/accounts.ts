import { mainnetProvider } from '@/api/core'

// Looks up possible ENS for given 0x address
export async function ensLookup(address: string): Promise<string | null> {
  try {
    const name: string | null = await mainnetProvider.lookupAddress(address)
    return name
  } catch {
    // in case the url is bad or any error looking up address, return null to not resolve it
    return null
  }
}
