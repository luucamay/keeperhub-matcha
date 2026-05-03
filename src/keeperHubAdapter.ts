import { MatchaWrapper } from './wrapper';
import { QuoteRequest, SwapRequest, MatchaWrapperConfig } from './types';

/**
 * KeeperHub Adapter for Matcha Wrapper
 * This adapter provides KeeperHub-compatible action handlers for the Matcha wrapper
 */

export class MatchaKeeperHubAdapter {
  private wrapper: MatchaWrapper;

  constructor(config: MatchaWrapperConfig) {
    this.wrapper = new MatchaWrapper(config);
  }

  /**
   * KeeperHub Action: matcha.getQuote
   */
  async handleGetQuote(params: {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    slippagePercentage?: number;
    takerAddress?: string;
  }) {
    const quoteRequest: QuoteRequest = {
      sellToken: params.sellToken,
      buyToken: params.buyToken,
      sellAmount: params.sellAmount,
      slippagePercentage: params.slippagePercentage || 1,
      takerAddress: params.takerAddress,
    };

    const quote = await this.wrapper.getQuote(quoteRequest);

    return {
      price: quote.price,
      buyAmount: quote.buyAmount,
      estimatedPriceImpact: quote.estimatedPriceImpact,
      sources: quote.sources,
      allowanceTarget: quote.allowanceTarget,
    };
  }

  /**
   * KeeperHub Action: matcha.getSwap
   */
  async handleGetSwap(params: {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    slippagePercentage?: number;
    takerAddress: string;
  }) {
    const swapRequest: SwapRequest = {
      sellToken: params.sellToken,
      buyToken: params.buyToken,
      sellAmount: params.sellAmount,
      slippagePercentage: params.slippagePercentage || 1,
      takerAddress: params.takerAddress,
    };

    const swap = await this.wrapper.getSwap(swapRequest);

    return {
      transaction: swap.transaction,
      buyAmount: swap.buyAmount,
      price: swap.price,
      allowanceTarget: swap.allowanceTarget,
    };
  }

  /**
   * KeeperHub Action: matcha.getPrice
   */
  async handleGetPrice(params: { token: string; baseToken?: string }) {
    const price = await this.wrapper.getPrice(
      params.token,
      params.baseToken || 'ETH',
      '1000000000000000000'
    );

    return {
      price,
      timestamp: Date.now(),
    };
  }

  /**
   * KeeperHub Action: matcha.createPriceAlert
   */
  handleCreatePriceAlert(params: {
    alertId: string;
    sellToken: string;
    buyToken?: string;
    condition: 'above' | 'below';
    targetPrice: string;
  }) {
    const alert = this.wrapper.createAlert(
      params.alertId,
      params.sellToken,
      params.buyToken || 'ETH',
      params.condition,
      params.targetPrice
    );

    return {
      alertId: alert.id,
      status: 'active',
      createdAt: alert.createdAt,
    };
  }

  /**
   * KeeperHub Action: matcha.checkAlerts
   */
  async handleCheckAlerts() {
    const triggered = await this.wrapper.checkAlerts();

    return {
      triggeredCount: triggered.length,
      alerts: triggered.map((alert) => ({
        alertId: alert.id,
        sellToken: alert.sellToken,
        buyToken: alert.buyToken,
        currentPrice: alert.currentPrice,
        targetPrice: alert.price,
        condition: alert.condition,
        triggeredAt: alert.triggeredAt,
      })),
    };
  }

  /**
   * Generic action handler router
   */
  async handleAction(
    actionId: string,
    params: Record<string, any>
  ): Promise<any> {
    switch (actionId) {
      case 'matcha.getQuote':
        return this.handleGetQuote(params as any);
      case 'matcha.getSwap':
        return this.handleGetSwap(params as any);
      case 'matcha.getPrice':
        return this.handleGetPrice(params as any);
      case 'matcha.createPriceAlert':
        return this.handleCreatePriceAlert(params as any);
      case 'matcha.checkAlerts':
        return this.handleCheckAlerts();
      default:
        throw new Error(`Unknown action: ${actionId}`);
    }
  }
}
