import { providers, getDefaultProvider } from 'ethers'

export const ipfsGatewayUrl =
  import.meta.env.VITE_IPFS_GATEWAY_URL || 'https://ipfs.io'

export const mainnetProvider = import.meta.env.VITE_ETHEREUM_MAINNET_API_URL
  ? new providers.StaticJsonRpcProvider(
      import.meta.env.VITE_ETHEREUM_MAINNET_API_URL
    )
  : getDefaultProvider()
