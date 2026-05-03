import axios, { AxiosInstance, AxiosError } from 'axios';
import { QuoteRequest, QuoteResponse, SwapRequest, SwapResponse, MatchaError, MatchaWrapperConfig } from './types';

export class OxAPIClient {
  private client: AxiosInstance;
  private apiUrl: string;
  private chainId: number;

  constructor(config: MatchaWrapperConfig) {
    this.chainId = config.chainId;
    this.apiUrl = config.apiUrl || 'https://api.0x.org';

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
