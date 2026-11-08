"use strict";

/* ===== CONFIGURAÇÕES (edite aqui) ===== */
const CONFIG = {
  launchDate: "2027-03-01T00:00:00-03:00",
  whatsapp: "5531999999999",          // seu número com DDI + DDD
  downloadUrl: "#"                    // link do seu emulador
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ===== Toast (conquistas) ===== */
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ===== Menu mobile ===== */
const navLinks = $("#navLinks");
$("#navToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ===== Contagem regressiva ===== */
const pad = n => String(n).padStart(2, "0");
function tick() {
  const diff = new Date(CONFIG.launchDate) - new Date();
  if (diff <= 0) {
    $("#countdown").innerHTML = "<h2>🚀 FORFIX CHEGOU!</h2>";
    return clearInterval(timer);
  }
  $("#cdD").textContent = pad(Math.floor(diff / 864e5));
  $("#cdH").textContent = pad(Math.floor(diff / 36e5) % 24);
  $("#cdM").textContent = pad(Math.floor(diff / 6e4) % 60);
  $("#cdS").textContent = pad(Math.floor(diff / 1e3) % 60);
}
const timer = setInterval(tick, 1000);
tick();

/* ===== Barra de XP e nível ao rolar ===== */
const xpBar = $("#xpBar"), xpLvl = $("#xpLvl");
let lastLevel = 1;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? (scrollY / max) * 100 : 0;
  xpBar.style.width = pct + "%";
  const level = Math.min(10, Math.floor(pct / 10) + 1);
  xpLvl.textContent = "LVL " + level;
  if (level > lastLevel) showToast(`⬆️ LEVEL UP! Nível ${level}`);
  lastLevel = level;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== Animação de entrada ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

/* ===== Conquistas por seção ===== */
const achievements = {
  planos: "👑 Conquista: Explorador de Planos!",
  tutorial: "📥 Conquista: Hora da Missão!"
};
const seen = new Set();
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const id = e.target.id;
    if (e.isIntersecting && achievements[id] && !seen.has(id)) {
      seen.add(id);
      showToast(achievements[id]);
    }
  });
}, { threshold: 0.4 });
Object.keys(achievements).forEach(id => secObs.observe($("#" + id)));

/* ===== Missões do tutorial ===== */
const checks = $$(".step__check");
function updateQuest() {
  const done = checks.filter(c => c.checked).length;
  $("#questDone").textContent = done;
  $("#questBar").style.width = (done / checks.length) * 100 + "%";
  if (done === checks.length) showToast("🏆 Todas as missões concluídas! +500 XP");
}
checks.forEach(c => c.addEventListener("change", updateQuest));

/* ===== Botão de download ===== */
$("#downloadBtn").href = CONFIG.downloadUrl;

/* ===== Botões de compra (WhatsApp) ===== */
$$(".buy").forEach(btn => {
  btn.addEventListener("click", () => {
    const msg = encodeURIComponent(`Olá! Quero adquirir o ${btn.dataset.plan} do emulador Forfix.`);
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, "_blank", "noopener");
  });
});

/* ===== Ano no rodapé ===== */
$("#year").textContent = new Date().getFullYear();