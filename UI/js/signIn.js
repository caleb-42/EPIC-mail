/* eslint-disable no-undef */
let reset = false;
(() => {
  localStorage.clear();
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const emailAddress = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const endpoint = reset ? 'auth/reset' : 'auth/login';
    const payload = reset ? { email: emailAddress } : { email: emailAddress, password };

    server(
      endpoint,
      'POST',
      payload,
      (res) => {
        toggleLoader();
        try {
          if (reset) {
            document.querySelector('.resp').textContent = res.data[0].message;
            return;
          }
          // eslint-disable-next-line no-unused-vars
          const {
            firstName, lastName, email,
            id, dp, phoneNumber, recoveryEmail,
          } = res.data[0];
          document.querySelector('.resp').textContent = 'successfully signed in';
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('email', email);
          localStorage.setItem('id', id);
          localStorage.setItem('dp', dp);
          localStorage.setItem('phoneNumber', phoneNumber);
          localStorage.setItem('recoveryEmail', recoveryEmail);
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
  document.querySelector('.reset').addEventListener('click', () => {
    reset = !reset;
    switchClass('.passInp', 'gone');
    const resetmsg = document.querySelector('.resetmsg');
    resetmsg.innerHTML = resetmsg.innerHTML === 'Forgot password ? ' ? 'Go back to &nbsp;' : 'Forgot password ? ';
    const dis = document.querySelector('.reset');
    dis.innerHTML = dis.innerHTML === 'reset password' ? 'sign in' : 'reset password';
    const submitBtn = document.querySelector('.submit');
    submitBtn.innerHTML = submitBtn.innerHTML === 'sign in' ? 'reset link' : 'sign in';
  });
})();
