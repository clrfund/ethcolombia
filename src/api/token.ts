import { TOKEN_INFO } from '@/plugins/Web3/constants/tokens'
import type { Token as TokenLogo } from '@/plugins/Web3/constants/tokens'

export type Token = {
  address: string
  symbol: string
  decimals: number
}

export const getTokenLogo = (symbol: string): string => {
  const uppercaseSymbol = (symbol || '').toUpperCase()
  const token: TokenLogo = TOKEN_INFO[uppercaseSymbol]
  if (!token) return 'eth.svg'
  return token.logo
}
