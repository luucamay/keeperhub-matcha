import axios, { AxiosInstance, AxiosError } from 'axios';
import { QuoteRequest, QuoteResponse, SwapRequest, SwapResponse, MatchaError, MatchaWrapperConfig } from './types';

export class OxAPIClient {
  private client: AxiosInstance;
  private apiUrl: string;
  private chainId: number;
  private mock: boolean = false;

  constructor(config: MatchaWrapperConfig) {
    this.chainId = config.chainId;
    this.apiUrl = config.apiUrl || 'https://api.0x.org';
    this.mock = !!config.mock;

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError): never {
    const matchaError: MatchaError = new Error(
      error.message || 'Unknown error occurred'
    ) as MatchaError;

    matchaError.code = error.code;
    matchaError.statusCode = error.response?.status;
    matchaError.details = error.response?.data as Record<string, any> | undefined;

    throw matchaError;
  }

  /**
   * Fetch a price quote from 0x API
   */
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    if (this.mock) {
      // Return a deterministic mock quote
      const mock: QuoteResponse = {
        chainId: this.chainId,
        price: '1.0',
        guaranteedPrice: '1.0',
        estimatedPriceImpact: '0',
        value: '0',
        sellTokenAddress: params.sellToken,
        buyTokenAddress: params.buyToken || 'ETH',
        sellAmount: params.sellAmount || '0',
        buyAmount: '1000000000000000000',
        sources: [{ name: 'mock', proportion: '1' }],
        orders: [],
        allowanceTarget: '0x0000000000000000000000000000000000000000',
        sellTokenToEthRate: '1',
        buyTokenToEthRate: '1',
        expectedSlippage: null,
      };
      return Promise.resolve(mock);
    }

    try {
      const response = await this.client.get<QuoteResponse>('/swap/v1/quote', {
        params: {
          chainId: this.chainId,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get swap transaction data from 0x API
   */
  async getSwap(params: SwapRequest): Promise<SwapResponse> {
    if (this.mock) {
      const mockBase: any = await this.getQuote(params as QuoteRequest);
      const mockSwap: SwapResponse = {
        ...mockBase,
        transaction: {
          to: '0x0000000000000000000000000000000000000000',
          from: params.takerAddress || '0x0000000000000000000000000000000000000000',
          data: '0x',
          value: '0',
          gas: '21000',
          gasPrice: '0',
        },
      };
      return Promise.resolve(mockSwap);
    }

    try {
      const response = await this.client.get<SwapResponse>('/swap/v1/swap', {
        params: {
          chainId: this.chainId,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get token price in ETH or other base token
   */
  async getPrice(tokenAddress: string): Promise<string> {
    if (this.mock) {
      return Promise.resolve('1.0');
    }

    try {
      const response = await this.client.get<{ price: string }>('/swap/v1/price', {
        params: {
          chainId: this.chainId,
          buyToken: tokenAddress,
          sellToken: 'ETH',
          sellAmount: '1000000000000000000', // 1 ETH
        },
      });
      return response.data.price;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Set the chain ID (useful for multi-chain support)
   */
  setChainId(chainId: number): void {
    this.chainId = chainId;
  }

  /**
   * Get current chain ID
   */
  getChainId(): number {
    return this.chainId;
  }
}
