/* eslint-disable no-undef */
(() => {
  localStorage.clear();
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const formObj = formToJson(document.querySelector('.form-hd'));

    server(
      'auth/signup',
      'POST',
      formObj,
      (res) => {
        toggleLoader();
        try {
          const {
            firstName, lastName, email, id, dp, phoneNumber, recoveryEmail,
          } = res.data[0];
          document.querySelector('.resp').textContent = 'created account successfully';
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
})();
