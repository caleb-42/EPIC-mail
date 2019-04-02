/* eslint-disable no-undef */
(() => {
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const recoveryEmail = document.querySelector('input[name="recoveryemail"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    server(
      'auth/signup',
      'POST',
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        recoveryEmail,
      },
      (res) => {
        toggleLoader();
        try {
          const { firstName, lastName, email } = res.data[0];
          resp.textContent = 'created account successfully';
          localStorage.setItem('login', 'yes');
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
})();
