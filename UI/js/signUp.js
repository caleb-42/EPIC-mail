(() => {
  function toggleLoader() {
    const loader = document.querySelector('.loader');
    const resp = document.querySelector('.resp');
    if (loader.classList.contains('gone')) {
      loader.classList.remove('gone');
      resp.classList.add('gone');
    } else {
      loader.classList.add('gone');
      resp.classList.remove('gone');
    }
  }
  document.querySelector('button').addEventListener('click', () => {
    document.querySelector('.submit').disabled = true;
    toggleLoader();
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    if (confirmPassword !== password) {
      document.querySelector('.submit').disabled = false;
      document.querySelector('.resp').textContent = 'password mismatch, confirm password';
      toggleLoader();
      return;
    }
    if (password === '') {
      document.querySelector('.submit').disabled = false;
      toggleLoader();
      document.querySelector('.resp').textContent = 'empty password';
      return;
    }
    /* fetch(endpoint{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
          body: JSON.stringify(data)
        }).then((res)=>{
            console.log(res);
        }); */
    window.setTimeout(() => { /* API call is digused with setTimer
        function to view loader.gif and REST response message */
      toggleLoader();
      document.querySelector('.resp').textContent = 'created account successfully';
      document.querySelector('.submit').disabled = false;
      console.log(firstName, lastName, email, password, phoneNumber);
    }, 3000);
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
