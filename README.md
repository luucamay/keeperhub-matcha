# KeeperHub Matcha Wrapper

A TypeScript wrapper for integrating 0x Protocol (Matcha) with KeeperHub workflows. This wrapper provides quote fetching, token swaps, and price monitoring capabilities.

## Features

- 🔄 **Token Swap Quotes** - Get real-time quotes for any token pair
- 💱 **Swap Execution** - Get transaction data for executing swaps
- 📊 **Price Tracking** - Monitor token prices with caching
- 🚨 **Price Alerts** - Create and monitor price alerts
- 🔗 **KeeperHub Integration** - Built-in adapter for KeeperHub workflows

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Usage

### Basic Usage

```typescript
import { MatchaWrapper } from './src/wrapper';

const matcha = new MatchaWrapper({
  chainId: 1, // Ethereum mainnet
});

// Get a quote
const quote = await matcha.getQuote({
  sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  sellAmount: '1000000000', // 1,000 USDC (6 decimals)
});

console.log('Buy amount:', quote.buyAmount);
console.log('Price impact:', quote.estimatedPriceImpact);
```

### Price Monitoring

```typescript
// Get current price
const price = await matcha.getPrice(
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'  // ETH
);

console.log('USDC/ETH price:', price);
```

### Price Alerts

```typescript
// Create an alert
const alert = matcha.createAlert(
  'alert-1',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',  // ETH
  'below',
  '0.0003'
);

// Check for triggered alerts
const triggered = await matcha.checkAlerts();
if (triggered.length > 0) {
  console.log('Alert triggered!', triggered[0]);
}
```

### KeeperHub Integration

```typescript
import { MatchaKeeperHubAdapter } from './src/keeperHubAdapter';

const adapter = new MatchaKeeperHubAdapter({
  chainId: 1,
});

// Route action through adapter
const result = await adapter.handleAction('matcha.getQuote', {
  sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  sellAmount: '1000000000',
});
```

## Supported Actions

### `matcha.getQuote`
Get a price quote for a token swap.

**Inputs:**
- `sellToken` (string): Token to sell (address or symbol)
- `buyToken` (string): Token to buy (address or symbol)
- `sellAmount` (string): Amount in wei
- `slippagePercentage` (number, optional): Max slippage (default: 1%)
- `takerAddress` (string, optional): Address executing swapLicense

**Outputs:**
- `price`: Quoted price
- `buyAmount`: Expected buy amount
- `estimatedPriceImpact`: Price impact percentage
- `sources`: Liquidity sources used

### `matcha.getSwap`
Get transaction data for executing a swap.

**Inputs:** (same as getQuote)
- `takerAddress` (string): Required for swap execution

**Outputs:**
- `transaction`: Transaction object with `to`, `from`, `data`, `value`
- `buyAmount`: Expected buy amount
- `price`: Quoted price
- `allowanceTarget`: Address to approve for token spending

### `matcha.getPrice`
Get the current price of a token.

**Inputs:**
- `token` (string): Token to get price for
- `baseToken` (string, optional): Base token (default: ETH)

**Outputs:**
- `price`: Current price
- `timestamp`: Timestamp of price

### `matcha.createPriceAlert`
Create a price alert.

**Inputs:**
- `alertId` (string): Unique alert ID
- `sellToken` (string): Token to monitor
- `buyToken` (string, optional): Base token (default: ETH)
- `condition` (string): 'above' or 'below'
- `targetPrice` (string): Target price

**Outputs:**
- `alertId`: Created alert ID
- `status`: 'active'
- `createdAt`: Creation timestamp

### `matcha.checkAlerts`
Check all active alerts and return triggered ones.

**Outputs:**
- `triggeredCount`: Number of triggered alerts
- `alerts`: Array of triggered alerts with details

## Configuration

```typescript
interface MatchaWrapperConfig {
  chainId: number;           // Required: Chain ID (1 for Ethereum)
  apiUrl?: string;          // Optional: 0x API endpoint
  timeout?: number;         // Optional: Request timeout in ms
  affiliateAddress?: string; // Optional: Affiliate address for fees
  feePercentage?: number;   // Optional: Fee percentage
}
```

## Supported Chains

- Ethereum (1)
- Polygon (137)
- Arbitrum (42161)
- Optimism (10)
- Base (8453)
- Avalanche (43114)
- Fantom (250)
- Binance Smart Chain (56)

See [0x API documentation](https://0x.org/docs/api) for the complete list of supported chains.

## Error Handling

```typescript
try {
  const quote = await matcha.getQuote({
    sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    sellAmount: '1000000000',
  });
} catch (error) {
  if (error.statusCode === 400) {
    console.error('Invalid parameters');
  } else if (error.statusCode === 429) {
    console.error('Rate limited');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Development

```bash
# Build
npm run build

# Watch for changes
npm run dev

# Run tests
npm run test

# Lint
npm run lint
```

## License

MIT

## Resources

- [0x Protocol](https://0x.org)
- [0x API Documentation](https://0x.org/docs/api)
- [KeeperHub Workflows](https://keeperhub.io)