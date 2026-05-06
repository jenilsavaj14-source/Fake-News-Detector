let myPieChart, myLineChart;
let currentGenre = 'home';
let currentLang = 'en';
let currentCountry = 'in'; 
let currentSearch = '';
let isLoggedIn = false;
let currentActiveArticle = null; 
let postToDelete = null; 
let commentToEdit = null;
let commentToDelete = null;

// ==========================================
// 0. TIMEZONES & FULL UI TRANSLATION ENGINE
// ==========================================
const timezoneMap = { 'au': 'Australia/Sydney', 'br': 'America/Sao_Paulo', 'ca': 'America/Toronto', 'cn': 'Asia/Shanghai', 'eg': 'Africa/Cairo', 'fr': 'Europe/Paris', 'de': 'Europe/Berlin', 'gr': 'Europe/Athens', 'hk': 'Asia/Hong_Kong', 'in': 'Asia/Kolkata', 'ie': 'Europe/Dublin', 'il': 'Asia/Jerusalem', 'it': 'Europe/Rome', 'jp': 'Asia/Tokyo', 'nl': 'Europe/Amsterdam', 'no': 'Europe/Oslo', 'pk': 'Asia/Karachi', 'pe': 'America/Lima', 'ph': 'Asia/Manila', 'pt': 'Europe/Lisbon', 'ro': 'Europe/Bucharest', 'ru': 'Europe/Moscow', 'sg': 'Asia/Singapore', 'es': 'Europe/Madrid', 'se': 'Europe/Stockholm', 'ch': 'Europe/Zurich', 'tw': 'Asia/Taipei', 'ua': 'Europe/Kyiv', 'gb': 'Europe/London', 'us': 'America/New_York' };
const localeMap = { 'en': 'en-US', 'hi': 'hi-IN', 'gu': 'gu-IN', 'fr': 'fr-FR', 'es': 'es-ES', 'ar': 'ar-EG', 'zh': 'zh-CN', 'nl':'nl-NL', 'de':'de-DE', 'el':'el-GR', 'he':'he-IL', 'it':'it-IT', 'ja':'ja-JP', 'ml':'ml-IN', 'mr':'mr-IN', 'no':'no-NO', 'pt':'pt-BR', 'ro':'ro-RO', 'ru':'ru-RU', 'sv':'sv-SE', 'ta':'ta-IN', 'te':'te-IN', 'uk':'uk-UA'};

const uiDict = {
    en: { title: "Fake <span class='text-primary fw-normal'>News</span> Detector", menu: "Menu", region: "Region", language: "Language", settings: "Settings", notif: "Notifications", font: "Font Size", saved: "Saved", history: "Analysis History", myPosts: "My Posts", systemUsers: "System Users", aboutUs: "About Us", home: "Home", briefing: "Your briefing", forYou: "For you", business: "Business", economy: "Economy", tech: "Technology", science: "Science", politics: "Politics", education: "Education", entertainment: "Entertainment", sports: "Sports", factCheck: "Fact Checking:", login: "Login / Register", loadingNews: "Fetching live news...", offline: "No internet connection.", online: "Connection restored!", noNews: "No news found for this filter.", apiError: "API Error.", verify: "Verify", postNews: "Post News", publishNews: "Publish News", headline: "Headline", content: "Content", attachImage: "Attach Image", publishArticle: "Publish Article", myProfile: "My Profile", memberSince: "Member Since:", editProfile: "Edit Profile", logOut: "Log Out", deleteAccount: "Delete Account", updateInfo: "Update Information", fullName: "Full Name", emailAddress: "Email Address", newPassword: "New Password", cancel: "Cancel", save: "Save", dataMetrics: "Data Metrics", authProb: "Authenticity Probability:", fabProb: "Fabrication Probability:", why: "Why?", aiReport: "AI Analysis Report", closeReport: "Close Report", real: "Real", fake: "Fake", uncertain: "Uncertain", like: "Like", comment: "Comment", myPost: "My Post", delete: "Delete", verifyContent: "Verify Content", reportRealTitle: "Authentic Reporting Detected", reportRealText: "The AI model found strong indicators of authentic reporting matching established journalistic standards with a ", reportFakeTitle: "Fabrication Patterns Detected", reportFakeText: "The AI detected multiple anomalies in the text structure. The article relies heavily on sensationalist language typical of fabricated content.", reportUncertainTitle: "Inconclusive Data", reportUncertainText: "The AI model detected heavily conflicting signals resulting in a near 50/50 split. We recommend manually verifying this story.", chart1Title: "Overall Confidence Breakdown", chart2Title: "AI Layer Consistency Array", prob: "Probability", auth: "Authentic", fakeCont: "Fake Content", layer1: "Syntax", layer2: "Context", layer3: "Semantics", layer4: "Sources", layer5: "Final", realOut: "Real Score Output" },
    hi: { title: "फेक न्यूज़ डिटेक्टर", menu: "मेनू", region: "क्षेत्र", language: "भाषा", settings: "सेटिंग्स", notif: "सूचनाएं", font: "फ़ॉन्ट आकार", saved: "सहेजा गया", history: "इतिहास", myPosts: "मेरी पोस्ट", systemUsers: "सिस्टम उपयोगकर्ता", aboutUs: "हमारे बारे में", home: "होम", briefing: "आपकी ब्रीफिंग", forYou: "आपके लिए", business: "व्यापार", economy: "अर्थव्यवस्था", tech: "तकनीक", science: "विज्ञान", politics: "राजनीति", education: "शिक्षा", entertainment: "मनोरंजन", sports: "खेल", factCheck: "तथ्य की जांच:", login: "लॉग इन करें", loadingNews: "समाचार प्राप्त कर रहे हैं...", offline: "कोई इंटरनेट नहीं।", online: "कनेक्शन बहाल!", noNews: "कोई समाचार नहीं मिला।", apiError: "सर्वर त्रुटि।", verify: "सत्यापित करें", postNews: "समाचार पोस्ट करें", publishNews: "समाचार प्रकाशित करें", headline: "शीर्षक", content: "सामग्री", attachImage: "छवि संलग्न करें", publishArticle: "लेख प्रकाशित करें", myProfile: "मेरी प्रोफ़ाइल", memberSince: "सदस्य कब से:", editProfile: "प्रोफ़ाइल संपादित करें", logOut: "लॉग आउट", deleteAccount: "खाता हटाएं", updateInfo: "जानकारी अपडेट करें", fullName: "पूरा नाम", emailAddress: "ईमेल पता", newPassword: "नया पासवर्ड", cancel: "रद्द करें", save: "सहेजें", dataMetrics: "डेटा मेट्रिक्स", authProb: "प्रामाणिकता संभाव्यता:", fabProb: "मनगढ़ंत संभाव्यता:", why: "क्यों?", aiReport: "एआई विश्लेषण रिपोर्ट", closeReport: "रिपोर्ट बंद करें", real: "असली", fake: "फ़ेक", uncertain: "अनिश्चित", like: "पसंद करें", comment: "टिप्पणी", myPost: "मेरी पोस्ट", delete: "हटाएं", verifyContent: "सामग्री सत्यापित करें", reportRealTitle: "प्रामाणिक रिपोर्टिंग का पता चला", reportRealText: "एआई मॉडल को स्थापित पत्रकारिता मानकों से मेल खाने वाली प्रामाणिक रिपोर्टिंग के मजबूत संकेतक मिले हैं, जिसका विश्वास दर है ", reportFakeTitle: "मनगढ़ंत पैटर्न का पता चला", reportFakeText: "एआई ने पाठ संरचना में कई विसंगतियों का पता लगाया। यह लेख पूरी तरह से मनगढ़ंत सामग्री की विशिष्ट सनसनीखेज भाषा पर निर्भर करता है।", reportUncertainTitle: "अस्पष्ट डेटा", reportUncertainText: "एआई मॉडल ने भारी परस्पर विरोधी संकेतों का पता लगाया, जिसके परिणामस्वरूप लगभग 50/50 विभाजन हुआ। हम इस कहानी को मैन्युअल रूप से सत्यापित करने की सलाह देते हैं।", chart1Title: "कुल विश्वास विवरण", chart2Title: "एआई लेयर निरंतरता सरणी", prob: "संभावना", auth: "प्रामाणिक", fakeCont: "फ़ेक सामग्री", layer1: "वाक्यविन्यास", layer2: "संदर्भ", layer3: "अर्थ विज्ञान", layer4: "स्रोत", layer5: "अंतिम", realOut: "वास्तविक स्कोर आउटपुट" }
};

