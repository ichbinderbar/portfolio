// Payments page initialization
alert('STORE_ID: ' + process.env.PAYPHONE_STORE_ID);

import initI18n from "./i18n";
import initPaymentSection from "./payphone";

initI18n();
initPaymentSection();
