/**
 * ============================================================================
 * GOOGLE FIREBASE ANALYTICS & GOOGLE ANALYTICS 4 (GA4) INTEGRATION
 * Project: Dhananjay Handwriting Improvement Classes
 * ============================================================================
 * 
 * 📌 कशा प्रकारे FIREBASE ANALYTICS चालू करावे (HOW TO ACTIVATE):
 * 1. Visit https://console.firebase.google.com/
 * 2. Add or select your Firebase Project.
 * 3. Make sure Google Analytics is enabled for the project.
 * 4. Add a Web App (</>) named "Dhananjay Handwriting".
 * 5. Replace the placeholder values in `firebaseConfig` below with your real keys.
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// ⚙️ FIREBASE CONFIGURATION (REPLACE WITH YOUR PROJECT DETAILS):
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXXXX" // Google Analytics 4 Measurement ID
};

const APP_NAME = "Dhananjay Handwriting Classes";

// Check if actual configuration has been provided
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("REPLACE_") &&
  !firebaseConfig.apiKey.includes("YOUR_")
);

let analytics = null;
let firebaseApp = null;

/**
 * Initialize Firebase & Google Analytics 4 safely
 */
async function initFirebase() {
  if (!isConfigured) {
    console.info(
      `%c[Firebase Analytics - ${APP_NAME}]%c\nℹ️ Ready for setup! Add your Firebase keys in 'firebase-analytics.js' to stream live visitor & inquiry metrics.`,
      "color: #e11d48; font-weight: bold; font-size: 11px;",
      "color: #94a3b8; font-size: 11px;"
    );
    return;
  }

  try {
    const supported = await isSupported();
    if (supported) {
      firebaseApp = initializeApp(firebaseConfig);
      analytics = getAnalytics(firebaseApp);
      
      // Initial page view event
      logEvent(analytics, "page_view", {
        app_name: APP_NAME,
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });

      console.info(
        `%c[Firebase Analytics - Active]%c Connected to Google Analytics GA4 (${firebaseConfig.measurementId || 'Active'})`,
        "color: #10b981; font-weight: bold;",
        "color: #64748b;"
      );
    }
  } catch (error) {
    console.error(`[Firebase Analytics Init Error]:`, error);
  }
}

/**
 * Universal Event Tracker
 * @param {string} eventName - e.g., 'admission_inquiry', 'call_sir_click', 'whatsapp_click'
 * @param {object} params - Additional event data
 */
export function trackEvent(eventName, params = {}) {
  try {
    const enriched = {
      app_name: APP_NAME,
      timestamp: new Date().toISOString(),
      ...params
    };

    if (analytics) {
      logEvent(analytics, eventName, enriched);
    } else {
      // In development / demo mode:
      // console.debug(`[Analytics Event Tracked]: ${eventName}`, enriched);
    }
  } catch (err) {
    console.warn(`[Analytics Logging Error] for '${eventName}':`, err);
  }
}

// Attach globally to window
window.trackEvent = trackEvent;
window.dhananjayAnalytics = {
  trackEvent,
  getAnalytics: () => analytics,
  getApp: () => firebaseApp,
  isReady: () => Boolean(analytics)
};

// Initialize
initFirebase();

/**
 * Automatic Event Tracking for user interactions
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. WhatsApp Button Clicks (Header, Hero CTA, Sticky Mobile Bar)
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("whatsapp_click", {
        button_id: el.id || 'whatsapp_btn',
        destination: el.getAttribute("href") || "",
        placement: el.closest("section, header, aside, div")?.id || "page"
      });
    });
  });

  // 2. Direct Call to Sir (7709501331)
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("call_sir_click", {
        phone_number: el.getAttribute("href").replace("tel:", ""),
        placement: el.closest("section, header, nav, div")?.id || "page"
      });
    });
  });

  // 3. Google Maps / Branch Location Clicks
  document.querySelectorAll('a[href*="google.com/maps"], a[href*="share.google"]').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("location_directions_click", {
        url: el.getAttribute("href") || ""
      });
    });
  });

  // 4. Admission Inquiry Form
  const inquiryForm = document.getElementById("inquiryForm");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", () => {
      const studentClass = document.getElementById("studentClass")?.value || "";
      const courseLanguage = document.getElementById("courseLanguage")?.value || "";
      trackEvent("admission_inquiry_submitted", {
        student_class: studentClass,
        course_language: courseLanguage
      });
    });
  }

  // 5. Lightbox Student Sheet Preview
  document.querySelectorAll('[onclick*="openLightbox"], .result-card').forEach(card => {
    card.addEventListener("click", () => {
      trackEvent("student_sheet_view", {
        title: card.querySelector("h3, .title, strong")?.textContent?.trim() || "Handwriting Sample"
      });
    });
  });
});