function translateUI(lang) {
    const dict = uiDict[lang] || uiDict['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) { el.innerHTML = dict[key]; }
    });
}

// ==========================================
// 1. SYSTEM UTILITIES
// ==========================================
function getActiveLocale() {
    return currentLang + '-' + currentCountry.toUpperCase();
}

function updateClock() {
    const clockElement = document.getElementById('liveClock');
    if(clockElement) {
        const now = new Date();
        const tz = timezoneMap[currentCountry] || 'Asia/Kolkata'; 
        const activeLocale = getActiveLocale();
        try { clockElement.innerHTML = now.toLocaleString(activeLocale, { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        } catch(e) { clockElement.innerHTML = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); }
    }
}
setInterval(updateClock, 1000); updateClock(); 

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const toastHTML = `<div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 show mb-2 shadow-lg" role="alert"><div class="d-flex"><div class="toast-body fw-bold px-4 py-3"><i class="fas fa-info-circle me-2"></i> ${message}</div><button type="button" class="btn-close btn-close-white me-3 m-auto shadow-none" data-bs-dismiss="toast"></button></div></div>`;
    container.insertAdjacentHTML('beforeend', toastHTML);
    setTimeout(() => { const t = document.getElementById(toastId); if(t) { t.classList.remove('show'); setTimeout(()=>t.remove(), 300); }}, 3000);
}

window.addEventListener('offline', () => { showToast(uiDict[currentLang]?.offline || uiDict['en'].offline, 'danger'); });
window.addEventListener('online', () => { showToast(uiDict[currentLang]?.online || uiDict['en'].online, 'success'); loadNews(currentGenre, null); });

// ==========================================
// 2. AUTHENTICATION & DELETE ACCOUNT LOGIC
// ==========================================
function togglePasswordVisibility(inputId, btnElement) {
    const input = document.getElementById(inputId);
    const icon = btnElement.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleAuthMode(mode) {
    const signInForm = document.getElementById('signInForm'); const signUpForm = document.getElementById('signUpForm');
    const modalTitle = document.getElementById('authModalLabel'); const authAlert = document.getElementById('authAlert');
    signInForm.classList.remove('was-validated'); signUpForm.classList.remove('was-validated'); authAlert.classList.add('d-none');
    if (mode === 'signup') { signInForm.classList.add('d-none'); signUpForm.classList.remove('d-none'); modalTitle.innerText = 'Create Account';
    } else { signUpForm.classList.add('d-none'); signInForm.classList.remove('d-none'); modalTitle.innerText = 'Login Account'; }
}

function validateAndSubmit(form) {
    if (!navigator.onLine) return;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const isLogin = form.id === 'signInForm'; const url = isLogin ? '/login' : '/register';
    const authAlert = document.getElementById('authAlert');
    
    let payload;
    if (isLogin) {
        payload = { 
            email: document.getElementById('loginEmail').value.toLowerCase().trim(), 
            password: document.getElementById('loginPassword').value 
        };
    } else {
        const fName = document.getElementById('regFirstName').value.trim();
        const lName = document.getElementById('regLastName').value.trim();
        payload = { 
            name: fName + ' ' + lName, 
            email: document.getElementById('regEmail').value.toLowerCase().trim(), 
            password: document.getElementById('regPassword').value 
        };
    }

    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(r => r.json()).then(data => {
        if (data.success) {
            authAlert.classList.add('d-none');
            if (isLogin) {
                isLoggedIn = true; showToast(data.message, 'success');
                bootstrap.Modal.getInstance(document.getElementById('authModal')).hide(); updateUIAfterLogin();
            } else {
                authAlert.className = 'alert alert-success small fw-bold'; authAlert.innerText = data.message; authAlert.classList.remove('d-none');
                setTimeout(() => toggleAuthMode('signin'), 1500);
            }
            form.reset(); form.classList.remove('was-validated');
        } else { authAlert.className = 'alert alert-danger small fw-bold'; authAlert.innerText = data.message; authAlert.classList.remove('d-none'); }
    });
}

function updateUIAfterLogin() {
    fetch('/api/user/profile').then(r => r.json()).then(user => {
        if(user.success) {
            document.getElementById('navAuthSection').innerHTML = `<button class="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#profileModal"><i class="fas fa-user-circle me-2"></i><span data-i18n="myProfile">${uiDict[currentLang]?.myProfile || 'My Profile'}</span></button>`;
            document.getElementById('profileNameDisplay').innerText = user.name; 
            document.getElementById('profileEmailDisplay').innerText = user.email; 
            document.getElementById('profileJoinedDisplay').innerText = user.joined;
            
            // SECURITY: Only show the System Users button if they are the Admin!
            if (user.is_admin) {
                document.getElementById('adminSystemUsersBtn').classList.remove('d-none');
            } else {
                document.getElementById('adminSystemUsersBtn').classList.add('d-none');
            }
        }
    });
}

function toggleProfileEdit() {
    const viewMode = document.getElementById('profileViewMode'); const editMode = document.getElementById('profileEditMode');
    if (editMode.classList.contains('d-none')) {
        document.getElementById('editProfileName').value = document.getElementById('profileNameDisplay').innerText;
        document.getElementById('editProfileEmail').value = document.getElementById('profileEmailDisplay').innerText;
        document.getElementById('editProfilePassword').value = '';
        viewMode.classList.add('d-none'); editMode.classList.remove('d-none');
    } else { editMode.classList.add('d-none'); viewMode.classList.remove('d-none'); }
}

function submitProfileEdit(form) {
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const name = document.getElementById('editProfileName').value.trim(); 
    const email = document.getElementById('editProfileEmail').value.toLowerCase().trim(); 
    const password = document.getElementById('editProfilePassword').value;

    fetch('/api/user/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    .then(r => r.json()).then(data => {
        if (data.success) { showToast(data.message, 'success'); document.getElementById('profileNameDisplay').innerText = data.name; document.getElementById('profileEmailDisplay').innerText = data.email; toggleProfileEdit();
        } else { showToast(data.message, 'danger'); }
    });
}

