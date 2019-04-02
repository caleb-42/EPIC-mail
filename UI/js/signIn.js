/* eslint-disable no-undef */
(() => {
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    /* testing locally */
    server(
      'auth/login',
      'POST',
      { email, password },
      (res) => {
        toggleLoader();
        try {
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
    /* fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => response.json())
      .then((res) => {
        toggleLoader();
        try {
          const { token, firstName } = res.data[0];
          resp.textContent = 'successfully signed in';
          localStorage.setItem('login', 'yes');
          window.location.href = './app.html';
        } catch (e) {
          resp.textContent = res.error;
        }
      }).catch(() => {
        resp.textContent = 'Something went wrong';
        toggleLoader();
      }); */
    /* window.setTimeout(() => {
      toggleLoader();
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('email', email);
        document.querySelector('.resp').textContent = 'successfully signed in';
        window.location.href = './app.html';
        return;
      }
      document.querySelector('.resp').textContent = 'failed to signed in';
    }, 3000); */
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
