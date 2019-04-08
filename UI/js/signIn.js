/* eslint-disable no-undef */
(() => {
  localStorage.clear();
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
          const {
            firstName, lastName, email,
            id,
          } = res.data[0];
          document.querySelector('.resp').textContent = 'successfully signed in';
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('email', email);
          localStorage.setItem('id', id);
          window.location.href = './app.html';
        } catch (e) {
          document.querySelector('.resp').textContent = res.error;
        }
      },
      (err) => {
        document.querySelector('.resp').textContent = 'Something went wrong';
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
