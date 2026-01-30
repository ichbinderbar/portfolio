// Payphone Payment Widget Integration
// Documentation: https://www.docs.payphone.app/cajita-de-pagos-payphone

const PAYPHONE_CONFIG = {
  token: (process.env.PAYPHONE_TOKEN || '').trim(),
  storeId: (process.env.PAYPHONE_STORE_ID || '').trim(),
  responseUrl: (process.env.PAYPHONE_RESPONSE_URL || 'https://juanidrovo.com/payment-confirm.html').trim(),
};

const PAYPHONE_CDN = {
  css: 'https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css',
  js: 'https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js',
};

let scriptsLoaded = false;
let isProcessing = false;

// Load Payphone SDK resources
function loadPayphoneSDK() {
  return new Promise((resolve, reject) => {
    if (scriptsLoaded) {
      resolve();
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = PAYPHONE_CDN.css;
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.type = 'module';
    script.src = PAYPHONE_CDN.js;
    script.onload = () => {
      scriptsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Payphone SDK'));
    document.head.appendChild(script);
  });
}

// Generate unique transaction ID
function generateTransactionId() {
  return `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Wait for SDK class to be available (with timeout)
function waitForSDK(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (typeof window.PPaymentButtonBox !== 'undefined') {
      resolve();
      return;
    }

    const startTime = Date.now();
    const check = () => {
      if (typeof window.PPaymentButtonBox !== 'undefined') {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Payphone SDK timeout'));
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  });
}

// Sanitize text input to prevent XSS
function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[<>&"']/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
    return entities[char];
  }).slice(0, 100);
}

// Initialize the payment widget with the specified amount
async function initPaymentWidget(amount, reference) {
  const container = document.getElementById('pp-button');
  const errorEl = document.getElementById('payment-error');
  const successEl = document.getElementById('payment-initiated');

  if (!container) return;

  // Clear previous state
  container.innerHTML = '';
  if (errorEl) errorEl.style.display = 'none';
  if (successEl) successEl.style.display = 'none';

  try {
    await loadPayphoneSDK();
    await waitForSDK();

    const amountInCents = Math.round(amount * 100);
    const clientTransactionId = generateTransactionId();

    // Store token for confirmation page
    sessionStorage.setItem('payphone_token', PAYPHONE_CONFIG.token);
    sessionStorage.setItem('payphone_amount', amount.toString());

    const widgetConfig = {
      token: PAYPHONE_CONFIG.token,
      clientTransactionId: clientTransactionId,
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      currency: 'USD',
      storeId: PAYPHONE_CONFIG.storeId,
      reference: sanitizeInput(reference) || 'Portfolio Service Payment',
      responseUrl: PAYPHONE_CONFIG.responseUrl,
      lang: document.documentElement.lang || 'en',
    };

    const widget = new window.PPaymentButtonBox(widgetConfig);

    widget.render('pp-button');

    if (successEl) {
      successEl.style.display = 'block';
    }

  } catch (error) {
    console.error('Payphone widget error:', error);
    if (errorEl) {
      errorEl.textContent = error.message || 'Error loading payment widget';
      errorEl.style.display = 'block';
    }
  }
}

// Handle form submission
async function handlePaymentForm(event) {
  event.preventDefault();

  if (isProcessing) return;

  const amountInput = document.getElementById('payment-amount');
  const referenceInput = document.getElementById('payment-reference');
  const submitBtn = document.querySelector('.payment-form__submit');
  const errorEl = document.getElementById('payment-error');

  if (!amountInput) return;

  const amount = parseFloat(amountInput.value);
  const isSpanish = document.documentElement.lang === 'es';

  // Validate amount range (min $1, max $10,000)
  if (isNaN(amount) || amount < 1 || amount > 10000) {
    if (errorEl) {
      errorEl.textContent = isSpanish
        ? 'Por favor ingresa un monto válido ($1 - $10,000)'
        : 'Please enter a valid amount ($1 - $10,000)';
      errorEl.style.display = 'block';
    }
    return;
  }

  // Show loading state
  isProcessing = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = isSpanish ? 'Cargando...' : 'Loading...';
  }

  const reference = referenceInput ? referenceInput.value : '';

  try {
    await initPaymentWidget(amount, reference);
  } finally {
    isProcessing = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = isSpanish ? 'Continuar al Pago' : 'Continue to Payment';
    }
  }
}

// Initialize payment section
function initPaymentSection() {
  const form = document.getElementById('payment-form');
  if (form) {
    form.addEventListener('submit', handlePaymentForm);
  }
}

// Export for use in index.js
export default initPaymentSection;
