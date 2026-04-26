function selectPlan(planValue) {
  const select = document.getElementById('planSelect');
  select.value = planValue;
  document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

function handleSubmit() {
  const form = document.getElementById('advertiseForm');
  const message = document.getElementById('formMessage');
  setTimeout(() => {
    form.style.display = 'none';
    message.innerHTML = `
      <div class="thank-you-box">
        <strong>Thank you for applying!</strong><br><br>
        Your application has been received and is under review.<br>
        We'll be in touch within 2 business days.
      </div>
    `;
  }, 600);
  return true;
}
