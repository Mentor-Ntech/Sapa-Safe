const axios = require('axios');

async function getExchangeRates() {
  try {
    console.log('🌍 Fetching current exchange rates...\n');
    
    // Using exchangerate-api.com (free tier)
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/NGN');
    const rates = response.data.rates;
    
    console.log('📊 Current Exchange Rates (1 NGN = ?):');
    console.log('=====================================');
    console.log(`🇳🇬 NGN (Nigeria): 1.00 NGN`);
    console.log(`🇬🇭 GHS (Ghana): ${rates.GHS?.toFixed(4) || 'N/A'} GHS`);
    console.log(`🇰🇪 KES (Kenya): ${rates.KES?.toFixed(4) || 'N/A'} KES`);
    console.log(`🇿🇦 ZAR (South Africa): ${rates.ZAR?.toFixed(4) || 'N/A'} ZAR`);
    console.log(`🇸🇳 XOF (West Africa): ${rates.XOF?.toFixed(4) || 'N/A'} XOF`);
    
    console.log('\n💰 How much equals 500 NGN:');
    console.log('==========================');
    console.log(`🇳🇬 500 NGN = 500.00 NGN`);
    console.log(`🇬🇭 500 NGN = ${(500 * rates.GHS)?.toFixed(2) || 'N/A'} GHS`);
    console.log(`🇰🇪 500 NGN = ${(500 * rates.KES)?.toFixed(2) || 'N/A'} KES`);
    console.log(`🇿🇦 500 NGN = ${(500 * rates.ZAR)?.toFixed(2) || 'N/A'} ZAR`);
    console.log(`🇸🇳 500 NGN = ${(500 * rates.XOF)?.toFixed(2) || 'N/A'} XOF`);
    
    console.log('\n🎯 Recommended Minimum Tokens (500 NGN equivalent):');
    console.log('==================================================');
    console.log(`🇳🇬 cNGN: 500 tokens (500 NGN)`);
    console.log(`🇬🇭 cGHS: ${Math.ceil(500 * rates.GHS) || 'N/A'} tokens (${(500 * rates.GHS)?.toFixed(2) || 'N/A'} GHS)`);
    console.log(`🇰🇪 cKES: ${Math.ceil(500 * rates.KES) || 'N/A'} tokens (${(500 * rates.KES)?.toFixed(2) || 'N/A'} KES)`);
    console.log(`🇿🇦 cZAR: ${Math.ceil(500 * rates.ZAR) || 'N/A'} tokens (${(500 * rates.ZAR)?.toFixed(2) || 'N/A'} ZAR)`);
    console.log(`🇸🇳 cXOF: ${Math.ceil(500 * rates.XOF) || 'N/A'} tokens (${(500 * rates.XOF)?.toFixed(2) || 'N/A'} XOF)`);
    
    console.log('\n📅 Last Updated:', new Date().toLocaleString());
    console.log('🔗 Source: exchangerate-api.com');
    
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error.message);
    console.log('\n📋 Fallback - Approximate Rates (may not be current):');
    console.log('==================================================');
    console.log('🇳🇬 NGN (Nigeria): 1.00 NGN');
    console.log('🇬🇭 GHS (Ghana): ~0.15 GHS');
    console.log('🇰🇪 KES (Kenya): ~0.25 KES');
    console.log('🇿🇦 ZAR (South Africa): ~0.02 ZAR');
    console.log('🇸🇳 XOF (West Africa): ~0.15 XOF');
  }
}

// Run the function
getExchangeRates();