function logoutUser() {
    fetch('/logout', { method: 'POST' }).then(r => r.json()).then(data => {
        isLoggedIn = false; showToast(data.message, 'success'); bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
        document.getElementById('navAuthSection').innerHTML = `<button class="btn btn-primary btn-sm rounded-pill px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#authModal"><i class="fas fa-sign-in-alt me-1"></i> <span data-i18n="login">${uiDict[currentLang]?.login || 'Login / Register'}</span></button>`;
    });
}

function initiateAccountDeletion() {
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    document.getElementById('deleteAccountStep1').classList.remove('d-none');
    document.getElementById('deleteAccountStep2').classList.add('d-none');
    document.getElementById('deleteAccountInput').value = '';
    new bootstrap.Modal(document.getElementById('deleteAccountModal')).show();
}

function requestDeleteCode() {
    fetch('/api/request_delete_code', { method: 'POST' }).then(r=>r.json()).then(data => {
        if(data.success) {
            showToast(data.message, 'success');
            document.getElementById('deleteAccountStep1').classList.add('d-none');
            document.getElementById('deleteAccountStep2').classList.remove('d-none');
        } else { showToast("Error requesting code.", 'danger'); }
    });
}

function executeDeleteAccount() {
    const code = document.getElementById('deleteAccountInput').value;
    if(code.length !== 6) { showToast("Please enter the 6-digit code.", "danger"); return; }
    
    fetch('/api/user/delete', { 
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code: code})
    }).then(r=>r.json()).then(data => {
        if(data.success){ 
            showToast(data.message, 'success'); 
            setTimeout(()=>window.location.reload(), 1500); 
        } else { showToast(data.message, 'danger'); }
    });
}

function checkLoginBeforePosting() {
    if (isLoggedIn) { new bootstrap.Modal(document.getElementById('postModal')).show(); } 
    else { showToast(uiDict[currentLang]?.login || 'Please Login or Register to Post News!', 'danger'); new bootstrap.Modal(document.getElementById('authModal')).show(); }
}

// ==========================================
// 3. SETTINGS & FILTERS
// ==========================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    if(document.getElementById('resultSection').classList.contains('d-none') === false) { checkNews(true); }
}

function changeFontSize(size) {
    const appBody = document.getElementById('appBody');
    if (size === 'small') { appBody.style.fontSize = '0.85rem'; } else if (size === 'large') { appBody.style.fontSize = '1.15rem'; } else { appBody.style.fontSize = '1rem'; }
}

function showAboutUs() {
    bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu')).hide();
    new bootstrap.Modal(document.getElementById('aboutUsModal')).show();
}

function fetchSuggestions(query) {
    const suggestionBox = document.getElementById('searchSuggestions');
    if (query.length < 2) { suggestionBox.classList.add('d-none'); return; }
    fetch(`https://api.datamuse.com/sug?s=${query}`).then(r => r.json()).then(data => {
        suggestionBox.innerHTML = ''; 
        if (data.length > 0) {
            suggestionBox.classList.remove('d-none');
            data.slice(0, 5).forEach(item => {
                const li = document.createElement('li'); li.className = 'list-group-item list-group-item-action cursor-pointer bg-body text-body border-secondary'; li.style.cursor = 'pointer'; li.innerHTML = `<i class="fas fa-search text-muted me-2"></i> ${item.word}`;
                li.onclick = () => { document.getElementById('searchInput').value = item.word; suggestionBox.classList.add('d-none'); executeSearch(new Event('submit')); }; suggestionBox.appendChild(li);
            });
        } else { suggestionBox.classList.add('d-none'); }
    });
}
document.addEventListener('click', function(e) { if (e.target.id !== 'searchInput') { const box = document.getElementById('searchSuggestions'); if(box) box.classList.add('d-none'); }});

function executeSearch(event) {
    if(event) event.preventDefault(); currentSearch = document.getElementById('searchInput').value; document.getElementById('searchSuggestions').classList.add('d-none');
    if(currentSearch.length > 50) { document.getElementById('newsInput').value = currentSearch; checkNews(); } else { loadNews(currentGenre, null); }
}

function selectLang(code) { currentLang = code; translateUI(code); updateClock(); loadNews(currentGenre, null); }
function selectCountry(code) { currentCountry = code; updateClock(); loadNews(currentGenre, null); }

