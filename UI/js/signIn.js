window.addEventListener('load', (evt) => {
    document.querySelector('button').addEventListener('click', () => {
        document.querySelector('.submit').disabled = true;
        toggleLoader();
        let email = document.querySelector('input[name="email"]').value;
        let password = document.querySelector('input[name="password"]').value;
        const data = {
            email,
            password
        }
        /* fetch(endpoint, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
          body: JSON.stringify(data)
        }).then((res)=>{
            console.log(res);
        }); */
        
        window.setTimeout(()=>{/* API call is digused with setTimer function to view loader.gif and REST response message */
            document.querySelector('.submit').disabled = false;
            toggleLoader();
            document.querySelector('.resp').textContent = 'successfully signed in';
            console.log(data);
        }, 3000);
    });
    function toggleLoader(){
        const loader= document.querySelector('.loader');
        const resp= document.querySelector('.resp');
        if(loader.classList.contains('gone')){
            loader.classList.remove('gone');
            resp.classList.add('gone');
        }else{
            loader.classList.add('gone');
            resp.classList.remove('gone');
        }
    }
    const inputs = document.querySelectorAll('.input-group input');

    inputs.forEach((input)=>{
        input.addEventListener('focusin', (evt) => {
            event.target.parentNode.querySelector('label').classList.add('show');
        });
        input.addEventListener('focusout', (evt) => {
            event.target.parentNode.querySelector('label').classList.remove('show');
        });
    })
})