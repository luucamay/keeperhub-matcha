/**
 * 0x API Types and Interfaces
 */

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface QuoteRequest {
  sellToken: string;
  buyToken: string;
  sellAmount?: string;
  buyAmount?: string;
  slippagePercentage?: number;
  takerAddress?: string;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
}

export interface QuoteResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  value: string;
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  buyAmount: string;
  sources: Array<{
    name: string;
    proportion: string;
  }>;
  orders: Array<{
    type: string;
    source: string;
    makerToken: string;
    takerToken: string;
    makerAmount: string;
    takerAmount: string;
  }>;
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string | null;
}

export interface SwapRequest {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount?: string;
  slippagePercentage: number;
  takerAddress: string;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
}

export interface SwapResponse extends QuoteResponse {
  transaction: {
    to: string;
    from: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

export interface PriceAlert {
  id: string;
  sellToken: string;
  buyToken: string;
  condition: 'above' | 'below';
  price: string;
  lastPrice?: string;
  enabled: boolean;
  createdAt: number;
}

export interface AlertTrigger extends PriceAlert {
  triggeredAt: number;
  currentPrice: string;
}

export interface MatchaWrapperConfig {
  chainId: number;
  apiUrl?: string;
  timeout?: number;
  affiliateAddress?: string;
  feePercentage?: number;
  mock?: boolean;
}

export interface MatchaError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}