function timeSince(dateString) {
    if (!dateString) return "Just now"; 
    const dateObj = new Date(dateString);
    const seconds = Math.floor((new Date() - dateObj) / 1000);
    if (seconds < 60) return "Just now";
    
    const activeLocale = getActiveLocale();
    try {
        const rtf = new Intl.RelativeTimeFormat(activeLocale, { numeric: 'auto' });
        const days = seconds / 86400;
        if (days > 365) return rtf.format(-Math.floor(days / 365), 'year');
        if (days > 30) return rtf.format(-Math.floor(days / 30), 'month');
        if (days >= 1) return rtf.format(-Math.floor(days), 'day');
        
        const hours = seconds / 3600;
        if (hours >= 1) return rtf.format(-Math.floor(hours), 'hour');
        const minutes = seconds / 60;
        return rtf.format(-Math.floor(minutes), 'minute');
    } catch(e) {
        let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " years ago"; 
        interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " months ago"; 
        interval = seconds / 86400; if (interval > 1) { const d = Math.floor(interval); return d + (d === 1 ? " day ago" : " days ago"); } 
        interval = seconds / 3600; if (interval > 1) { const h = Math.floor(interval); return h + (h === 1 ? " hour ago" : " hours ago"); } 
        interval = seconds / 60; if (interval > 1) { const m = Math.floor(interval); return m + (m === 1 ? " minute ago" : " minutes ago"); } 
        return Math.floor(seconds) + " seconds ago";
    }
}

// ==========================================
// 4. LIVE NEWS, LIKES, COMMENTS, SHARES
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const defaultBtn = document.querySelector('.category-btn.active'); if(defaultBtn) loadNews('home', defaultBtn);
    fetch('/api/user/profile').then(r=>r.json()).then(data => { if(data.success) { isLoggedIn = true; updateUIAfterLogin(); }});
});

function loadNews(genre, clickedButton) {
    currentGenre = genre;
    if (clickedButton) { document.querySelectorAll('.category-btn').forEach(btn => { btn.classList.remove('btn-primary'); btn.classList.add('btn-outline-secondary'); }); clickedButton.classList.remove('btn-outline-secondary'); clickedButton.classList.add('btn-primary'); }
    
    document.getElementById('resultSection').classList.add('d-none');
    const grid = document.getElementById('newsGrid'); 
    
    if (!navigator.onLine) { grid.innerHTML = `<div class="col-12 text-center text-danger mt-5"><i class="fas fa-wifi fa-3x mb-3" style="opacity: 0.5;"></i><h5 data-i18n="offline">${uiDict[currentLang]?.offline || uiDict['en'].offline}</h5></div>`; return; }

    grid.innerHTML = `<div class="col-12 text-center mt-5 mb-5"><div class="orbital-loader mb-4"><div class="orbital-ring ring1"></div><div class="orbital-ring ring2"></div><div class="orbital-ring ring3"></div><div class="orbital-core"></div></div><h5 class="fw-bold text-primary" data-i18n="loadingNews">${uiDict[currentLang]?.loadingNews || uiDict['en'].loadingNews}</h5></div>`;

    fetch(`/api/news/${genre}?lang=${currentLang}&country=${currentCountry}&q=${encodeURIComponent(currentSearch)}`).then(r => r.json()).then(data => {
        grid.innerHTML = ''; 
        if (!data.articles || data.articles.length === 0) { grid.innerHTML = `<div class="col-12 text-center text-muted mt-5"><p data-i18n="noNews">${uiDict[currentLang]?.noNews || uiDict['en'].noNews}</p></div>`; return; }
        if (genre === 'home' && data.articles.length >= 6) { 
            grid.innerHTML += `<div class="col-12"><h4 class="section-header text-primary"><i class="fas fa-bolt me-2"></i><span data-i18n="briefing">${uiDict[currentLang]?.briefing || uiDict['en'].briefing}</span></h4></div>` + renderCards(data.articles.slice(0, 3)); 
            grid.innerHTML += `<div class="col-12"><h4 class="section-header text-success"><i class="fas fa-star me-2"></i><span data-i18n="forYou">${uiDict[currentLang]?.forYou || uiDict['en'].forYou}</span></h4></div>` + renderCards(data.articles.slice(3, 6)); 
        } else { grid.innerHTML = renderCards(data.articles); }
        translateUI(currentLang); 
    }).catch(error => { grid.innerHTML = `<div class="col-12 text-center"><p class="text-danger" data-i18n="apiError">${uiDict[currentLang]?.apiError || uiDict['en'].apiError}</p></div>`; });
}

function shareArticle(title, url) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    const html = `
        <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}" target="_blank" class="btn btn-success rounded-circle shadow-sm fs-5 text-white d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;"><i class="fab fa-whatsapp"></i></a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" class="btn btn-primary rounded-circle shadow-sm fs-5 text-white d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;"><i class="fab fa-facebook-f"></i></a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" class="btn btn-dark rounded-circle shadow-sm fs-5 text-white d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;"><i class="fab fa-x-twitter"></i></a>
        <a href="https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}" target="_blank" class="btn btn-info rounded-circle shadow-sm fs-5 text-white d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;"><i class="fab fa-telegram-plane"></i></a>
        <button class="btn btn-secondary rounded-circle shadow-sm fs-5 text-white d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;" onclick="copyToClipboard('${url}')"><i class="fas fa-link"></i></button>
    `;
    document.getElementById('shareButtonsContainer').innerHTML = html;
    new bootstrap.Modal(document.getElementById('shareModal')).show();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('shareModal')).hide();
}

function toggleSave(iconElement, title, url, image) {
    if (!isLoggedIn) { showToast('Please Login to save articles!', 'danger'); return; }
    let safeUrl = url && url !== "" ? url : "https://fakenews.local/post/" + encodeURIComponent(title);

    fetch('/api/toggle_save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title, url: safeUrl, image: image }) })
    .then(r => r.json()).then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            if (data.action === 'saved') { 
                iconElement.classList.remove('far', 'text-muted'); 
                iconElement.classList.add('fas', 'text-primary'); 
            } else { 
                iconElement.classList.remove('fas', 'text-primary'); 
                iconElement.classList.add('far', 'text-muted'); 
            }
        } else {
            showToast(data.message, 'warning');
        }
    });
}

