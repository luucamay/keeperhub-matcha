import express, { Request, Response } from 'express';
import { MatchaKeeperHubAdapter } from './index';

const app = express();
const port = process.env.PORT || 3000;
const chainId = parseInt(process.env.CHAIN_ID || '1', 10);

// Middleware
app.use(express.json());

// Initialize adapter
const adapter = new MatchaKeeperHubAdapter({
  chainId,
  mock: process.env.MOCK === 'true',
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Adapter action handler
 * POST /api/adapter/handleAction
 * 
 * Body:
 * {
 *   "action": "matcha.getPrice",
 *   "params": {
 *     "token": "0x...",
 *     "baseToken": "0x..."
 *   }
 * }
 */
app.post('/api/adapter/handleAction', async (req: Request, res: Response) => {
  try {
    const { action, params } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Missing action field' });
    }

    if (!params) {
      return res.status(400).json({ error: 'Missing params field' });
    }

    const result = await adapter.handleAction(action, params);

    res.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('Adapter error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Convenience endpoint for matcha.getPrice
 * POST /api/adapter/matcha/getPrice
 * 
 * Body:
 * {
 *   "token": "0x...",
 *   "baseToken": "0x..."
 * }
 */
app.post('/api/adapter/matcha/getPrice', async (req: Request, res: Response) => {
  try {
    const result = await adapter.handleAction('matcha.getPrice', req.body);
    res.json({
      success: true,
      action: 'matcha.getPrice',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('getPrice error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Convenience endpoint for matcha.getQuote
 * POST /api/adapter/matcha/getQuote
 */
app.post('/api/adapter/matcha/getQuote', async (req: Request, res: Response) => {
  try {
    const result = await adapter.handleAction('matcha.getQuote', req.body);
    res.json({
      success: true,
      action: 'matcha.getQuote',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('getQuote error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Convenience endpoint for matcha.getSwap
 * POST /api/adapter/matcha/getSwap
 */
app.post('/api/adapter/matcha/getSwap', async (req: Request, res: Response) => {
  try {
    const result = await adapter.handleAction('matcha.getSwap', req.body);
    res.json({
      success: true,
      action: 'matcha.getSwap',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('getSwap error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Convenience endpoint for matcha.createPriceAlert
 * POST /api/adapter/matcha/createPriceAlert
 */
app.post('/api/adapter/matcha/createPriceAlert', async (req: Request, res: Response) => {
  try {
    const result = await adapter.handleAction('matcha.createPriceAlert', req.body);
    res.json({
      success: true,
      action: 'matcha.createPriceAlert',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('createPriceAlert error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Convenience endpoint for matcha.checkAlerts
 * POST /api/adapter/matcha/checkAlerts
 */
app.post('/api/adapter/matcha/checkAlerts', async (req: Request, res: Response) => {
  try {
    const result = await adapter.handleAction('matcha.checkAlerts', req.body);
    res.json({
      success: true,
      action: 'matcha.checkAlerts',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('checkAlerts error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Matcha Adapter Server running on http://localhost:${port}`);
  console.log(`   CHAIN_ID: ${chainId}`);
  console.log(`   MOCK: ${process.env.MOCK === 'true'}`);
  console.log('');
  console.log('📍 Endpoints:');
  console.log(`   GET  /health`);
  console.log(`   POST /api/adapter/handleAction`);
  console.log(`   POST /api/adapter/matcha/getPrice`);
  console.log(`   POST /api/adapter/matcha/getQuote`);
  console.log(`   POST /api/adapter/matcha/getSwap`);
  console.log(`   POST /api/adapter/matcha/createPriceAlert`);
  console.log(`   POST /api/adapter/matcha/checkAlerts`);
});
