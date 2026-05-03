"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = require("../src/wrapper");
/**
 * Example: Get a price quote for a token swap
 */
async function exampleGetQuote() {
    const matcha = new wrapper_1.MatchaWrapper({
        chainId: 1, // Ethereum mainnet
    });
    try {
        const quote = await matcha.getQuote({
            sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
            buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            sellAmount: '1000000000', // 1,000 USDC
            slippagePercentage: 1,
        });
        console.log('Quote Result:');
        console.log('- Buy Amount:', quote.buyAmount);
        console.log('- Price:', quote.price);
        console.log('- Price Impact:', quote.estimatedPriceImpact);
        console.log('- Sources:', quote.sources);
    }
    catch (error) {
        console.error('Error getting quote:', error);
    }
}
/**
 * Example: Get swap transaction data
 */
async function exampleGetSwap() {
    const matcha = new wrapper_1.MatchaWrapper({
        chainId: 1,
    });
    try {
        const swap = await matcha.getSwap({
            sellToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
            buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            sellAmount: '1000000000',
            slippagePercentage: 1,
            takerAddress: '0x1234567890123456789012345678901234567890',
        });
        console.log('Swap Transaction:');
        console.log('- To:', swap.transaction.to);
        console.log('- From:', swap.transaction.from);
        console.log('- Data:', swap.transaction.data.slice(0, 50) + '...');
        console.log('- Value:', swap.transaction.value);
        console.log('- Gas:', swap.transaction.gas);
    }
    catch (error) {
        console.error('Error getting swap:', error);
    }
}
// Run examples
console.log('=== KeeperHub Matcha Wrapper Examples ===\n');
console.log('1. Getting a quote...\n');
exampleGetQuote().then(() => {
    console.log('\n2. Getting swap transaction data...\n');
    return exampleGetSwap();
});
//# sourceMappingURL=basic-usage.js.map