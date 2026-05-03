import { OxAPIClient } from './oxApiClient';
import {
  QuoteRequest,
  QuoteResponse,
  SwapRequest,
  SwapResponse,
  PriceAlert,
  AlertTrigger,
  MatchaWrapperConfig,
} from './types';

export class MatchaWrapper {
  private apiClient: OxAPIClient;
  private alerts: Map<string, PriceAlert> = new Map();
  private priceCache: Map<string, { price: string; timestamp: number }> = new Map();
  private cacheDuration: number = 30000; // 30 seconds

  constructor(config: MatchaWrapperConfig) {
    this.apiClient = new OxAPIClient(config);
  }

  /**
   * Get a quote for a token swap
   */
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    return this.apiClient.getQuote(params);
  }

  /**
   * Get swap transaction data
   */
  async getSwap(params: SwapRequest): Promise<SwapResponse> {
    return this.apiClient.getSwap(params);
  }

  /**
   * Get the current price of a token
   */
  async getPrice(
    sellToken: string,
    buyToken: string = 'ETH',
    sellAmount: string = '1000000000000000000'
  ): Promise<string> {
    const cacheKey = `${sellToken}-${buyToken}-${sellAmount}`;
    const cached = this.priceCache.get(cacheKey);

    // Return cached price if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.price;
    }

    try {
      const quote = await this.apiClient.getQuote({
        sellToken,
        buyToken,
        sellAmount,
      });

      const price = quote.price;
      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      return price;
    } catch (error) {
      throw new Error(`Failed to get price: ${(error as Error).message}`);
    }
  }

  /**
   * Create a price alert
   */
  createAlert(
    alertId: string,
    sellToken: string,
    buyToken: string,
    condition: 'above' | 'below',
    targetPrice: string
  ): PriceAlert {
    const alert: PriceAlert = {
      id: alertId,
      sellToken,
      buyToken,
      condition,
      price: targetPrice,
      enabled: true,
      createdAt: Date.now(),
    };

    this.alerts.set(alertId, alert);
    return alert;
  }

  /**
   * Check all active alerts and return any that have been triggered
   */
  async checkAlerts(): Promise<AlertTrigger[]> {
    const triggeredAlerts: AlertTrigger[] = [];

    for (const [_, alert] of this.alerts) {
      if (!alert.enabled) continue;

      try {
        const currentPrice = await this.getPrice(alert.sellToken, alert.buyToken);
        const isTrigger = this.isAlertTriggered(
          currentPrice,
          alert.price,
          alert.condition
        );

        if (isTrigger) {
          triggeredAlerts.push({
            ...alert,
            triggeredAt: Date.now(),
            currentPrice,
          });

          // Update lastPrice after triggering
          alert.lastPrice = currentPrice;
        }
      } catch (error) {
        console.error(
          `Error checking alert ${alert.id}: ${(error as Error).message}`
        );
      }
    }

    return triggeredAlerts;
  }

  /**
   * Delete an alert
   */
  deleteAlert(alertId: string): boolean {
    return this.alerts.delete(alertId);
  }

  /**
   * Get all alerts
   */
  getAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Enable or disable an alert
   */
  setAlertEnabled(alertId: string, enabled: boolean): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.enabled = enabled;
    return true;
  }

  /**
   * Check if an alert should trigger
   */
  private isAlertTriggered(
    currentPrice: string,
    targetPrice: string,
    condition: 'above' | 'below'
  ): boolean {
    try {
      const current = parseFloat(currentPrice);
      const target = parseFloat(targetPrice);

      if (condition === 'above') {
        return current >= target;
      } else {
        return current <= target;
      }
    } catch {
      return false;
    }
  }

  /**
   * Clear price cache
   */
  clearCache(): void {
    this.priceCache.clear();
  }

  /**
   * Set cache duration in milliseconds
   */
  setCacheDuration(duration: number): void {
    this.cacheDuration = duration;
  }
}
