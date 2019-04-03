/* eslint-disable no-undef */
(() => {
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const emailAddress = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    server(
      'auth/login',
      'POST',
      { email: emailAddress, password },
      (res) => {
        toggleLoader();
        try {
          // eslint-disable-next-line no-unused-vars
          const { firstName, lastName, email } = res.data[0];
          resp.textContent = 'successfully signed in';
          localStorage.setItem('login', 'yes');
          localStorage.setItem('firstName', 'yes');
          localStorage.setItem('lastName', 'yes');
          localStorage.setItem('email', 'yes');
          window.location.href = './app.html';
        } catch (e) {
          resp.textContent = res.error;
        }
      },
      (err) => {
        resp.textContent = 'Something went wrong';
        console.log(err);
        toggleLoader();
      },
    );
  });
  const inputs = document.querySelectorAll('.input-group input');

  inputs.forEach((input) => {
    input.addEventListener('focusin', (event) => {
      event.target.parentNode.querySelector('label').classList.add('show');
    });
    input.addEventListener('focusout', (event) => {
      event.target.parentNode.querySelector('label').classList.remove('show');
    });
  });
})();
