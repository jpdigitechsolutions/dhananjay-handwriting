// Dhananjay Classes - Handwriting Improvement Web App
// Author: Antigravity AI Assistant

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize live branch status
  updateLiveBranchStatus();
  setInterval(updateLiveBranchStatus, 60000); // Check every minute

  // Initialize Results Filtering
  initResultTabs();

  // Initialize Mobile Menu
  initMobileMenu();

  // Initialize Keyboard listener for Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // Modal backdrop click to close
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }
});

/* ==========================================================
   1. LIVE BRANCH STATUS (IST TIME CALCULATION)
   ========================================================== */
function updateLiveBranchStatus() {
  // Current Indian Time (IST = UTC + 5:30)
  const now = new Date();
  const utcOffset = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utcOffset + (3600000 * 5.5));

  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentDecimalTime = hours + (minutes / 60);

  let isOpen = false;
  let statusText = '';
  let badgeColor = 'emerald'; // emerald, amber, red

  if (day >= 1 && day <= 6) {
    // Monday to Saturday
    if (currentDecimalTime >= 8 && currentDecimalTime < 13) {
      isOpen = true;
      statusText = 'Open Now (Morning Batch till 1:00 PM)';
      badgeColor = 'emerald';
    } else if (currentDecimalTime >= 13 && currentDecimalTime < 15) {
      isOpen = false;
      statusText = 'Afternoon Break (Reopens at 3:00 PM)';
      badgeColor = 'amber';
    } else if (currentDecimalTime >= 15 && currentDecimalTime < 21) {
      isOpen = true;
      statusText = 'Open Now (Evening Batch till 9:00 PM)';
      badgeColor = 'emerald';
    } else {
      isOpen = false;
      statusText = 'Closed Now (Opens Tomorrow at 8:00 AM)';
      badgeColor = 'red';
    }
  } else {
    // Sunday
    if (currentDecimalTime >= 9 && currentDecimalTime < 13) {
      isOpen = true;
      statusText = 'Open Now (Sunday Batch till 1:00 PM)';
      badgeColor = 'emerald';
    } else {
      isOpen = false;
      statusText = 'Closed (Sunday Evening Closed • Opens Mon 8 AM)';
      badgeColor = 'red';
    }
  }

  // Update Top Pill
  const livePill = document.getElementById('liveStatusPill');
  if (livePill) {
    if (isOpen) {
      livePill.className = 'hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold';
      livePill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span><span>Branch Open Now</span>';
    } else {
      livePill.className = 'hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold';
      livePill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span><span>Branch Currently Closed</span>';
    }
  }

  // Update Strip Tag
  const stripTag = document.getElementById('liveStatusTag');
  if (stripTag) {
    if (isOpen) {
      stripTag.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      stripTag.textContent = '🟢 ' + statusText;
    } else {
      stripTag.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30';
      stripTag.textContent = '🔴 ' + statusText;
    }
  }

  // Update Card Pill
  const cardPill = document.getElementById('liveStatusCardPill');
  if (cardPill) {
    if (isOpen) {
      cardPill.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300';
      cardPill.textContent = '🟢 Currently Open';
    } else {
      cardPill.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300';
      cardPill.textContent = '🔴 Currently Closed';
    }
  }
}

/* ==========================================================
   2. FILTER TABS (BEFORE & AFTER SAMPLES)
   ========================================================== */