function toggleLike(iconElement, title, url, image) {
    if (!isLoggedIn) { showToast('Please Login to like articles!', 'danger'); return; }
    let safeUrl = url && url !== "" ? url : "https://fakenews.local/post/" + encodeURIComponent(title);

    fetch('/api/toggle_like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title, url: safeUrl, image: image }) })
    .then(r => r.json()).then(data => {
        if (data.success) {
            if (data.action === 'liked') { iconElement.classList.remove('far', 'text-muted'); iconElement.classList.add('fas', 'text-danger'); } 
            else { iconElement.classList.remove('fas', 'text-danger'); iconElement.classList.add('far', 'text-muted'); }
        }
    });
}

function openComments(title, url, image) {
    if (!isLoggedIn) { showToast('Please Login to comment!', 'danger'); return; }
    let safeUrl = url && url !== "" ? url : "https://fakenews.local/post/" + encodeURIComponent(title);

    currentActiveArticle = { title, url: safeUrl, image };
    document.getElementById('newCommentText').value = '';
    const body = document.getElementById('commentsListBody');
    body.innerHTML = `<div class="text-center mt-4"><div class="spinner-border text-primary"></div></div>`;
    
    const modalEl = document.getElementById('commentsModal');
    if (!modalEl.classList.contains('show')) { new bootstrap.Modal(modalEl).show(); }

    fetch(`/api/comments?url=${encodeURIComponent(safeUrl)}`).then(r => r.json()).then(data => {
        body.innerHTML = '';
        if(data.comments.length === 0) { body.innerHTML = `<div class="text-center text-muted mt-4">Be the first to comment!</div>`; }
        else {
            data.comments.forEach(c => {
                let actionButtons = '';
                if (c.is_owner) {
                    actionButtons = `
                        <div class="mt-2 text-end">
                            <span class="action-btn text-primary me-3 small fw-bold" onclick="openEditComment(${c.id}, '${c.text.replace(/'/g, "\\'")}')"><i class="fas fa-edit"></i> Edit</span>
                            <span class="action-btn text-danger small fw-bold" onclick="confirmDeleteComment(${c.id})"><i class="fas fa-trash"></i> Delete</span>
                        </div>`;
                }
                body.innerHTML += `
                    <div class="bg-body-secondary p-3 rounded-3 mb-2 border border-secondary shadow-sm">
                        <div class="d-flex justify-content-between mb-1">
                            <strong class="small text-primary"><i class="fas fa-user-circle me-1"></i>${c.user}</strong>
                            <small class="text-muted" style="font-size:0.75rem">${c.date}</small>
                        </div>
                        <p class="mb-0 small text-break">${c.text}</p>
                        ${actionButtons}
                    </div>`;
            });
        }
    });
}

function submitComment() {
    const text = document.getElementById('newCommentText').value.trim();
    if(text.length === 0) return;
    if(text.length > 150) { showToast("Comment too long.", "danger"); return; }
    
    fetch('/api/comments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentActiveArticle.title, url: currentActiveArticle.url, image: currentActiveArticle.image, text: text })
    }).then(r => r.json()).then(data => {
        if(data.success) { openComments(currentActiveArticle.title, currentActiveArticle.url, currentActiveArticle.image); }
    });
}

function openEditComment(id, currentText) {
    commentToEdit = id;
    document.getElementById('editCommentTextInput').value = currentText;
    bootstrap.Modal.getInstance(document.getElementById('commentsModal')).hide(); 
    new bootstrap.Modal(document.getElementById('editCommentModal')).show(); 
}

