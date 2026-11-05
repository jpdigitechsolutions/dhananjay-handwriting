// Dhananjay Classes - Handwriting Improvement Web App
// Author: Antigravity AI Assistant

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  // Check stored language preference
  const savedLang = localStorage.getItem('dhananjay_lang') || 'en';
  setLanguage(savedLang);

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
  const now = new Date();
  const utcOffset = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utcOffset + (3600000 * 5.5));

  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentDecimalTime = hours + (minutes / 60);

  let isOpen = false;
  let statusTextEn = '';
  let statusTextMr = '';

  if (day >= 1 && day <= 6) {
    // Monday to Saturday
    if (currentDecimalTime >= 8 && currentDecimalTime < 13) {
      isOpen = true;
      statusTextEn = 'Open Now (Morning Batch till 1:00 PM)';
      statusTextMr = 'चालू आहे (सकाळची बॅच दु. १:०० वाजेपर्यंत)';
    } else if (currentDecimalTime >= 13 && currentDecimalTime < 15) {
      isOpen = false;
      statusTextEn = 'Afternoon Break (Reopens at 3:00 PM)';
      statusTextMr = 'दुपारची विश्रांती (दु. ३:०० वाजता पुन्हा सुरू)';
    } else if (currentDecimalTime >= 15 && currentDecimalTime < 21) {
      isOpen = true;
      statusTextEn = 'Open Now (Evening Batch till 9:00 PM)';
      statusTextMr = 'चालू आहे (संध्याकाळची बॅच रात्री ९:०० वाजेपर्यंत)';
    } else {
      isOpen = false;
      statusTextEn = 'Closed Now (Opens Tomorrow at 8:00 AM)';
      statusTextMr = 'सध्या बंद (उद्या सकाळी ८:०० वाजता सुरू)';
    }
  } else {
    // Sunday
    if (currentDecimalTime >= 9 && currentDecimalTime < 13) {
      isOpen = true;
      statusTextEn = 'Open Now (Sunday Batch till 1:00 PM)';
      statusTextMr = 'चालू आहे (रविवारची बॅच दु. १:०० वाजेपर्यंत)';
    } else {
      isOpen = false;
      statusTextEn = 'Closed (Sunday Evening Closed • Opens Mon 8 AM)';
      statusTextMr = 'बंद आहे (रविवारी संध्याकाळी बंद • सोमवारी स. ८ वाजता सुरू)';
    }
  }

  const isMr = currentLang === 'mr';
  const statusText = isMr ? statusTextMr : statusTextEn;

  // Update Top Pill
  const livePill = document.getElementById('liveStatusPill');
  if (livePill) {
    if (isOpen) {
      livePill.className = 'hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold';
      livePill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span><span>${isMr ? 'शाखा सध्या चालू आहे' : 'Branch Open Now'}</span>`;
    } else {
      livePill.className = 'hidden sm:inline-flex items-center gap-1.5 text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold';
      livePill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span><span>${isMr ? 'शाखा सध्या बंद आहे' : 'Branch Currently Closed'}</span>`;
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
      cardPill.textContent = isMr ? '🟢 सध्या चालू आहे' : '🟢 Currently Open';
    } else {
      cardPill.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300';
      cardPill.textContent = isMr ? '🔴 सध्या बंद आहे' : '🔴 Currently Closed';
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
        const cardCats = (card.getAttribute('data-category') || '').split(' ');
        if (category === 'all' || cardCats.includes(category)) {
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
  let msg = '';
  if (currentLang === 'mr') {
    msg = `*नवीन प्रवेश चौकशी - धनंजय क्लासेस* ✍️\n\n`;
    msg += `👤 *नाव:* ${name}\n`;
    msg += `📞 *मोबाईल:* ${phone}\n`;
    msg += `🎓 *इयत्ता/श्रेणी:* ${studentClass}\n`;
    msg += `📖 *हवे असलेले अक्षर/कोर्स:* ${courseLang}\n`;
    msg += `⏰ *सोयीची वेळ:* ${shift}\n`;
    if (notes) {
      msg += `📝 *नोंद/समस्या:* ${notes}\n`;
    }
    msg += `\nकृपया प्रवेश प्रक्रिया आणि फीची माहिती द्यावी.`;
  } else {
    msg = `*New Admission Inquiry - Dhananjay Classes* ✍️\n\n`;
    msg += `👤 *Name:* ${name}\n`;
    msg += `📞 *Phone:* ${phone}\n`;
    msg += `🎓 *Category/Class:* ${studentClass}\n`;
    msg += `📖 *Course Interested:* ${courseLang}\n`;
    msg += `⏰ *Preferred Shift:* ${shift}\n`;
    if (notes) {
      msg += `📝 *Notes/Issues:* ${notes}\n`;
    }
    msg += `\nPlease provide fee details and batch confirmation.`;
  }

  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/917709501331?text=${encodedMsg}`;

  // Log to Google Firebase Analytics
  if (typeof window.trackEvent === 'function') {
    window.trackEvent('admission_inquiry_sent', {
      student_name: name,
      student_class: studentClass,
      course_lang: courseLang,
      shift: shift,
      language: currentLang
    });
  }

  // Open WhatsApp in new tab / application
  window.open(waUrl, '_blank');
}

/* ==========================================================
   6. BILINGUAL TRANSLATION (ENGLISH <-> MARATHI)
   ========================================================== */
const translations = {
  en: {
    // Top Bar & Navigation
    top_badge: "Admission Open",
    top_notice: "Handwriting Material Free • Individual 1-on-1 Teaching • All Ages Welcome • Call: 7709501331 • Mahabal Area, Jalgaon",
    logo_sub: "Handwriting Classes • Jalgaon",
    nav_home: "Home",
    nav_courses: "Courses",
    nav_results: "Results",
    nav_proof_badge: "Proof",
    nav_features: "Why Us",
    nav_certificate: "Certificate",
    nav_timings: "Timings",
    nav_contact: "Contact",
    btn_whatsapp: "WhatsApp Us",
    mob_call_sir: "Call Sir: 7709501331",
    mob_location: "Open Google Location",

    // Hero Section
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
    hero_sir_label: "Handwriting Sir:",
    hero_area_label: "• Mahabal Area, Jalgaon",

    // Poster Card
    poster_badge: "ADMISSION OPEN",
    poster_contact_lbl: "Direct Contact",
    poster_satisfaction_lbl: "Satisfaction",
    poster_guarantee_lbl: "100% Guaranteed",
    poster_lang_taught: "Languages Taught",
    poster_lang_list: "मराठी • हिंदी • English • Cursive",

    // Timings Strip
    timing_label: "Branch Hours:",
    timing_schedule_desc: "Mon–Sat: 8 AM–1 PM & 3 PM–9 PM | Sun: 9 AM–1 PM",
    loc_label: "Main Branch Jalgaon:",
    loc_desc: "Mohan Nagar Rd, Chaitraban Colony, Mahabal Area",
    btn_maps: "Get Directions",
    btn_visit: "Visit Branch",

    // Results Section
    results_badge: "Proven Results With Real Evidence",
    results_title: "Real Student Transformations (Before vs After)",
    results_desc: "See actual class sheets showing dramatic improvement in letter shapes, neatness, line alignment, and writing speed.",
    tab_all: "All Samples",
    tab_marathi: "मराठी (अगोदर / नंतर)",
    tab_hindi: "हिंदी (पहले / बाद मे)",
    tab_cursive: "English Cursive",
    tab_print: "English Print",
    tab_mirror: "Mirror Writing",
    r11_lang_badge: "Marathi Mirror",
    r11_badge: "Before vs After",
    r11_title: "Marathi Mirror Writing",
    r11_desc: "Specialized inverted and ambidextrous writing mastery for cognitive and handwriting precision.",
    r12_lang_badge: "English Mirror",
    r12_badge: "Before vs After",
    r12_title: "English Mirror Writing",
    r12_desc: "Flawless left-to-right mirror reflection handwriting demonstrated with uniform letter heights.",
    click_to_enlarge: "Click to Enlarge Full Sheet",

    // 10 Result Cards
    r1_badge: "अगोदर vs नंतर",
    r1_title: "Devanagari Flowing & Speed Handwriting",
    r1_desc: "100% improvement in Shirorekha, letter proportions, and neatness.",

    r2_badge: "पहले vs बाद मे",
    r2_title: "Hindi Clean & Attractive Writing Improvement",
    r2_desc: "Accurate Matra spacing, straight alignment, and top exam readability.",

    r3_badge: "Before vs After",
    r3_title: "Flowing Cursive & Looping Mastery",
    r3_desc: "Uniform letter slant, connected joints, and clean baseline.",

    r4_badge: "Before vs After",
    r4_title: "Speed & Elegance Combination",
    r4_desc: "From jagged unreadable lines to smooth cursive beauty.",

    r5_badge: "Before vs After",
    r5_title: "Upright English Print & Spacing",
    r5_desc: "Perfect spacing between words and precise letter casing.",

    r6_badge: "Before vs After",
    r6_title: "Exam Presentation Perfection",
    r6_desc: "Legible font-like lettering designed for high exam scores.",

    r7_badge: "Before vs After",
    r7_title: "Clean Spacing & Straight Alignment",
    r7_desc: "Clear line discipline and proper letter proportions.",

    r8_badge: "Before vs After",
    r8_title: "Artistic Cursive Penmanship",
    r8_desc: "Mastery over loops, ascenders, descenders, and speed.",

    r9_badge: "Before vs After",
    r9_title: "Elimination of Shaky Letters",
    r9_desc: "Firm strokes and fluent handwriting confidence.",

    r10_badge: "Before vs After",
    r10_title: "Exam Speed and Fluidity",
    r10_desc: "Smooth flow without fatigue during 3-hour exam sessions.",

    results_more_title: "Want to see more live student samples?",
    results_more_desc: "Visit our main branch in Mahabal area, Jalgaon to inspect hundreds of verified student records in person!",
    results_more_btn: "Book Personal Counseling",

    // Courses Section
    courses_badge: "Comprehensive Curriculum",
    courses_title: "Handwriting Programs for Every Need",
    courses_desc: "Specialized programs designed for school children, board exam students, college students, and working professionals.",

    c1_badge_1: "देवनागरी लिपी",
    c1_badge_2: "Fast-Track Available",
    c1_title: "Marathi Handwriting (मराठी हस्ताक्षर)",
    c1_desc: "Focuses on correct Devanagari stroke order, proper Kana-Matra positioning, straight Shirorekha, and rapid reading/writing fluency.",
    c1_item1: "Free Marathi practice workbook",
    c1_item2: "Shirorekha alignment techniques",
    c1_item3: "1-on-1 personalized daily feedback",
    c1_btn: "Inquire for Marathi",

    c2_badge_1: "राष्ट्रभाषा",
    c2_badge_2: "School & Board",
    c2_title: "Hindi Handwriting (हिंदी हस्ताक्षर)",
    c2_desc: "Transform jagged Hindi letters into balanced, clean, and legible handwriting that fetches top marks in school and board exams.",
    c2_item1: "Standard letter curves and joints",
    c2_item2: "Speed writing training for exams",
    c2_item3: "Eliminate spelling & writing errors",
    c2_btn: "Inquire for Hindi",

    c3_badge_1: "Most Popular",
    c3_badge_2: "Fast & Flowing",
    c3_title: "English Cursive Mastery",
    c3_desc: "Master flowing cursive penmanship. Learn connected looping, uniform forward slant, rhythm, and fatigue-free hand posture.",
    c3_item1: "Continuous cursive stroke training",
    c3_item2: "High speed writing without hand pain",
    c3_item3: "Free cursive calligraphy booklet",
    c3_btn: "Inquire for Cursive",

    c4_badge_1: "Clarity & Precision",
    c4_badge_2: "All Standards",
    c4_title: "English Print Writing",
    c4_desc: "Designed for crystal clear, printer-like legibility. Ideal for competitive exams, science diagrams, forms, and neat everyday notes.",
    c4_item1: "Consistent character height & spacing",
    c4_item2: "Uppercase and lowercase harmonization",
    c4_item3: "Neat paper presentation tactics",
    c4_btn: "Inquire for Print",

    c5_badge_1: "Speed Booster",
    c5_badge_2: "Board Exams",
    c5_title: "Speed Writing Practice (गतिमान सराव)",
    c5_desc: "Never leave exam questions unwritten due to lack of time! Learn specialized techniques to write 2x faster without degrading legibility.",
    c5_item1: "Timed test simulations & drills",
    c5_item2: "Grip tension release techniques",
    c5_item3: "Fast Reading improvement included",
    c5_btn: "Inquire for Speed Writing",

    c6_badge_1: "Special Program",
    c6_badge_2: "Brain Agility",
    c6_title: "Mirror Writing Training",
    c6_desc: "Unique neural-development training that enhances left & right brain coordination, concentration, focus, and bilateral hand dexterity.",
    c6_item1: "Enhanced focus and memory power",
    c6_item2: "Rare and impressive artistic skill",
    c6_item3: "Special coaching by Dhananjay Sir",
    c6_btn: "Inquire for Mirror Writing",

    // Why Us Section
    why_badge: "Our Special Advantages",
    why_title: "Why Dhananjay Classes is Jalgaon's #1 Choice",
    why_desc: "We don't believe in crowded mass classes. Every student gets personalized guidance directly from Dhananjay Sir.",

    f1_title: "Handwriting Material Free",
    f1_sub: "Free Practice Kit",
    f1_desc: "Complete set of custom practice sheets, lined guides, and pens/pencils are provided at zero extra cost.",

    f2_title: "Individual 1-on-1 Teaching",
    f2_sub: "Separately Teaching Facilities",
    f2_desc: "Each student's unique grip, hand angle, and letter flaws are identified and corrected individually with patience.",

    f3_title: "Speed Writing & Fast Reading",
    f3_sub: "Speed & Comprehension",
    f3_desc: "Helps students finish full 80/100 mark school & board exam question papers easily within the allotted time limit.",

    f4_title: "Choose Any Time for Class",
    f4_sub: "Flexible Batch Timings",
    f4_desc: "Morning 8am-1pm or afternoon/evening 3pm-9pm slots. Students choose timings that fit their school or college schedule.",

    f5_title: "Fast-Track in Minimum Days",
    f5_sub: "Rapid Transformation",
    f5_desc: "Vacation batches and fast-track sessions allow busy students to finish their handwriting mastery rapidly without dragging for months.",

    f6_title: "100% Satisfaction Guarantee",
    f6_sub: "100% Result Guarantee",
    f6_desc: "All problems related to illegibility, improper spacing, slow pace, and mirror writing are guaranteed to be resolved.",

    // Certificate Section
    cert_badge: "Official Recognition",
    cert_title: "Course Certificate of Achievement Provided",
    cert_desc: "Every student who completes our handwriting improvement curriculum receives a verified Certificate of Achievement from Dhananjay Classes, signed personally by Dhananjay Sir.",
    cert_f1_title: "Boosts Child's Confidence",
    cert_f1_desc: "Inspires students to take pride in their writing and school assignments.",
    cert_f2_title: "Official Class Record",
    cert_f2_desc: "Documents language mastery: Marathi, Hindi, English Print or Cursive.",
    cert_btn: "Inquire About Certification",
    cert_poster_badge: "Certificate Included",
    cert_poster_caption: "Actual Certificate & Features Poster displayed at Mahabal Branch",

    // Timings & Location Section
    timing_badge: "Visit Our Main Branch",
    timing_title: "Branch Address & Daily Timings",
    timing_desc: "\"Please come to the main branch to get all information about the class and see direct student transformations.\"",
    class_schedule: "Class Working Schedule",

    sched_d1_title: "Monday to Saturday (सोमवार ते शनिवार)",
    sched_d1_sub: "Two flexible shifts for students & workers",
    sched_d1_morn: "8:00 AM – 1:00 PM",
    sched_d1_eve: "3:00 PM – 9:00 PM",

    sched_d2_title: "Sunday (रविवार)",
    sched_d2_sub: "Morning batch only",
    sched_d2_morn: "9:00 AM – 1:00 PM",
    sched_d2_eve: "Evening Closed (संध्याकाळी बंद)",

    sched_note_title: "Note:",
    sched_note_desc: "(Please come to the class to get all information benefits about Handwriting class)",
    inquiry_class_note: "(Please come to the class to get all information benefits about Handwriting class)",

    branch_loc_title: "Main Branch Location",
    branch_loc_addr: "Mohan nagar road, Chaitraban colony, Mahabal area Jalgaon",
    branch_loc_sir: "Contact: 7709501331 (Dhananjay Sir)",
    btn_open_gmap: "Open Google Map",

    map_card_title: "Directions & Google Maps Link",
    map_share_link: "Share Link",
    map_area_heading: "Mahabal Area, Jalgaon",
    map_area_desc: "Near Mohan Nagar Road, Chaitraban Colony. Click the button below to launch Google Maps directly for turn-by-turn driving & walking directions.",
    map_nav_btn: "Navigate to Dhananjay Classes",
    map_trouble_txt: "Have trouble finding us?",
    map_call_sir: "Call Sir for Assistance",

    // Admission Form
    form_badge: "Quick Admission & Demo",
    form_title: "Send Instant Admission Inquiry",
    form_desc: "Fill this quick 30-second form and your details will be instantly sent directly to Dhananjay Sir on WhatsApp!",

    lbl_student_name: "Student / Parent Name *",
    lbl_phone_number: "Mobile / WhatsApp Number *",
    lbl_student_class: "Student Class / Category",
    lbl_course_lang: "Language Required *",
    lbl_batch_shift: "Preferred Batch Shift",
    opt_shift_morning: "Morning Shift (8:00 AM – 1:00 PM)",
    opt_shift_evening: "Afternoon/Evening Shift (3:00 PM – 9:00 PM)",
    lbl_student_notes: "Specific Handwriting Issues or Questions (Optional)",
    btn_submit_form: "Send Inquiry to Dhananjay Sir on WhatsApp",
    form_privacy_note: "🔒 No spam. This directly opens a pre-formatted message in your WhatsApp app for instant chat with Sir.",

    // Select Options
    opt_cls_1: "Primary School (1st - 5th Std)",
    opt_cls_2: "Middle School (6th - 8th Std)",
    opt_cls_3: "High School & Board (9th - 10th Std)",
    opt_cls_4: "Junior College (11th - 12th Std)",
    opt_cls_5: "College Student / Graduate",
    opt_cls_6: "Adult / Working Professional",

    opt_lng_1: "All Languages (Combo Complete Course)",
    opt_lng_2: "Marathi Handwriting (मराठी)",
    opt_lng_3: "Hindi Handwriting (हिंदी)",
    opt_lng_4: "English Cursive Penmanship",
    opt_lng_5: "English Print Handwriting",
    opt_lng_6: "Speed Writing Practice",
    opt_lng_7: "Mirror Writing Special",

    ph_name: "e.g. Ramesh Patil",
    ph_phone: "e.g. 9876543210",
    ph_notes: "e.g. Needs speed improvement for 10th board exams, bad pen grip, etc.",

    // FAQ Section
    faq_title: "Frequently Asked Questions (FAQ)",
    faq_subtitle: "Common questions asked by parents and students.",

    faq_q1: "What age group is eligible to join Dhananjay Classes?",
    faq_a1: "Students of all ages are welcome! From primary school children (1st std onwards), 10th/12th board aspirants, engineering and medical college students, to adults and working professionals looking to refine their signature and handwriting.",

    faq_q2: "Are practice materials and workbooks provided free of charge?",
    faq_a2: "Yes, 100%! All course practice books, guide sheets, and customized materials are provided completely free with admission. You don't need to purchase extra books.",

    faq_q3: "Can I choose my own batch timing?",
    faq_a3: "Yes, absolutely. We offer complete flexibility. You can select any suitable time slot between 8:00 AM – 1:00 PM in the morning or 3:00 PM – 9:00 PM in the evening, ensuring it never clashes with your school or other coaching.",

    faq_q4: "How fast can I see improvement?",
    faq_a4: "Because of our 1-on-1 individual teaching method, noticeable improvement starts from the very first few sessions. We also offer a fast-track facility to complete the entire course in a minimum number of days during vacations.",

    // Footer
    footer_tagline: "हस्ताक्षर सुधारणा क्लासेस",
    footer_about: "Jalgaon's dedicated center for Handwriting Improvement, Cursive Writing, Speed Writing, and Mirror Writing. 100% Guaranteed Results with 1-on-1 teaching.",
    footer_guarantee_badge: "★ 100% Satisfaction",
        footer_h_links: "Quick Links",
    footer_link_home: "Home",
    footer_link_courses: "Courses Offered",
    footer_link_results: "Before & After Results",
    footer_link_features: "Why Choose Us",
    footer_link_certificate: "Course Certificate",
    footer_link_timings: "Branch Timings",
    footer_link_contact: "Admission Inquiry",
    footer_link_poster: "Print QR Poster",
    footer_h_hours: "Class Hours",
    footer_h_address: "Branch Address",

    footer_mon_sat: "Monday – Saturday:",
    footer_shift_morn: "Morning: 8:00 AM – 1:00 PM",
    footer_shift_eve: "Afternoon/Evening: 3:00 PM – 9:00 PM",
    footer_sun: "Sunday:",
    footer_sun_morn: "Morning: 9:00 AM – 1:00 PM",
    footer_sun_closed: "Evening Closed",

    footer_addr_text: "Mohan nagar road, Chaitraban colony, Mahabal area, Jalgaon, Maharashtra.",
    footer_sir_name: "Dhananjay R. Dishware",
    footer_gmap_link: "Google Location Pin",
    footer_rights: "© 2026 DHANANJAY Classes • Handwriting Improvement Classes, Jalgaon. All Rights Reserved.",

    // Sticky Bottom Bar
    mob_bar_call: "Call Sir",
    mob_bar_wa: "WhatsApp",
    mob_bar_loc: "Location",
    mob_bar_enroll: "Enroll"
  },

  mr: {
    // Top Bar & Navigation
    top_badge: "प्रवेश सुरू",
    top_notice: "अभ्यासक्रम साहित्य मोफत • वैयक्तिक १-ऑन-१ शिकवणी • सर्व वयोगटांसाठी प्रवेश सुरू • संपर्क: ७७०९५०१३३१ • महाबळ परिसर, जळगाव",
    logo_sub: "हस्ताक्षर क्लासेस • जळगाव",
    nav_home: "मुख्यपृष्ठ",
    nav_courses: "अभ्यासक्रम",
    nav_results: "रिझल्ट्स",
    nav_proof_badge: "पुरावा",
    nav_features: "वैशिष्ट्ये",
    nav_certificate: "प्रमाणपत्र",
    nav_timings: "वेळापत्रक",
    nav_contact: "संपर्क",
    btn_whatsapp: "व्हॉट्सॲप",
    mob_call_sir: "कॉल करा: ७७०९५०१३३१",
    mob_location: "गूगल लोकेशन उघडा",

    // Hero Section
    hero_badge: "✨ जळगावमधील अग्रगण्य हस्ताक्षर सुधारणा संस्था",
    hero_title_mr: "सुंदर हस्ताक्षर, उज्वल भविष्य!",
    hero_title_en: "काहीच दिवसात आपल्या हस्ताक्षरात १००% सुधारणा घडवा",
    hero_desc: "मराठी, हिंदी, इंग्लिश प्रिंट आणि कर्सिव्ह अक्षरांसाठी धनंजय सरांचे वैयक्तिक मार्गदर्शन. अभ्यासक्रम साहित्य मोफत आणि १००% समाधान गॅरंटी.",
    usp_1: "१००% रिझल्ट गॅरंटी",
    usp_2: "अभ्यासक्रम साहित्य मोफत",
    usp_3: "वैयक्तिक शिकवणी (1-on-1)",
    usp_4: "सोयीची वेळ निवडण्याची सुविधा",
    cta_demo: "डेमो क्लास / व्हॉट्सॲप मेसेज",
    cta_results: "विद्यार्थ्यांचे रिझल्ट्स पहा",
    hero_sir_label: "हस्ताक्षर तज्ज्ञ सर:",
    hero_area_label: "• महाबळ परिसर, जळगाव",

    // Poster Card
    poster_badge: "प्रवेश सुरू",
    poster_contact_lbl: "थेट संपर्क",
    poster_satisfaction_lbl: "समाधान",
    poster_guarantee_lbl: "१००% गॅरंटीड",
    poster_lang_taught: "शिकवल्या जाणाऱ्या भाषा",
    poster_lang_list: "मराठी • हिंदी • English • Cursive",

    // Timings Strip
    timing_label: "शाखेची वेळ:",
    timing_schedule_desc: "सोम-शनि: सकाळी ८ ते १ आणि दु. ३ ते ९ | रवि: स. ९ ते १",
    loc_label: "मुख्य शाखा जळगाव:",
    loc_desc: "मोहन नगर रोड, चैत्रबन कॉलनी, महाबळ परिसर",
    btn_maps: "गूगल मॅप दिशा",
    btn_visit: "शाखेला भेट द्या",

    // Results Section
    results_badge: "प्रत्यक्ष पुरावा आणि १००% सुधारणा",
    results_title: "विद्यार्थ्यांचे प्रत्यक्ष रिझल्ट्स (अगोदर vs नंतर)",
    results_desc: "क्लासमध्ये विद्यार्थ्यांच्या अक्षरांच्या वळणात, वेगात आणि मांडणीत झालेला प्रत्यक्ष बदल पहा.",
    tab_all: "सर्व नमुने",
    tab_marathi: "मराठी (अगोदर / नंतर)",
    tab_hindi: "हिंदी (पहले / बाद मे)",
    tab_cursive: "English Cursive",
    tab_print: "English Print",
    tab_mirror: "मिरर रायटिंग (उलट लिखाण)",
    r11_lang_badge: "मराठी मिरर",
    r11_badge: "अगोदर vs नंतर",
    r11_title: "मराठी मिरर रायटिंग",
    r11_desc: "उलट अक्षरांचे अचूक, सुबक व गतिमान लिखाण करण्याचे प्रगत तंत्र.",
    r12_lang_badge: "इंग्रजी मिरर",
    r12_badge: "Before vs After",
    r12_title: "इंग्रजी मिरर रायटिंग",
    r12_desc: "आरशात पाहिल्यावर सरळ दिसणारे अचूक व प्रमाणित इंग्रजी उलट लिखाण कौशल्य.",
    click_to_enlarge: "पूर्ण शीट पाहण्यासाठी क्लिक करा",

    // 10 Result Cards
    r1_badge: "अगोदर vs नंतर",
    r1_title: "देवनागरी वळणदार व गतिमान हस्ताक्षर",
    r1_desc: "शिरोरेषा, अक्षरांचे प्रमाण व सुवाच्यतेत १००% सुधारणा.",

    r2_badge: "पहले vs बाद मे",
    r2_title: "हिंदी शुद्ध व आकर्षक लेखन सुधारणा",
    r2_desc: "मात्रांचे योग्य प्रमाण व ओळीतील सरळपणा परिपूर्ण.",

    r3_badge: "अगोदर vs नंतर",
    r3_title: "इंग्लिश कर्सिव्ह वळण व अखंड जोडकाम",
    r3_desc: "अक्षरांचा योग्य तिरपेपणा, सुबक जोडकाम आणि सरळ ओळ.",

    r4_badge: "अगोदर vs नंतर",
    r4_title: "वेग आणि सौंदर्य यांचा मिलाफ",
    r4_desc: "खराब आणि अस्पष्ट अक्षरांचे रूपांतर सुंदर कर्सिव्ह लिपीत.",

    r5_badge: "अगोदर vs नंतर",
    r5_title: "सरळ इंग्लिश प्रिंट व अचूक अंतर",
    r5_desc: "शब्दांमधील अचूक अंतर आणि कॅपिटल/स्मॉल अक्षरांचा समन्वय.",

    r6_badge: "अगोदर vs नंतर",
    r6_title: "परीक्षेसाठी परिपूर्ण पेपर सादरीकरण",
    r6_desc: "परीक्षेत जास्तीत जास्त गुण मिळवून देणारे सुस्पष्ट व सुंदर अक्षर.",

    r7_badge: "अगोदर vs नंतर",
    r7_title: "स्वच्छ मांडणी व सरळ ओळींची शिस्त",
    r7_desc: "ओळीतील अचूक प्रमाणबद्धता आणि अक्षरांची सुबक रचना.",

    r8_badge: "अगोदर vs नंतर",
    r8_title: "कलात्मक कर्सिव्ह हस्ताक्षर कौशल्य",
    r8_desc: "लूप्स, वरच्या व खालच्या स्ट्रोक्सवर परिपूर्ण नियंत्रण.",

    r9_badge: "अगोदर vs नंतर",
    r9_title: "थरथरणारे व वाकडे अक्षर पूर्ण बंद",
    r9_desc: "आत्मविश्वासू आणि स्थिर हाताने लिहिण्याचा सराव.",

    r10_badge: "अगोदर vs नंतर",
    r10_title: "परीक्षेतील वेग आणि सुलभता",
    r10_desc: "३ तासांच्या परीक्षेत हात न दुखता सातत्यपूर्ण वेग.",

    results_more_title: "आणखी विद्यार्थ्यांचे प्रत्यक्ष रिझल्ट्स पहायचे आहेत?",
    results_more_desc: "शेकडो विद्यार्थ्यांच्या मूळ नोंदवह्या प्रत्यक्ष पाहण्यासाठी महाबळ परिसरातील मुख्य शाखेला भेट द्या!",
    results_more_btn: "वैयक्तिक मार्गदर्शनासाठी भेटा",

    // Courses Section
    courses_badge: "सर्वसमावेशक अभ्यासक्रम",
    courses_title: "विविध भाषांनुसार विशेष अभ्यासक्रम",
    courses_desc: "शालेय विद्यार्थी, बोर्ड परीक्षा देणारे, महाविद्यालयीन आणि नोकरदार व्यक्तींसाठी खास कोर्सेस.",

    c1_badge_1: "देवनागरी लिपी",
    c1_badge_2: "फास्ट-ट्रॅक उपलब्ध",
    c1_title: "मराठी हस्ताक्षर सुधारणा",
    c1_desc: "काना-मात्रांची योग्य जागा, सरळ शिरोरेषा, देवनागरी वळण आणि वेगात लिहिण्याचा सराव.",
    c1_item1: "मोफत मराठी सराव कार्यपुस्तिका",
    c1_item2: "शिरोरेषा सरळ ठेवण्याचे विशेष तंत्र",
    c1_item3: "प्रत्येक दिवशी सरांचे वैयक्तिक लक्ष",
    c1_btn: "मराठीसाठी चौकशी करा",

    c2_badge_1: "राष्ट्रभाषा",
    c2_badge_2: "शाळा व बोर्ड परीक्षा",
    c2_title: "हिंदी सुंदर व गतिमान हस्ताक्षर",
    c2_desc: "हिंदी अक्षरांचे अचूक प्रमाण, शुद्धलेखन आणि बोर्ड परीक्षेत अधिक गुण मिळवून देणारी सुंदर मांडणी.",
    c2_item1: "अक्षरांचे योग्य वळण व जोडाक्षरे",
    c2_item2: "परीक्षेसाठी गतिमान लिखाण सराव",
    c2_item3: "लेखनातील चुका व खाडाखोड पूर्ण बंद",
    c2_btn: "हिंदीसाठी चौकशी करा",

    c3_badge_1: "सर्वाधिक लोकप्रिय",
    c3_badge_2: "जलद व आकर्षक",
    c3_title: "इंग्लिश कर्सिव्ह रायटिंग (Cursive)",
    c3_desc: "सुबक कर्सिव्ह लिपी, अक्षरांचे अखंड जोडकाम, योग्य तिरपेपणा आणि हात न दुखता जलद लिखाण.",
    c3_item1: "अखंड कर्सिव्ह स्ट्रोकचे प्रशिक्षण",
    c3_item2: "हात न दुखता दुप्पट वेगाने लिखाण",
    c3_item3: "मोफत कर्सिव्ह सराव पुस्तिका",
    c3_btn: "कर्सिव्हसाठी चौकशी करा",

    c4_badge_1: "अचूकता व स्पष्टता",
    c4_badge_2: "सर्व इयत्तांसाठी",
    c4_title: "इंग्लिश प्रिंट रायटिंग (Print)",
    c4_desc: "प्रिंट प्रमाणे सुस्पष्ट आणि वाचनीय अक्षर, स्पर्धा परीक्षा, नोट्स आणि फॉर्म भरण्यासाठी अत्यंत उपयुक्त.",
    c4_item1: "अक्षरांची एकसारखी उंची व अचूक अंतर",
    c4_item2: "कॅपिटल व स्मॉल अक्षरांची योग्य मांडणी",
    c4_item3: "परीक्षेत पेपर सादरीकरणाची पद्धत",
    c4_btn: "प्रिंटसाठी चौकशी करा",

    c5_badge_1: "स्पीड बूस्टर",
    c5_badge_2: "बोर्ड परीक्षा विशेष",
    c5_title: "गतिमान लिखाण सराव (Speed Writing)",
    c5_desc: "परीक्षेत वेळेअभावी प्रश्न सुटू नयेत म्हणून अक्षरांचे सौंदर्य टिकवून २ पट वेगाने लिहिण्याचा विशेष सराव.",
    c5_item1: "वेळेचे नियोजन व प्रत्यक्ष परीक्षा सराव",
    c5_item2: "पेन पकडण्याचा ताण कमी करण्याचे तंत्र",
    c5_item3: "जलद वाचन सुधारणेचाही समावेश",
    c5_btn: "स्पीड रायटिंगसाठी चौकशी करा",

    c6_badge_1: "विशेष प्रशिक्षण",
    c6_badge_2: "मेंदूचा विकास",
    c6_title: "मिरर रायटिंग (उलट लिखाण सराव)",
    c6_desc: "मेंदूच्या दोन्ही भागांचा समन्वय, एकाग्रता, स्मरणशक्ती आणि हातांची लवचिकता वाढवणारे विशेष प्रशिक्षण.",
    c6_item1: "एकाग्रता व स्मरणशक्तीत लक्षणीय वाढ",
    c6_item2: "अनोखे व कौतुकास्पद कलात्मक कौशल्य",
    c6_item3: "धनंजय सरांचे प्रत्यक्ष वैयक्तिक मार्गदर्शन",
    c6_btn: "मिरर रायटिंगसाठी चौकशी करा",

    // Why Us Section
    why_badge: "आमची खास वैशिष्ट्ये",
    why_title: "धनंजय क्लासेसच का निवडावे?",
    why_desc: "गर्दीच्या क्लासेसमध्ये मुलांकडे दुर्लक्ष होते. येथे प्रत्येक विद्यार्थ्यावर सरांचे वैयक्तिक लक्ष असते.",

    f1_title: "अभ्यासक्रम साहित्य मोफत",
    f1_sub: "मोफत अभ्यास साहित्य",
    f1_desc: "सराव पुस्तिका, विशेष गाईड्स आणि पेन/पेन्सिल साहित्य कोणत्याही अतिरिक्त शुल्काशिवाय मोफत दिले जाते.",

    f2_title: "वैयक्तिक १-ऑन-१ शिकवणी",
    f2_sub: "प्रत्येकाकडे स्वतंत्र लक्ष",
    f2_desc: "प्रत्येक विद्यार्थ्याची पेन पकडण्याची पद्धत, बसण्याची पद्धत व त्रुटी ओळखून वैयक्तिक मार्गदर्शन.",

    f3_title: "गतिमान लिखाण व वाचन सुधारणा",
    f3_sub: "वेग आणि आकलन क्षमता",
    f3_desc: "बोर्ड परीक्षेत पूर्ण ८०/१०० मार्कांचा पेपर वेळेत आणि स्वच्छ हस्ताक्षरात सोडवण्याचा आत्मविश्वास.",

    f4_title: "कोणतीही वेळ निवडण्याची मुभा",
    f4_sub: "आपल्या सोयीनुसार बॅच",
    f4_desc: "सकाळी ८ ते १ किंवा दुपारी ३ ते ९ यापैकी शाळेच्या व इतर क्लासच्या वेळेनुसार सोयीची वेळ निवडता येते.",

    f5_title: "कमीत कमी दिवसात अभ्यासक्रम पूर्ण",
    f5_sub: "जलद निकाल",
    f5_desc: "सुट्ट्यांमध्ये किंवा जलद गतीने कोर्स पूर्ण करण्यासाठी फास्ट-ट्रॅक बॅचची विशेष सोय उपलब्ध.",

    f6_title: "१००% समाधान व रिझल्ट गॅरंटी",
    f6_sub: "खात्रीशीर निकाल",
    f6_desc: "हस्ताक्षर आणि वाचनाशी संबंधित सर्व समस्यांचे १००% खात्रीशीर निवारण.",

    // Certificate Section
    cert_badge: "अधिकृत सन्मान",
    cert_title: "कोर्स पूर्ण केल्याचे अधिकृत प्रमाणपत्र",
    cert_desc: "कोर्स यशस्वीरीत्या पूर्ण करणाऱ्या प्रत्येक विद्यार्थ्याला धनंजय क्लासेसचे अधिकृत 'Certificate of Achievement' सन्मानपूर्वक प्रदान केले जाते.",
    cert_f1_title: "विद्यार्थ्यांचा आत्मविश्वास वाढवतो",
    cert_f1_desc: "शालेय गृहपाठ व परीक्षेत सुंदर अक्षराचा अभिमान बाळगण्याची प्रेरणा.",
    cert_f2_title: "अधिकृत क्लास प्रमाणपत्र",
    cert_f2_desc: "मराठी, हिंदी, इंग्लिश प्रिंट किंवा कर्सिव्ह लिपीतील प्रावीण्याचा दाखला.",
    cert_btn: "प्रमाणपत्राविषयी माहिती घ्या",
    cert_poster_badge: "प्रमाणपत्र समाविष्ट",
    cert_poster_caption: "महाबळ शाखेत प्रदर्शित मूळ प्रमाणपत्र व पोस्टर",

    // Timings & Location Section
    timing_badge: "मुख्य शाखेला भेट द्या",
    timing_title: "मुख्य शाखेचा पत्ता व वेळ",
    timing_desc: "\"क्लासची संपूर्ण माहिती जाणून घेण्यासाठी आणि प्रत्यक्ष बदल पाहण्यासाठी कृपया मुख्य शाखेत अवश्य भेट द्या.\"",
    class_schedule: "क्लासचे दैनिक वेळापत्रक",

    sched_d1_title: "सोमवार ते शनिवार (Mon to Sat)",
    sched_d1_sub: "विद्यार्थी व नोकरदारांसाठी दोन सोयीच्या वेळा",
    sched_d1_morn: "सकाळी ८:०० ते दु. १:००",
    sched_d1_eve: "दुपारी ३:०० ते रात्री ९:००",

    sched_d2_title: "रविवार (Sunday)",
    sched_d2_sub: "फक्त सकाळची बॅच",
    sched_d2_morn: "सकाळी ९:०० ते दु. १:००",
    sched_d2_eve: "संध्याकाळी क्लास बंद राहील",

    sched_note_title: "नोंद:",
    sched_note_desc: "(हस्ताक्षर क्लासची संपूर्ण माहिती व फायदे जाणून घेण्यासाठी कृपया क्लासमध्ये प्रत्यक्ष भेट द्या)",
    inquiry_class_note: "(हस्ताक्षर क्लासची संपूर्ण माहिती व फायदे जाणून घेण्यासाठी कृपया क्लासमध्ये प्रत्यक्ष भेट द्या)",

    branch_loc_title: "मुख्य शाखेचा पत्ता",
    branch_loc_addr: "मोहन नगर रोड, चैत्रबन कॉलनी, महाबळ परिसर, जळगाव",
    branch_loc_sir: "संपर्क: ७७०९५०१३३१ (धनंजय सर)",
    btn_open_gmap: "गूगल मॅप उघडा",

    map_card_title: "गूगल मॅप दिशा व लिंक",
    map_share_link: "लिंक शेअर करा",
    map_area_heading: "महाबळ परिसर, जळगाव",
    map_area_desc: "मोहन नगर रोड, चैत्रबन कॉलनीजवळ. थेट रस्त्याचा नकाशा व दिशा पाहण्यासाठी खालील बटनावर क्लिक करा.",
    map_nav_btn: "शाखेचा रस्ता दाखवा (Navigate)",
    map_trouble_txt: "पत्ता शोधण्यात अडचण येत आहे?",
    map_call_sir: "मार्गदर्शनासाठी सरांना कॉल करा",

    // Admission Form
    form_badge: "त्वरित प्रवेश व डेमो",
    form_title: "त्वरित प्रवेश चौकशी फॉर्म",
    form_desc: "हा ३० सेकंदांचा साधा फॉर्म भरा, तुमची माहिती थेट धनंजय सरांना व्हॉट्सॲपवर पाठवली जाईल!",

    lbl_student_name: "विद्यार्थी / पालकांचे नाव *",
    lbl_phone_number: "मोबाईल / व्हॉट्सॲप नंबर *",
    lbl_student_class: "इयत्ता / श्रेणी",
    lbl_course_lang: "हवे असलेले हस्ताक्षर *",
    lbl_batch_shift: "सोयीची वेळ / शिफ्ट",
    opt_shift_morning: "सकाळची शिफ्ट (८:०० AM – १:०० PM)",
    opt_shift_evening: "दुपार/संध्याकाळ शिफ्ट (३:०० PM – ९:०० PM)",
    lbl_student_notes: "हस्ताक्षरातील विशिष्ट समस्या किंवा प्रश्न (ऐच्छिक)",
    btn_submit_form: "धनंजय सरांना व्हॉट्सॲपवर माहिती पाठवा",
    form_privacy_note: "🔒 कोणतीही जाहिरात नाही. थेट व्हॉट्सॲपवर सरांशी त्वरित संवाद साधण्यासाठी मेसेज तयार होईल.",

    // Select Options
    opt_cls_1: "प्राथमिक शाळा (पहिली ते पाचवी)",
    opt_cls_2: "माध्यमिक शाळा (सहावी ते आठवी)",
    opt_cls_3: "हायस्कूल व बोर्ड परीक्षा (नववी - दहावी)",
    opt_cls_4: "कनिष्ठ महाविद्यालय (अकरावी - बारावी)",
    opt_cls_5: "कॉलेज विद्यार्थी / पदवीधर",
    opt_cls_6: "नोकरदार / इतर नागरिक",

    opt_lng_1: "सर्व भाषा (मराठी + हिंदी + इंग्लिश + कर्सिव्ह कॉम्बो)",
    opt_lng_2: "मराठी हस्ताक्षर सुधारणा",
    opt_lng_3: "हिंदी सुंदर हस्ताक्षर",
    opt_lng_4: "इंग्लिश कर्सिव्ह रायटिंग",
    opt_lng_5: "इंग्लिश प्रिंट रायटिंग",
    opt_lng_6: "गतिमान लिखाण सराव (Speed Writing)",
    opt_lng_7: "मिरर रायटिंग विशेष प्रशिक्षण",

    ph_name: "उदा. रमेश पाटील",
    ph_phone: "उदा. ९८७६५४३२१०",
    ph_notes: "उदा. १० वी बोर्ड परीक्षेसाठी स्पीड वाढवायचा आहे, पेन पकडण्यात अडचण इत्यादी.",

    // FAQ Section
    faq_title: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
    faq_subtitle: "पालक व विद्यार्थ्यांच्या मनातील महत्त्वाचे प्रश्न.",

    faq_q1: "धनंजय क्लासेसमध्ये कोणत्या वयोगटातील विद्यार्थी प्रवेश घेऊ शकतात?",
    faq_a1: "सर्व वयोगटांसाठी वर्ग खुले आहेत! पहिलीपासूनचे शालेय विद्यार्थी, दहावी/बारावी बोर्ड परीक्षा देणारे, कॉलेजचे विद्यार्थी तसेच स्वाक्षरी व अक्षर सुधारू इच्छिणारे नोकरदार व प्रौढ व्यक्तीही प्रवेश घेऊ शकतात.",

    faq_q2: "सराव साहित्य आणि कार्यपुस्तिका मोफत मिळतात का?",
    faq_a2: "होय, १००%! प्रवेशासोबत सर्व सराव पुस्तके, गाईड शीट्स आणि विशेष साहित्य पूर्णपणे मोफत दिले जाते. बाहेरून कोणतेही पुस्तक विकत घेण्याची गरज नाही.",

    faq_q3: "मला माझ्या सोयीनुसार बॅचची वेळ निवडता येते का?",
    faq_a3: "होय, नक्कीच! सकाळी ८ ते १ किंवा दुपारी ३ ते रात्री ९ या वेळेत तुम्ही तुमच्या शाळा किंवा इतर क्लासच्या वेळेनुसार सोयीची वेळ निवडू शकता.",

    faq_q4: "हस्ताक्षरात बदल किती दिवसात दिसून येतो?",
    faq_a4: "सरांच्या वैयक्तिक १-ऑन-१ शिकवणीमुळे पहिल्या काही दिवसांतच प्रत्यक्ष बदल दिसू लागतो. सुट्ट्यांमध्ये कमीत कमी दिवसात कोर्स पूर्ण करण्याची फास्ट-ट्रॅक सुविधा उपलब्ध आहे.",

    // Footer
    footer_tagline: "हस्ताक्षर सुधारणा क्लासेस",
    footer_about: "हस्ताक्षर सुधारणा, कर्सिव्ह रायटिंग, गतिमान सराव आणि मिरर रायटिंगसाठी जळगावातील अग्रगण्य केंद्र. वैयक्तिक शिकवणीसह १००% रिझल्ट गॅरंटी.",
    footer_guarantee_badge: "★ १००% समाधान",
        footer_h_links: "महत्त्वाच्या लिंक्स",
    footer_link_home: "मुख्यपृष्ठ",
    footer_link_courses: "अभ्यासक्रम",
    footer_link_results: "रिझल्ट्स (अगोदर / नंतर)",
    footer_link_features: "आमची वैशिष्ट्ये",
    footer_link_certificate: "कोर्स प्रमाणपत्र",
    footer_link_timings: "वेळापत्रक व पत्ता",
    footer_link_contact: "प्रवेश चौकशी",
    footer_link_poster: "QR पोस्टर प्रिंट करा",
    footer_h_hours: "शाखेची वेळ",
    footer_h_address: "शाखेचा पत्ता",

    footer_mon_sat: "सोमवार ते शनिवार:",
    footer_shift_morn: "सकाळी: ८:०० AM ते १:०० PM",
    footer_shift_eve: "दुपारी/संध्याकाळी: ३:०० PM ते ९:०० PM",
    footer_sun: "रविवार:",
    footer_sun_morn: "सकाळी: ९:०० AM ते १:०० PM",
    footer_sun_closed: "संध्याकाळी बंद",

    footer_addr_text: "मोहन नगर रोड, चैत्रबन कॉलनी, महाबळ परिसर, जळगाव, महाराष्ट्र.",
    footer_sir_name: "धनंजय आर. डिशवारे",
    footer_gmap_link: "गूगल लोकेशन पिन",
    footer_rights: "© २०२६ धनंजय क्लासेस • हस्ताक्षर सुधारणा क्लासेस, जळगाव. सर्व हक्क राखीव.",

    // Sticky Bottom Bar
    mob_bar_call: "कॉल करा",
    mob_bar_wa: "व्हॉट्सॲप",
    mob_bar_loc: "पत्ता",
    mob_bar_enroll: "प्रवेश"
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('dhananjay_lang', lang);
  if (typeof window.trackEvent === 'function') {
    window.trackEvent('language_switched', { selected_lang: lang });
  }
  const dict = translations[lang];
  if (!dict) return;

  // 1. Text elements with data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // 2. Input/Textarea Placeholders
  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Switch active state on buttons
  const btnEn = document.getElementById('langEn');
  const btnMr = document.getElementById('langMr');

  if (btnEn && btnMr) {
    if (lang === 'mr') {
      btnMr.className = 'px-2 sm:px-2.5 py-1 rounded-lg transition-all duration-200 bg-white text-brand-navy shadow-sm';
      btnEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800';
      document.documentElement.lang = 'mr';
    } else {
      btnEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg transition-all duration-200 bg-white text-brand-navy shadow-sm';
      btnMr.className = 'px-2 sm:px-2.5 py-1 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800';
      document.documentElement.lang = 'en';
    }
  }

  // Update live status text in selected language
  updateLiveBranchStatus();

  // Refresh Lucide icons if any were re-rendered
  if (window.lucide) {
    lucide.createIcons();
  }
}


/* ==========================================================
   7. HIDE INJECTED NETLIFY BADGE / DRAWER / SHADOW DOM
   ========================================================== */
function removeNetlifyBadge() {
  const selectors = [
    '#nl-badge',
    '.nl-badge',
    '#nl-card',
    '.nl-card',
    '.nl-badge-label',
    '.nl-badge-brand',
    '[class*="nl-badge"]',
    '[id*="nl-badge"]',
    '[class*="nl-card"]',
    '[id*="nl-card"]',
    '[aria-controls="nl-card"]',
    '[aria-label*="Powered by Netlify"]',
    'iframe#netlify-drawer',
    'iframe[src*="netlify"]',
    '[data-netlify-drawer]',
    'div[class*="netlify-drawer"]',
    '#netlify-badge',
    '.netlify-badge',
    'netlify-badge',
    'netlify-drawer',
    'a[href*="www.netlify.com"]',
    'a[href*="app.netlify.com"]'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.href && el.href.includes('jpdigitechsolutions')) {
        return;
      }
      el.style.setProperty('display', 'none', 'important');
      try { el.remove(); } catch (e) {}
    });
  });

  // Remove any Shadow DOM host or bottom-right injected container
  document.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      const html = (el.shadowRoot.innerHTML || '').toLowerCase();
      if (html.includes('netlify') && !html.includes('jpdigitechsolutions')) {
        el.style.setProperty('display', 'none', 'important');
        try { el.remove(); } catch (e) {}
      }
    }
    const tag = el.tagName.toLowerCase();
    if (tag.includes('netlify')) {
      el.style.setProperty('display', 'none', 'important');
      try { el.remove(); } catch (e) {}
    }
  });

  // Check body children for floating badge
  if (document.body) {
    Array.from(document.body.children).forEach(child => {
      const tag = child.tagName.toLowerCase();
      if (['script', 'link', 'header', 'section', 'footer', 'aside'].includes(tag)) {
        return;
      }
      if (child.id === 'lightboxModal' || child.id === 'mobileMenu') {
        return;
      }
      const text = (child.textContent || '').toLowerCase();
      if (text.includes('powered by netlify')) {
        if (!child.querySelector('a[href*="jpdigitechsolutions"]')) {
          child.style.setProperty('display', 'none', 'important');
          try { child.remove(); } catch (e) {}
        }
      }
    });
  }
}

// Run immediately, on load, and observe dynamic DOM injections
removeNetlifyBadge();
window.addEventListener('load', removeNetlifyBadge);

if (typeof MutationObserver !== 'undefined') {
  const netlifyObserver = new MutationObserver(removeNetlifyBadge);
  if (document.body) {
    netlifyObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      netlifyObserver.observe(document.body, { childList: true, subtree: true });
    });
  }
}
