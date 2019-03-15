(() => {
  const loader = document.querySelector('.loader');
  const resp = document.querySelector('.resp');
  const toggleLoader = () => {
    if (loader.classList.contains('gone')) {
      resp.textContent = '';
      loader.classList.remove('gone');
      resp.classList.add('gone');
      document.querySelector('.submit').disabled = true;
    } else {
      loader.classList.add('gone');
      resp.classList.remove('gone');
      document.querySelector('.submit').disabled = false;
    }
  };
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    /* const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const phoneNumber = document.querySelector('input[name="phoneNumber"]').value; */
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    if (confirmPassword !== password) {
      resp.textContent = 'password mismatch, confirm password';
      toggleLoader();
      console.log(resp.textContent);
      return;
    }
    if (password === '') {
      resp.textContent = 'empty password';
      toggleLoader();
      return;
    }
    setTimeout(() => {
      toggleLoader();
      resp.textContent = 'created account successfully';
      localStorage.setItem('email', email);
      window.location.href = './app.html';
    }, 2000);
    /* testing locally */
    /* const endpoint = 'http://localhost:3000/api/v1/users';
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      }),
    })
      .then(response => response.json())
      .then((res) => {
        toggleLoader();
        try {
          const { token } = res.data[0];
          resp.textContent = 'created account successfully';
          localStorage.setItem('token', token);
          localStorage.setItem('name', firstName);
          window.location.href = './index.html';
        } catch (e) {
          resp.textContent = res.error;
        }
      }).catch(() => {
        resp.textContent = 'Something went wrong';
        toggleLoader();
      }); */
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
