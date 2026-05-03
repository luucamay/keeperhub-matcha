import { MatchaKeeperHubAdapter } from '../src/keeperHubAdapter';

/**
 * Example: Using the KeeperHub Adapter for workflow integration
 */
async function exampleKeeperHubAdapter() {
  const adapter = new MatchaKeeperHubAdapter({
    chainId: 1,
    mock: true,
  });

  console.log('=== KeeperHub Adapter Examples ===\n');

  // Example 1: Get Quote Action
  console.log('1. Getting quote via adapter...\n');
  try {
    const quoteResult = await adapter.handleAction('matcha.getQuote', {
      sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      sellAmount: '1000000000',
    });
    console.log('Quote Result:', quoteResult);
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Create Price Alert
  console.log('\n2. Creating price alert via adapter...\n');
  try {
    const alertResult = await adapter.handleAction('matcha.createPriceAlert', {
      alertId: 'usdc-alert-1',
      sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      buyToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      condition: 'below',
      targetPrice: '0.0003',
    });
    console.log('Alert Created:', alertResult);
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Check Alerts
  console.log('\n3. Checking alerts via adapter...\n');
  try {
    const checkResult = await adapter.handleAction('matcha.checkAlerts', {});
    console.log('Alert Check Result:', checkResult);
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Get Price
  console.log('\n4. Getting price via adapter...\n');
  try {
    const priceResult = await adapter.handleAction('matcha.getPrice', {
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    });
    console.log('Price Result:', priceResult);
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Get Swap Transaction
  console.log('\n5. Getting swap transaction via adapter...\n');
  try {
    const swapResult = await adapter.handleAction('matcha.getSwap', {
      sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      sellAmount: '1000000000',
      takerAddress: '0x1234567890123456789012345678901234567890',
    });
    console.log('Swap Result:', {
      to: swapResult.transaction.to,
      from: swapResult.transaction.from,
      buyAmount: swapResult.buyAmount,
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run example
exampleKeeperHubAdapter();