function initResultTabs() {
  const tabs = document.querySelectorAll('.result-tab');
  const cards = document.querySelectorAll('.result-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      // Update active tab styles
      tabs.forEach(t => {
        t.classList.remove('active-tab');
        t.classList.add('inactive-tab');
      });
      tab.classList.add('active-tab');
      tab.classList.remove('inactive-tab');

      // Filter cards
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================
   3. LIGHTBOX MODAL
   ========================================================== */
function openLightbox(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  if (modal && img) {
    img.src = src;
    cap.textContent = caption || 'Student Handwriting Result Sample';
    modal.classList.add('active');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/* ==========================================================
   4. MOBILE DRAWER MENU
   ========================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const openIcon = document.getElementById('menuOpenIcon');
  const closeIcon = document.getElementById('menuCloseIcon');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      if (openIcon) openIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    });
  });
}

/* ==========================================================
   5. WHATSAPP INQUIRY GENERATOR
   ========================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const studentClass = document.getElementById('studentClass').value;
  const courseLang = document.getElementById('courseLanguage').value;
  
  const shiftElem = document.querySelector('input[name="batchShift"]:checked');
  const shift = shiftElem ? shiftElem.value : 'Morning';
  const notes = document.getElementById('studentNotes').value.trim();

  // Craft WhatsApp formatted message
  let msg = `*New Admission Inquiry - Dhananjay Classes* ✍️\n\n`;
  msg += `👤 *Name:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `🎓 *Category/Class:* ${studentClass}\n`;
  msg += `📖 *Course Interested:* ${courseLang}\n`;
  msg += `⏰ *Preferred Shift:* ${shift}\n`;
  if (notes) {
    msg += `📝 *Notes/Issues:* ${notes}\n`;
  }
  msg += `\nPlease provide fee details and batch confirmation.`;

  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/917709501331?text=${encodedMsg}`;

  // Open WhatsApp in new tab / application
  window.open(waUrl, '_blank');
}

/* ==========================================================
   6. BILINGUAL TRANSLATION (ENGLISH <-> MARATHI)
   ========================================================== */
const translations = {
  en: {
    top_notice: "Handwriting Material Free • Individual 1-on-1 Teaching • All Ages Welcome",
    logo_sub: "Handwriting Improvement Classes • Jalgaon",
    nav_home: "Home",
    nav_courses: "Courses",
    nav_results: "Before & After Results",
    nav_features: "Why Us",
    nav_certificate: "Certificate",
    nav_timings: "Timings & Location",
    nav_contact: "Contact",
    btn_whatsapp: "WhatsApp Us",
    hero_badge: "✨ Jalgaon's Premier Handwriting Improvement Center",
    hero_title_mr: "सुंदर हस्ताक्षर, उज्वल भविष्य!",
    hero_title_en: "Transform Your Handwriting in Just a Few Days",
    hero_desc: "Boost confidence, speed, and exam marks with personalized 1-on-1 handwriting coaching in Marathi, Hindi, English Print, and English Cursive. Complete study material provided free with 100% satisfaction guarantee.",
    usp_1: "100% Result Guarantee",
    usp_2: "Free Study Material",
    usp_3: "1-on-1 Individual Teaching",
    usp_4: "Flexible Batch Timings",
    cta_demo: "Book Demo / WhatsApp Sir",
    cta_results: "See Student Results",
    timing_label: "Branch Hours:",
    loc_label: "Main Branch Jalgaon:",
    btn_maps: "Get Directions",
    btn_visit: "Visit Branch",
    results_badge: "Proven Results With Real Evidence",
    results_title: "Real Student Transformations (Before vs After)",
    results_desc: "See actual class sheets showing dramatic improvement in letter shapes, neatness, line alignment, and writing speed.",
    courses_title: "Handwriting Programs for Every Need",
    courses_desc: "Specialized programs designed for school children, board exam students, college students, and working professionals.",
    c1_title: "Marathi Handwriting (मराठी हस्ताक्षर)",
    c1_desc: "Focuses on correct Devanagari stroke order, proper Kana-Matra positioning, straight Shirorekha, and rapid reading/writing fluency.",
    c2_title: "Hindi Handwriting (हिंदी हस्ताक्षर)",
    c2_desc: "Transform jagged Hindi letters into balanced, clean, and legible handwriting that fetches top marks in school and board exams.",
    c3_title: "English Cursive Mastery",
    c3_desc: "Master flowing cursive penmanship. Learn connected looping, uniform forward slant, rhythm, and fatigue-free hand posture.",
    c4_title: "English Print Writing",
    c4_desc: "Designed for crystal clear, printer-like legibility. Ideal for competitive exams, science diagrams, forms, and neat everyday notes.",
    c5_title: "Speed Writing Practice (गतिमान सराव)",
    c5_desc: "Never leave exam questions unwritten due to lack of time! Learn specialized techniques to write 2x faster without degrading legibility.",
    c6_title: "Mirror Writing Training",
    c6_desc: "Unique neural-development training that enhances left & right brain coordination, concentration, focus, and bilateral hand dexterity.",
    why_title: "Why Dhananjay Classes is Jalgaon's #1 Choice",
    why_desc: "We don't believe in crowded mass classes. Every student gets personalized guidance directly from Dhananjay Sir.",
    f1_title: "Handwriting Material Free",
    f1_desc: "Complete set of custom practice sheets, lined guides, and pens/pencils are provided at zero extra cost.",
    f2_title: "Individual 1-on-1 Teaching",
    f2_desc: "Each student's unique grip, hand angle, and letter flaws are identified and corrected individually with patience.",
    f3_title: "Speed Writing & Fast Reading",
    f3_desc: "Helps students finish full 80/100 mark school & board exam question papers easily within the allotted time limit.",
    f4_title: "Choose Any Time for Class",
    f4_desc: "Morning 8am-1pm or afternoon/evening 3pm-9pm slots. Students choose timings that fit their school or college schedule.",
    f5_title: "Fast-Track in Minimum Days",
    f5_desc: "Vacation batches and fast-track sessions allow busy students to finish their handwriting mastery rapidly without dragging for months.",
    f6_title: "100% Satisfaction Guarantee",
    f6_desc: "All problems related to illegibility, improper spacing, slow pace, and mirror writing are guaranteed to be resolved.",
    cert_title: "Course Certificate of Achievement Provided",
    cert_desc: "Every student who completes our handwriting improvement curriculum receives a verified Certificate of Achievement from Dhananjay Classes, signed personally by Dhananjay Sir.",
    timing_title: "Branch Address & Daily Timings",
    timing_desc: "Please come to the main branch to get all information about the class and see direct student transformations.",
    class_schedule: "Class Working Schedule",
    form_title: "Send Instant Admission Inquiry",
    form_desc: "Fill this quick 30-second form and your details will be instantly sent directly to Dhananjay Sir on WhatsApp!"
  },
  mr: {
    top_notice: "अभ्यासक्रम साहित्य मोफत • वैयक्तिक १-ऑन-१ शिकवणी • सर्व वयोगटांसाठी प्रवेश सुरू",
    logo_sub: "हस्ताक्षर सुधारणा क्लासेस • जळगाव",
    nav_home: "मुख्यपृष्ठ",
    nav_courses: "अभ्यासक्रम",
    nav_results: "रिझल्ट्स (अगोदर / नंतर)",
    nav_features: "वैशिष्ट्ये",
    nav_certificate: "प्रमाणपत्र",
    nav_timings: "वेळ व पत्ता",
    nav_contact: "प्रवेश चौकशी",
    btn_whatsapp: "व्हॉट्सॲप करा",
    hero_badge: "✨ जळगावमधील अग्रगण्य हस्ताक्षर सुधारणा संस्था",
    hero_title_mr: "सुंदर हस्ताक्षर, उज्वल भविष्य!",
    hero_title_en: "काहीच दिवसात आपल्या हस्ताक्षरात १००% सुधारणा घडवा",
    hero_desc: "मराठी, हिंदी, इंग्लिश प्रिंट आणि कर्सिव्ह अक्षरांसाठी धनंजय सरांचे वैयक्तिक मार्गदर्शन. अभ्यासक्रम साहित्य पूर्णपणे मोफत आणि १००% रिझल्ट गॅरंटी.",
    usp_1: "१००% रिझल्ट गॅरंटी",
    usp_2: "अभ्यासक्रम साहित्य मोफत",
    usp_3: "वैयक्तिक शिकवणी (1-on-1)",
    usp_4: "कोणतीही वेळ निवडण्याची सुविधा",
    cta_demo: "डेमो क्लास / व्हॉट्सॲप मेसेज",
    cta_results: "विद्यार्थ्यांचे रिझल्ट्स पहा",
    timing_label: "क्लास वेळ:",
    loc_label: "मुख्य शाखा जळगाव:",
    btn_maps: "गूगल मॅप दिशा",
    btn_visit: "शाखेला भेट द्या",
    results_badge: "प्रत्यक्ष पुरावा आणि १००% सुधारणा",
    results_title: "विद्यार्थ्यांचे प्रत्यक्ष रिझल्ट्स (अगोदर vs नंतर)",
    results_desc: "क्लासमध्ये विद्यार्थ्यांच्या अक्षरांच्या वळणात, वेगात आणि मांडणीत झालेला प्रत्यक्ष बदल पहा.",
    courses_title: "विविध भाषांनुसार विशेष अभ्यासक्रम",
    courses_desc: "शालेय विद्यार्थी, बोर्ड परीक्षा देणारे, महाविद्यालयीन आणि नोकरदार व्यक्तींसाठी खास डिझाइन केलेले कोर्सेस.",
    c1_title: "मराठी हस्ताक्षर सुधारणा",
    c1_desc: "काना-मात्रांची योग्य जागा, सरळ शिरोरेषा, देवनागरी वळण आणि वेगात लिहिण्याचा सराव.",
    c2_title: "हिंदी सुंदर व गतिमान हस्ताक्षर",
    c2_desc: "हिंदी अक्षरांचे अचूक प्रमाण, शुद्धलेखन आणि बोर्ड परीक्षेत अधिक गुण मिळवून देणारी सुंदर मांडणी.",
    c3_title: "इंग्लिश कर्सिव्ह रायटिंग (English Cursive)",
    c3_desc: "सुबक कर्सिव्ह लिपी, अक्षरांचे अखंड जोडकाम, योग्य तिरपेपणा (slant) आणि हात न दुखता जलद लिखाण.",
    c4_title: "इंग्लिश प्रिंट रायटिंग (English Print)",
    c4_desc: "प्रिंट प्रमाणे सुस्पष्ट आणि वाचनीय अक्षर, स्पर्धा परीक्षा, नोट्स आणि फॉर्म भरण्यासाठी अत्यंत उपयुक्त.",
    c5_title: "गतिमान लिखाण सराव (Speed Writing)",
    c5_desc: "परीक्षेत वेळेअभावी प्रश्न सुटू नयेत म्हणून अक्षरांचे सौंदर्य टिकवून २ पट वेगाने लिहिण्याचा विशेष सराव.",
    c6_title: "मिरर रायटिंग (उलट लिखाण सराव)",
    c6_desc: "मेंदूच्या दोन्ही भागांचा समन्वय, एकाग्रता, स्मरणशक्ती आणि हातांची लवचिकता वाढवणारे विशेष प्रशिक्षण.",
    why_title: "धनंजय क्लासेसच का निवडावे?",
    why_desc: "गर्दीच्या क्लासेसमध्ये मुलांकडे दुर्लक्ष होते. येथे प्रत्येक विद्यार्थ्यावर सरांचे वैयक्तिक लक्ष असते.",
    f1_title: "अभ्यासक्रम साहित्य मोफत",
    f1_desc: "सराव पुस्तिका, विशेष गाईड्स आणि पेन/पेन्सिल साहित्य कोणत्याही अतिरिक्त शुल्काशिवाय मोफत दिले जाते.",
    f2_title: "वैयक्तिक शिकवणी (Separate Facilities)",
    f2_desc: "प्रत्येक विद्यार्थ्याची पेन पकडण्याची पद्धत, बसण्याची पद्धत व त्रुटी ओळखून वैयक्तिक मार्गदर्शन.",
    f3_title: "गतिमान लिखाण व वाचन सुधारणा",
    f3_desc: "बोर्ड परीक्षेत पूर्ण ८०/१०० मार्कांचा पेपर वेळेत आणि स्वच्छ हस्ताक्षरात सोडवण्याचा आत्मविश्वास.",
    f4_title: "कोणतीही वेळ निवडण्याची मुभा",
    f4_desc: "सकाळी ८ ते १ किंवा दुपारी ३ ते ९ यापैकी शाळेच्या व इतर क्लासच्या वेळेनुसार सोयीची वेळ निवडता येते.",
    f5_title: "कमीत कमी दिवसात अभ्यासक्रम पूर्ण",
    f5_desc: "सुट्ट्यांमध्ये किंवा जलद गतीने कोर्स पूर्ण करण्यासाठी फास्ट-ट्रॅक बॅचची विशेष सोय उपलब्ध.",
    f6_title: "१००% समाधान व रिझल्ट गॅरंटी",
    f6_desc: "हस्ताक्षर आणि वाचनाशी संबंधित सर्व समस्यांचे १००% खात्रीशीर निवारण.",
    cert_title: "कोर्स पूर्ण केल्याचे अधिकृत प्रमाणपत्र",
    cert_desc: "कोर्स यशस्वीरीत्या पूर्ण करणाऱ्या प्रत्येक विद्यार्थ्याला धनंजय क्लासेसचे अधिकृत 'Certificate of Achievement' सन्मानपूर्वक प्रदान केले जाते.",
    timing_title: "मुख्य शाखेचा पत्ता व वेळ",
    timing_desc: "क्लासची संपूर्ण माहिती जाणून घेण्यासाठी आणि प्रत्यक्ष बदल पाहण्यासाठी कृपया मुख्य शाखेत अवश्य भेट द्या.",
    class_schedule: "क्लासचे दैनिक वेळापत्रक",
    form_title: "त्वरित प्रवेश चौकशी फॉर्म",
    form_desc: "हा ३० सेकंदांचा साधा फॉर्म भरा, तुमची माहिती थेट धनंजय सरांना व्हॉट्सॲपवर पाठवली जाईल!"
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Switch active state on buttons
  const btnEn = document.getElementById('langEn');
  const btnMr = document.getElementById('langMr');

  if (lang === 'mr') {
    btnMr.className = 'px-2.5 py-1 rounded-lg transition-all duration-200 bg-white text-brand-navy shadow-sm';
    btnEn.className = 'px-2.5 py-1 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800';
    document.documentElement.lang = 'mr';
  } else {
    btnEn.className = 'px-2.5 py-1 rounded-lg transition-all duration-200 bg-white text-brand-navy shadow-sm';
    btnMr.className = 'px-2.5 py-1 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800';
    document.documentElement.lang = 'en';
  }

  // Refresh Lucide icons in case any innerHTML was changed
  if (window.lucide) {
    lucide.createIcons();
  }
}
