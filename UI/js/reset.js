/* eslint-disable no-undef */
(() => {
  localStorage.clear();
  getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  const validateToken = () => {
    /* const urlParams = new URLSearchParams(window.location.search);
    const token1 = urlParams.get('token'); */
    const token = getUrlParameter('token');
    console.log(token);
    /* if (!token) return; */
    server(
      `auth/reset?token=${token}`,
      'GET',
      {},
      (res) => {
        try {
          const { email, id } = res.data[0];
          switchClass('.wrapper', 'gone', 'remove');
          switchClass('.loader', 'gone', 'add');
          switchClass('.loadmodal', 'gone', 'add');
          console.log(email, id);
        } catch (e) {
          switchClass('.loader', 'gone', 'add');
          document.querySelector('.loadMsg').textContent = res.error;
        }
      },
      (err) => {
        switchClass('.loader', 'gone', 'add');
        document.querySelector('.loadMsg').textContent = 'Connection Failed';
        console.log(err);
      },
    );
  };
  validateToken();
  document.querySelector('button').addEventListener('click', () => {
    toggleLoader();
    const formObj = formToJson(document.querySelector('.form-hd'));

    server(
      'users/save',
      'PATCH',
      formObj,
      (res) => {
        try {
          const { firstname } = res.data[0];
          document.querySelector('.resp').textContent = 'Password successfully changed';
          setTimeout(() => {
            window.location.href = './signIn.html';
          }, 2000);
          console.log(firstname);
        } catch (e) {
          console.log(res);
          document.querySelector('.resp').textContent = res.error;
        }
        toggleLoader();
      },
      (err) => {
        toggleLoader();
        document.querySelector('.resp').textContent = 'Failed to Fetch';
        console.log(err);
      },
    );
  });
})();
