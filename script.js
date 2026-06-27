const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7lIqFuMvnCr0gqU256XfxsySfeXj21D0MgP1Q766Fdw0Ax4z05s3T-P-U4Qgur8gz/exec';

const form = document.getElementById('rsvpForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  message.textContent = '';
  message.className = 'form-message';

  const formData = new FormData(form);

  // Простая защита от ботов: скрытое поле должно быть пустым
  if (formData.get('website')) {
    message.textContent = 'Спасибо! Мы получили ваш ответ.';
    message.classList.add('success');
    form.reset();
    return;
  }

  const data = {
    name: formData.get('name'),
    weddingDay: formData.get('weddingDay'),
    secondDay: formData.get('secondDay'),
    comment: formData.get('comment'),
    phone: formData.get('phone')
  };

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем...';

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    });

    message.textContent = 'Спасибо! Мы получили ваш ответ.';
    message.classList.add('success');
    form.reset();

  } catch (error) {
    message.textContent = 'Не удалось отправить форму. Пожалуйста, попробуйте ещё раз.';
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
});