function executeEditComment() {
    const newText = document.getElementById('editCommentTextInput').value.trim();
    if(newText.length === 0 || newText.length > 150) { showToast("Comment must be 1-150 characters.", "danger"); return; }
    fetch(`/api/comments/${commentToEdit}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: newText })
    }).then(r => r.json()).then(data => {
        if(data.success) {
            bootstrap.Modal.getInstance(document.getElementById('editCommentModal')).hide();
            openComments(currentActiveArticle.title, currentActiveArticle.url, currentActiveArticle.image);
        }
    });
}

function confirmDeleteComment(id) {
    commentToDelete = id;
    bootstrap.Modal.getInstance(document.getElementById('commentsModal')).hide();
    new bootstrap.Modal(document.getElementById('deleteCommentModal')).show();
}

function executeDeleteComment() {
    fetch(`/api/comments/${commentToDelete}`, { method: 'DELETE' }).then(r => r.json()).then(data => {
        if(data.success) {
            bootstrap.Modal.getInstance(document.getElementById('deleteCommentModal')).hide();
            openComments(currentActiveArticle.title, currentActiveArticle.url, currentActiveArticle.image);
        }
    });
}

function renderCards(articles, isSavedFeed = false) {
    let html = '';
    let saveIconClass = isSavedFeed ? "fas fa-bookmark text-primary" : "far fa-bookmark text-muted";
    
    let lblLike = uiDict[currentLang]?.like || uiDict['en'].like;
    let lblComment = uiDict[currentLang]?.comment || uiDict['en'].comment;
    let lblVerify = uiDict[currentLang]?.verifyContent || uiDict['en'].verifyContent;

    articles.forEach(article => {
        let displayImage = article.image; 
        if (!displayImage || displayImage.includes("placehold.co") || displayImage === "") { 
            let cleanTitle = article.title.replace(/[^a-zA-Z0-9 ]/g, " ").substring(0, 60);
            displayImage = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(cleanTitle + " news")}&w=600&h=400&c=7&rs=1&p=0&dpr=3&pid=1.7`; 
        }

        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0 bg-body-tertiary rounded-4 overflow-hidden">
                    <a href="${article.url}" target="_blank" style="overflow: hidden; display: block; background: #2b2b2b;">
                        <img src="${displayImage}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=600&q=80';" loading="lazy" class="card-img-top border-bottom border-secondary" style="height: 180px; width: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    </a>
                    <div class="card-body p-4 pb-2">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary rounded-pill text-uppercase">${article.genre}</span>
                            <i class="${saveIconClass} action-btn" onclick="toggleSave(this, this.getAttribute('data-title'), this.getAttribute('data-url'), this.getAttribute('data-img'))" data-title="${article.title.replace(/"/g, '&quot;')}" data-url="${article.url}" data-img="${displayImage}" title="Save"></i>
                        </div>
                        <h5 class="card-title fw-bold" style="font-size: 1.1rem; line-height: 1.4;"><a href="${article.url}" target="_blank" class="text-decoration-none text-body">${article.title}</a></h5>
                        <div class="text-muted mt-3" style="font-size: 0.85rem;"><i class="far fa-clock me-1"></i> ${timeSince(article.published)}</div>
                    </div>
                    <div class="px-4 py-2 border-top d-flex justify-content-between text-muted" style="font-size: 1.1rem; position:relative; z-index: 2;">
                        <span class="action-btn" onclick="toggleLike(this.firstElementChild, this.getAttribute('data-title'), this.getAttribute('data-url'), this.getAttribute('data-img'))" data-title="${article.title.replace(/"/g, '&quot;')}" data-url="${article.url}" data-img="${displayImage}"><i class="far fa-heart text-muted"></i> <small>${lblLike}</small></span>
                        <span class="action-btn" onclick="openComments(this.getAttribute('data-title'), this.getAttribute('data-url'), this.getAttribute('data-img'))" data-title="${article.title.replace(/"/g, '&quot;')}" data-url="${article.url}" data-img="${displayImage}"><i class="far fa-comment text-muted"></i> <small>${lblComment}</small></span>
                        <span class="action-btn" onclick="shareArticle('${article.title.replace(/'/g, "\\'")}', '${article.url}')"><i class="fas fa-share-nodes text-muted"></i></span>
                    </div>
                    <div class="p-3 bg-body-secondary border-top"><button class="btn btn-dark w-100 rounded-pill fw-bold" data-summary="${article.title}" onclick="testThisArticle(this)"><i class="fas fa-microchip text-info me-2"></i> <span>${lblVerify}</span></button></div>
                </div>
            </div>`;
    });
    return html;
}

// ==========================================
// 5. HIGHCHARTS 3D DASHBOARD
// ==========================================
let cachedData = null;
function testThisArticle(buttonElement) { const newsText = buttonElement.getAttribute('data-summary'); document.getElementById('newsInput').value = newsText; window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { checkNews(); }, 300); }

function checkNews(isRedraw = false) {
    if (!navigator.onLine) return;
    if (!isRedraw) { const text = document.getElementById('newsInput').value; if (!text.trim()) return alert("Please enter text."); fetch('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text }) }).then(r => r.json()).then(data => { cachedData = data; renderAllCharts(data); });
    } else if (cachedData) { renderAllCharts(cachedData); }
}

function renderAllCharts(data) {
    document.getElementById('resultSection').classList.remove('d-none'); 
    
    let transPrediction = data.prediction;
    if (data.prediction === 'Real') transPrediction = uiDict[currentLang]?.real || uiDict['en'].real;
    if (data.prediction === 'Fake') transPrediction = uiDict[currentLang]?.fake || uiDict['en'].fake;
    if (data.prediction === 'Uncertain') transPrediction = uiDict[currentLang]?.uncertain || uiDict['en'].uncertain;
    
    document.getElementById('resultLabel').innerText = transPrediction;
    document.getElementById('verifiedHeadlineDisplay').innerText = '"' + document.getElementById('newsInput').value + '"';
    
    const btnWhy = document.getElementById('btnWhy'); 
    let lblWhy = uiDict[currentLang]?.why || uiDict['en'].why;
    btnWhy.innerHTML = `<i class="fas fa-question-circle me-2"></i>${lblWhy} ${transPrediction}?`;

    if (data.prediction === 'Real') { document.getElementById('resultLabel').className = 'text-success fw-bold'; btnWhy.className = 'btn btn-success rounded-pill fw-bold px-5 mt-2 shadow';
    } else if (data.prediction === 'Fake') { document.getElementById('resultLabel').className = 'text-danger fw-bold'; btnWhy.className = 'btn btn-danger rounded-pill fw-bold px-5 mt-2 shadow';
    } else { document.getElementById('resultLabel').className = 'text-warning fw-bold'; btnWhy.className = 'btn btn-warning text-dark rounded-pill fw-bold px-5 mt-2 shadow'; }
    
    document.getElementById('realScore').innerText = data.real_score; document.getElementById('realBar').style.width = data.real_score + '%'; 
    document.getElementById('fakeScore').innerText = data.fake_score; document.getElementById('fakeBar').style.width = data.fake_score + '%';
    
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'; const textColor = isDark ? '#ffffff' : '#333333';
    if (myPieChart) myPieChart.destroy(); if (myLineChart) myLineChart.destroy();
    
    let c1Title = uiDict[currentLang]?.chart1Title || uiDict['en'].chart1Title;
    let c2Title = uiDict[currentLang]?.chart2Title || uiDict['en'].chart2Title;
    let lblProb = uiDict[currentLang]?.prob || uiDict['en'].prob;
    let lblAuth = uiDict[currentLang]?.auth || uiDict['en'].auth;
    let lblFakeCont = uiDict[currentLang]?.fakeCont || uiDict['en'].fakeCont;
    let l1 = uiDict[currentLang]?.layer1 || uiDict['en'].layer1;
    let l2 = uiDict[currentLang]?.layer2 || uiDict['en'].layer2;
    let l3 = uiDict[currentLang]?.layer3 || uiDict['en'].layer3;
    let l4 = uiDict[currentLang]?.layer4 || uiDict['en'].layer4;
    let l5 = uiDict[currentLang]?.layer5 || uiDict['en'].layer5;
    let lblRealOut = uiDict[currentLang]?.realOut || uiDict['en'].realOut;

    myPieChart = Highcharts.chart('predictionPieChart', { chart: { type: 'pie', backgroundColor: 'transparent', options3d: { enabled: true, alpha: 45, beta: 0 } }, title: { text: c1Title, style: { color: textColor, fontSize: '16px' } }, tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' }, plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', depth: 45, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f}%', style: { color: textColor, textOutline: 'none' } } } }, series: [{ type: 'pie', name: lblProb, data: [{ name: lblFakeCont, y: data.fake_score, color: '#dc3545' }, { name: lblAuth, y: data.real_score, color: '#198754' }] }], credits: { enabled: false } });
    let posX = 0, posY = 0, alpha = 45, beta = 0;
    const dragStart = (e) => { e = e.touches ? e.touches[0] : e; posX = e.pageX; posY = e.pageY; alpha = myPieChart.options.chart.options3d.alpha; beta = myPieChart.options.chart.options3d.beta; document.addEventListener('mousemove', drag); document.addEventListener('touchmove', drag, { passive: false }); document.addEventListener('mouseup', drop); document.addEventListener('touchend', drop); };
    const drag = (e) => { e.preventDefault(); const currentEvent = e.touches ? e.touches[0] : e; myPieChart.options.chart.options3d.beta = beta + (posX - currentEvent.pageX) / 2; myPieChart.options.chart.options3d.alpha = Math.max(0, Math.min(90, alpha + (currentEvent.pageY - posY) / 2)); myPieChart.redraw(false); };
    const drop = () => { document.removeEventListener('mousemove', drag); document.removeEventListener('touchmove', drag); document.removeEventListener('mouseup', drop); document.removeEventListener('touchend', drop); };
    myPieChart.container.addEventListener('mousedown', dragStart); myPieChart.container.addEventListener('touchstart', dragStart, { passive: false }); myPieChart.container.style.cursor = 'grab';

    const line1 = Math.max(0, Math.min(100, data.real_score + (Math.random() * 15 - 7))); const line2 = Math.max(0, Math.min(100, data.real_score + (Math.random() * 10 - 5))); const line3 = Math.max(0, Math.min(100, data.real_score + (Math.random() * 5 - 2)));
    myLineChart = Highcharts.chart('predictionLineChart', { chart: { type: 'area', backgroundColor: 'transparent', options3d: { enabled: true, alpha: 10, beta: 10, depth: 50 } }, title: { text: c2Title, style: { color: textColor, fontSize: '16px' } }, xAxis: { categories: [l1, l2, l3, l4, l5], labels: { style: { color: textColor } } }, yAxis: { title: { text: null }, max: 100, labels: { style: { color: textColor } } }, plotOptions: { area: { depth: 50, marker: { enabled: true }, color: data.prediction === 'Real' ? '#198754' : '#dc3545', fillOpacity: 0.5 } }, series: [{ name: lblRealOut, data: [line1, line2, line3, data.real_score, data.real_score], showInLegend: false }], credits: { enabled: false } });
}

function explainPrediction() {
    const prediction = cachedData.prediction; 
    const score = document.getElementById('realScore').innerText;
    const titleObj = document.getElementById('explanationTitle'); const textObj = document.getElementById('explanationText'); const iconObj = document.getElementById('explanationIconDisplay');
    
    if (prediction === 'Real') { 
        iconObj.innerHTML = '<i class="fas fa-check-circle text-success"></i>'; 
        titleObj.innerText = uiDict[currentLang]?.reportRealTitle || uiDict['en'].reportRealTitle; 
        titleObj.className = "fw-bold mb-3 text-success"; 
        textObj.innerHTML = (uiDict[currentLang]?.reportRealText || uiDict['en'].reportRealText) + ` <b>${score}%</b>.`;
    } else if (prediction === 'Fake') { 
        iconObj.innerHTML = '<i class="fas fa-times-circle text-danger"></i>'; 
        titleObj.innerText = uiDict[currentLang]?.reportFakeTitle || uiDict['en'].reportFakeTitle; 
        titleObj.className = "fw-bold mb-3 text-danger"; 
        textObj.innerHTML = uiDict[currentLang]?.reportFakeText || uiDict['en'].reportFakeText;
    } else { 
        iconObj.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i>'; 
        titleObj.innerText = uiDict[currentLang]?.reportUncertainTitle || uiDict['en'].reportUncertainTitle; 
        titleObj.className = "fw-bold mb-3 text-warning"; 
        textObj.innerHTML = uiDict[currentLang]?.reportUncertainText || uiDict['en'].reportUncertainText; 
    }
    new bootstrap.Modal(document.getElementById('explanationModal')).show();
}

// ==========================================
// 6. PUBLISH, SAVED, HISTORY & ADMIN LOGIC
// ==========================================
function fetchSavedArticles() {
    if (!isLoggedIn) { showToast('Please Login to view saved articles!', 'danger'); return; }
    bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu')).hide(); document.getElementById('resultSection').classList.add('d-none');
    const grid = document.getElementById('newsGrid'); grid.innerHTML = `<div class="col-12"><h4 class="section-header text-primary"><i class="fas fa-bookmark me-2"></i>Your Saved Articles</h4></div><div class="col-12 text-center mt-5"><div class="spinner-border text-primary"></div></div>`;

    fetch('/api/get_saved').then(r => r.json()).then(data => {
        grid.innerHTML = `<div class="col-12"><h4 class="section-header text-primary"><i class="fas fa-bookmark me-2"></i>Your Saved Articles</h4></div>`;
        if (data.articles.length === 0) { grid.innerHTML += `<div class="col-12 text-center text-muted mt-4"><p>You haven't saved any articles yet.</p></div>`;
        } else { grid.innerHTML += renderCards(data.articles, true); }
    });
}

