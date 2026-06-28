const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7lIqFuMvnCr0gqU256XfxsySfeXj21D0MgP1Q766Fdw0Ax4z05s3T-P-U4Qgur8gz/exec';

const form    = document.getElementById('rsvpForm');
const message = document.getElementById('formMessage');

/* ── Countdown ─────────────────────────── */
const countdownTarget = new Date(Date.UTC(2026, 8, 12, 15, 20, 0));
// 12 сентября 2026, 18:20 МСК = 15:20 UTC

function updateCountdown() {
  const diff = countdownTarget - new Date();

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  if (diff <= 0) {
    [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = '0'; });
    return;
  }

  daysEl.textContent    = Math.floor(diff / 864e5);
  hoursEl.textContent   = Math.floor((diff / 36e5) % 24);
  minutesEl.textContent = Math.floor((diff / 6e4) % 60);
  secondsEl.textContent = Math.floor((diff / 1e3) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Hero Ken-Burns ─────────────────────── */
const heroImg = document.querySelector('.hero__image');
if (heroImg) {
  requestAnimationFrame(() => heroImg.classList.add('loaded'));
}

/* ── Fade-in on scroll ──────────────────── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.10 }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── RSVP Form ──────────────────────────── */
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  message.textContent = '';
  message.className   = 'form-message';

  const formData = new FormData(form);

  // Honeypot
  if (formData.get('website')) {
    message.textContent = 'Спасибо! Мы получили ваш ответ.';
    message.classList.add('success');
    form.reset();
    return;
  }

  const drinks        = formData.getAll('drinks').join(', ') || 'Не выбрано';
  const allergyStatus = formData.get('allergyStatus') || '';
  const allergyDetails = formData.get('allergyDetails') || '';

  if (allergyStatus === 'Да' && allergyDetails.trim() === '') {
    message.textContent = 'Пожалуйста, укажите, на что у вас аллергия.';
    message.classList.add('error');
    return;
  }

  const allergies = allergyStatus === 'Да'
    ? `Да: ${allergyDetails.trim()}`
    : 'Нет';

  const data = {
    name:       formData.get('name'),
    weddingDay: formData.get('weddingDay'),
    secondDay:  formData.get('secondDay'),
    drinks,
    allergies,
    comment:    formData.get('comment'),
    questions:  formData.get('questions'),
    phone:      formData.get('phone')
  };

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled    = true;
  submitButton.textContent = 'Отправляем…';

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:   JSON.stringify(data)
    });

    message.textContent = 'Спасибо! Мы получили ваш ответ.';
    message.classList.add('success');
    form.reset();

  } catch {
    message.textContent = 'Не удалось отправить форму. Попробуйте ещё раз.';
    message.classList.add('error');
  } finally {
    submitButton.disabled    = false;
    submitButton.textContent = 'Подтвердить';
  }
});
