/* eslint-disable no-undef */
(() => {
  localStorage.clear();
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const fName = document.querySelector('input[name="firstName"]').value;
    const lName = document.querySelector('input[name="lastName"]').value;
    const phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
    const emailAddress = document.querySelector('input[name="email"]').value;
    const recoveryEmail = document.querySelector('input[name="recoveryemail"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    server(
      'auth/signup',
      'POST',
      {
        firstName: fName,
        lastName: lName,
        email: emailAddress,
        phoneNumber,
        password,
        confirmPassword,
        recoveryEmail,
      },
      (res) => {
        toggleLoader();
        try {
          const {
            firstName, lastName, email, id,
          } = res.data[0];
          document.querySelector('.resp').textContent = 'created account successfully';
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
})();
