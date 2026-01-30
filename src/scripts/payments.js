// Payments page initialization
console.log('[DEBUG] payments.js loading...');
console.log('[DEBUG] PAYPHONE_STORE_ID from env:', process.env.PAYPHONE_STORE_ID);

import initI18n from "./i18n";
import initPaymentSection from "./payphone";

console.log('[DEBUG] imports done, initializing...');

initI18n();
initPaymentSection();

console.log('[DEBUG] initialization complete');