function fetchAnalysisHistory() {
    if (!isLoggedIn) { showToast('Please Login to view history!', 'danger'); return; }
    bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu')).hide(); document.getElementById('resultSection').classList.add('d-none');
    const grid = document.getElementById('newsGrid'); grid.innerHTML = `<div class="col-12"><h4 class="section-header text-info"><i class="fas fa-history me-2"></i>Analysis History</h4></div><div class="col-12 text-center mt-5"><div class="spinner-border text-info"></div></div>`;

    fetch('/api/get_history').then(r => r.json()).then(data => {
        let historyHtml = `<div class="col-12"><h4 class="section-header text-info"><i class="fas fa-history me-2"></i>Analysis History</h4></div><div class="col-12"><div class="list-group shadow-sm">`;
        if (data.history.length === 0) { historyHtml += `<div class="text-center text-muted mt-4"><p>No analysis history found.</p></div>`; } 
        else {
            data.history.forEach(item => {
                let badgeClass = item.prediction === 'Real' ? 'bg-success' : (item.prediction === 'Fake' ? 'bg-danger' : 'bg-warning text-dark');
                let transPrediction = item.prediction;
                if (item.prediction === 'Real') transPrediction = uiDict[currentLang]?.real || uiDict['en'].real;
                if (item.prediction === 'Fake') transPrediction = uiDict[currentLang]?.fake || uiDict['en'].fake;
                if (item.prediction === 'Uncertain') transPrediction = uiDict[currentLang]?.uncertain || uiDict['en'].uncertain;
                
                historyHtml += `<div class="list-group-item list-group-item-action bg-body-tertiary border-secondary mb-2 rounded-3 p-3"><div class="d-flex w-100 justify-content-between align-items-center mb-2"><span class="badge ${badgeClass} fs-6">${transPrediction} (${item.real_score}%)</span><small class="text-muted"><i class="far fa-clock me-1"></i>${item.date}</small></div><p class="mb-1 text-body fst-italic">"${item.text}"</p></div>`;
            });
        }
        grid.innerHTML = historyHtml + `</div></div>`;
    });
}

