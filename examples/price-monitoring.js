"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_1 = require("../src/wrapper");
/**
 * Example: Monitor token prices and create alerts
 */
async function examplePriceMonitoring() {
    const matcha = new wrapper_1.MatchaWrapper({
        chainId: 1,
    });
    // Get current price
    console.log('Getting USDC/ETH price...\n');
    try {
        const price = await matcha.getPrice('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // ETH
        );
        console.log('Current USDC/ETH Price:', price);
    }
    catch (error) {
        console.error('Error getting price:', error);
    }
}
/**
 * Example: Create and monitor price alerts
 */
async function examplePriceAlerts() {
    const matcha = new wrapper_1.MatchaWrapper({
        chainId: 1,
    });
    console.log('\nCreating price alerts...\n');
    // Create an alert for USDC price below 0.0003 ETH
    const alert1 = matcha.createAlert('usdc-low', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    'below', '0.0003');
    console.log('Created alert 1:', alert1.id);
    console.log('- Condition: Price below 0.0003');
    // Create an alert for DAI price above 0.0005 ETH
    const alert2 = matcha.createAlert('dai-high', '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    'above', '0.0005');
    console.log('Created alert 2:', alert2.id);
    console.log('- Condition: Price above 0.0005');
    // Check all alerts
    console.log('\nCurrent alerts:', matcha.getAlerts().length);
    // Check for triggered alerts
    console.log('\nChecking for triggered alerts...\n');
    try {
        const triggered = await matcha.checkAlerts();
        if (triggered.length > 0) {
            console.log('Triggered alerts:');
            triggered.forEach((alert) => {
                console.log(`- ${alert.id}: ${alert.condition} ${alert.price} (current: ${alert.currentPrice})`);
            });
        }
        else {
            console.log('No alerts triggered');
        }
    }
    catch (error) {
        console.error('Error checking alerts:', error);
    }
    // Disable an alert
    console.log('\nDisabling alert:', alert1.id);
    matcha.setAlertEnabled('usdc-low', false);
    // Delete an alert
    console.log('Deleting alert:', alert2.id);
    matcha.deleteAlert('dai-high');
    console.log('Remaining alerts:', matcha.getAlerts().length);
}
// Run examples
console.log('=== Price Monitoring Examples ===\n');
examplePriceMonitoring().then(() => examplePriceAlerts());
//# sourceMappingURL=price-monitoring.js.map