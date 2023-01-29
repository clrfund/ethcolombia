import { mainnetProvider } from '@/api/core'

// Looks up possible ENS for given 0x address
export async function ensLookup(address: string): Promise<string | null> {
  const name: string | null = await mainnetProvider.lookupAddress(address)
  return name
}