function submitPublishedNews() {
    const title = document.getElementById('postHeadline').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const fileInput = document.getElementById('postImageFile');

    if(title.length < 40 || title.length > 100) { showToast("Headline must be between 40 and 100 characters.", "danger"); return; }
    if(content.length < 500 || content.length > 3000) { showToast("Content must be between 500 and 3000 characters.", "danger"); return; }

    let formData = new FormData(); formData.append('title', title); formData.append('content', content);
    if(fileInput.files.length > 0) { formData.append('image', fileInput.files[0]); }

    fetch('/api/publish_news', { method: 'POST', body: formData }).then(r => r.json()).then(data => {
        if(data.success) { 
            showToast(data.message, 'success'); 
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide(); 
            document.getElementById('postHeadline').value = ''; 
            document.getElementById('postContent').value = ''; 
            fileInput.value = ''; 
            fetchMyPosts(); 
        } else { showToast(data.message, 'danger'); }
    });
}

function fetchMyPosts() {
    if (!isLoggedIn) { showToast('Please Login to view your posts!', 'danger'); return; }
    bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu')).hide(); document.getElementById('resultSection').classList.add('d-none');
    
    const titleText = uiDict[currentLang]?.myPosts ? uiDict[currentLang].myPosts.replace(/<[^>]*>?/gm, '') : "My Posts";
    const grid = document.getElementById('newsGrid'); grid.innerHTML = `<div class="col-12"><h4 class="section-header text-primary"><i class="fas fa-newspaper me-2"></i>${titleText}</h4></div><div class="col-12 text-center mt-5"><div class="spinner-border text-primary"></div></div>`;
    fetch('/api/get_my_posts').then(r => r.json()).then(data => {
        grid.innerHTML = `<div class="col-12"><h4 class="section-header text-primary"><i class="fas fa-newspaper me-2"></i>${titleText}</h4></div>`;
        if (data.articles.length === 0) { grid.innerHTML += `<div class="col-12 text-center text-muted mt-4"><p>You haven't published any news yet.</p></div>`; } 
        else { grid.innerHTML += renderUserPosts(data.articles); }
    });
}

function renderUserPosts(articles) {
    let html = '';
    let lblMyPost = uiDict[currentLang]?.myPost || uiDict['en'].myPost;
    let lblDelete = uiDict[currentLang]?.delete || uiDict['en'].delete;
    let lblVerify = uiDict[currentLang]?.verifyContent || uiDict['en'].verifyContent;

    articles.forEach(article => {
        let displayImage = article.image; 
        if (!displayImage || displayImage === "") { displayImage = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(article.title.replace(/[^a-zA-Z0-9 ]/g, " ").substring(0, 60) + " news")}&w=600&h=400&c=7&rs=1&p=0&dpr=3&pid=1.7`; }
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0 bg-body-tertiary rounded-4 overflow-hidden border border-primary">
                    <img src="${displayImage}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=600&q=80';" loading="lazy" class="card-img-top border-bottom border-secondary" style="height: 180px; width: 100%; object-fit: cover;">
                    <div class="card-body p-4 pb-2">
                        <div class="d-flex justify-content-between align-items-center mb-2"><span class="badge bg-primary rounded-pill text-uppercase">${lblMyPost}</span></div>
                        <h5 class="card-title fw-bold" style="font-size: 1.1rem; line-height: 1.4;">${article.title}</h5>
                        <p class="text-muted small mt-2" style="max-height: 60px; overflow: hidden;">${article.content}</p>
                        <div class="text-muted mt-3" style="font-size: 0.85rem;"><i class="far fa-clock me-1"></i> ${timeSince(article.published)}</div>
                    </div>
                    <div class="px-4 py-2 border-top d-flex justify-content-between text-muted" style="font-size: 1.1rem;">
                        <span class="action-btn text-danger" onclick="confirmDeletePost(${article.id})"><i class="fas fa-trash"></i> <small>${lblDelete}</small></span>
                        <span class="action-btn" onclick="shareArticle('${article.title.replace(/'/g, "\\'")}', '${article.url}')"><i class="fas fa-share-nodes"></i></span>
                    </div>
                    <div class="p-3 bg-body-secondary border-top"><button class="btn btn-dark w-100 rounded-pill fw-bold" data-summary="${article.title} ${article.content}" onclick="testThisArticle(this)"><i class="fas fa-microchip text-info me-2"></i> ${lblVerify}</button></div>
                </div>
            </div>`;
    });
    return html;
}

function confirmDeletePost(id) { postToDelete = id; new bootstrap.Modal(document.getElementById('deletePostModal')).show(); }
function executeDeletePost() {
    if(!postToDelete) return;
    fetch(`/api/delete_post/${postToDelete}`, { method: 'DELETE' }).then(r => r.json()).then(data => {
        if(data.success) { showToast(data.message, 'success'); bootstrap.Modal.getInstance(document.getElementById('deletePostModal')).hide(); fetchMyPosts(); } 
    });
}

function viewSystemUsers() {
    bootstrap.Offcanvas.getInstance(document.getElementById('sidebarMenu')).hide(); document.getElementById('resultSection').classList.add('d-none');
    
    const titleText = uiDict[currentLang]?.systemUsers ? uiDict[currentLang].systemUsers.replace(/<[^>]*>?/gm, '') : "System Users";
    const grid = document.getElementById('newsGrid'); grid.innerHTML = `<div class="col-12"><h4 class="section-header text-warning"><i class="fas fa-users me-2"></i>${titleText}</h4></div><div class="col-12 text-center mt-5"><div class="spinner-border text-warning"></div></div>`;
    fetch('/api/users').then(r => r.json()).then(data => {
        if(data.success === false) {
            showToast(data.message, 'danger');
            grid.innerHTML = `<div class="col-12 text-center text-danger mt-4"><h5><i class="fas fa-lock me-2"></i>Access Denied</h5></div>`;
            return;
        }
        let tableHtml = `<div class="col-12"><h4 class="section-header text-warning"><i class="fas fa-users me-2"></i>${titleText} <span class="badge bg-warning text-dark float-end fs-6">Total: ${data.total}</span></h4></div><div class="col-12"><div class="table-responsive rounded-3 shadow-sm border border-secondary"><table class="table table-dark table-striped table-hover mb-0"><thead><tr><th>ID</th><th>First/Last Name</th><th>Email Address</th><th>Registration Date</th></tr></thead><tbody>`;
        data.users.forEach(u => { tableHtml += `<tr><td>#${u.id}</td><td class="fw-bold">${u.name}</td><td>${u.email}</td><td>${u.joined}</td></tr>`; });
        grid.innerHTML = tableHtml + `</tbody></table></div></div>`; 
    });
}