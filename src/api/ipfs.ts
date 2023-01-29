import { ipfsGatewayUrl } from './core'

export class IPFS {
  static formatUrl(hash: string): string {
    return hash ? `${ipfsGatewayUrl}/ipfs/${hash}` : ''
  }
}
