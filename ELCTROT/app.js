const services = [
  { title: "மொபைல் சர்வீஸ்", desc: "Display, charging port, battery, mic, speaker, software issue.", tag: "அதிகமாக பதிவு", icon: "smartphone", type: "smart" },
  { title: "லேப்டாப் & PC", desc: "No display, keyboard, SSD upgrade, OS install, heating service.", tag: "Pickup உள்ளது", icon: "laptop", type: "smart" },
  { title: "LED TV பழுது", desc: "Backlight, sound only, panel check, power board diagnostics.", tag: "Doorstep ஆய்வு", icon: "tv", type: "home" },
  { title: "இன்வெர்டர் / UPS", desc: "Battery health, charging fault, backup குறைவு, board service.", tag: "Power care", icon: "battery-charging", type: "power" },
  { title: "மிக்சர் & சிறிய சாதனங்கள்", desc: "Motor, switch, jar coupler, wire replacement, safety check.", tag: "விரைவு சேவை", icon: "plug-zap", type: "home" },
  { title: "Fan & wiring உதவி", desc: "Fan capacitor, regulator, switch board, basic electrical service.", tag: "வீட்டு சேவை", icon: "fan", type: "home" },
  { title: "Audio & speaker", desc: "Amplifier board, no sound, Bluetooth issue, jack replacement.", tag: "Board level", icon: "speaker", type: "smart" },
  { title: "CCTV & network", desc: "Camera setup, DVR check, Wi-Fi range, cable fault diagnosis.", tag: "Setup support", icon: "cctv", type: "power" },
];

const storageKeys = { requests: "tesServiceRequests", member: "tesActiveMember" };
const serviceGrid = document.querySelector("#serviceGrid");
const filters = document.querySelectorAll(".filter");
const bookingForm = document.querySelector("#bookingForm");
const loginForm = document.querySelector("#loginForm");
const summary = document.querySelector("#summaryText");
const requestList = document.querySelector("#requestList");
const requestCount = document.querySelector("#requestCount");
const totalRequests = document.querySelector("#totalRequests");
const accountState = document.querySelector("#accountState");
const lastLogin = document.querySelector("#lastLogin");
const memberStatus = document.querySelector("#memberStatus");
const logoutBtn = document.querySelector("#logoutBtn");

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function renderServices(filter = "all") {
  const visibleServices = filter === "all" ? services : services.filter((service) => service.type === filter);
  serviceGrid.innerHTML = visibleServices.map((service) => `
    <article class="service-card">
      <span class="icon-wrap"><i data-lucide="${service.icon}"></i></span>
      <h3>${service.title}</h3>
      <p>${service.desc}</p>
      <span class="tag">${service.tag}</span>
    </article>
  `).join("");
  createIcons();
}

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ta-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function renderRequests() {
  const requests = readJson(storageKeys.requests, []);
  requestCount.textContent = requests.length;
  totalRequests.textContent = requests.length;
  if (!requests.length) {
    requestList.innerHTML = `<p class="empty-state">இன்னும் சேவை கோரிக்கைகள் இல்லை.</p>`;
    return;
  }
  requestList.innerHTML = requests.slice(0, 5).map((request) => `
    <article class="request-item">
      <div><strong>${request.ticket}</strong><span>${request.name} - ${request.device}</span></div>
      <p>${request.locationType} | ${request.priority} | ${request.preferredTime}</p>
      <small>${request.address}</small>
    </article>
  `).join("");
}

function renderMember() {
  const member = readJson(storageKeys.member, null);
  if (!member) {
    accountState.textContent = "இப்போது யாரும் login செய்யவில்லை.";
    lastLogin.textContent = "-";
    memberStatus.textContent = "Offline";
    memberStatus.classList.remove("online");
    return;
  }
  accountState.textContent = `${member.name} (${member.role}) தற்போது active.`;
  lastLogin.textContent = formatTime(member.loginAt);
  memberStatus.textContent = "Online";
  memberStatus.classList.add("online");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderServices(button.dataset.filter);
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const request = Object.fromEntries(new FormData(bookingForm).entries());
  const ticket = `TES-${Date.now().toString().slice(-6)}`;
  const requests = readJson(storageKeys.requests, []);
  writeJson(storageKeys.requests, [{ ...request, ticket, status: "புதிய பதிவு", createdAt: new Date().toISOString() }, ...requests]);
  summary.innerHTML = `<strong>கோரிக்கை எண்: ${ticket}</strong><br />${request.name}, உங்கள் ${request.device} சாதனத்திற்கான கோரிக்கை பதிவு செய்யப்பட்டது. சேவை இடம்: ${request.locationType}. எங்கள் குழு ${request.phone} எண்ணில் தொடர்புகொள்ளும்.`;
  bookingForm.reset();
  renderRequests();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  writeJson(storageKeys.member, { name: data.get("memberName"), role: data.get("memberRole"), loginAt: new Date().toISOString() });
  loginForm.reset();
  renderMember();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(storageKeys.member);
  renderMember();
});

window.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderRequests();
  renderMember();
  createIcons();
});
