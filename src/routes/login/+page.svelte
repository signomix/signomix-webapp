<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>Logowanie</h5>
    {#if dev}
    <div class="col p-2"><i>Tryb develperski. Login: user, hasło: user</i></div>
    {/if}
</div>
<form class="text-center" on:submit={doLogin}>
    <div class="form-floating mb-3">
        <input required type="text" class="form-control" id="login" name="login" placeholder="login"
            on:change={clearMessage}>
        <label for="login">Login</label>
    </div>
    <div class="form-floating mb-3">
        <input required type="password" class="form-control" id="password" name="password" placeholder="password"
            on:change={clearMessage}>
        <label for="password">Hasło</label>
    </div>
    {#if errorMessage!=''}
    <div class="alert alert-danger w-100" role="alert">
        {errorMessage}
    </div>
    {/if}
    <button class="w-50 btn btn-lg btn-primary" type="submit">Zaloguj się</button>
    <!--    <p class="mt-5 mb-3 text-muted">&copy; 2017–2022</p> -->
</form>

<p>
    {$userSession.user.login}
</p>
<script>
    import { userSession } from '$lib/stores.js';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';

    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });

    function clearMessage(event) {
        errorMessage = ''
    }
    async function doLogin(event) {
        event.preventDefault()
        const pwd = event.target.elements['password'].value
        const lg = event.target.elements['login'].value
        if (!dev) {
            const url = utils.getBackendUrl(location) + '/api/auth?action=login'
            const headers = new Headers()
            headers.set('Authentication', 'Basic ' + btoa(lg + ":" + pwd));

            let response = await fetch(
                url,
                {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                });
            if (response.ok) { // if HTTP-status is 200-299
                // get the response body (the method explained below)
                let text = await response.json();
                session.user={}
                session.user.logged = true
                session.user.login = lg
                session.user.password = pwd
                session.user.authorized = true
                session.user.token = text
                userSession.set(session)
                window.localStorage.setItem('sgx.session.token', session.user.token);
                errorMessage = ''
                getUser()
                goto('/')
            } else {
                errorMessage = 'Nieudane logowanie'
                alert("HTTP-Error: " + response.status);
            }
        } else {
            session.user={}
            session.user.logged = true
            session.user.login = lg
            session.user.password = pwd
            session.user.authorized = true
            session.user.token = ''
            session.user.language = 'en'
            session.user.organization=session.user.login.startsWith('org')?1:0
            userSession.set(session)
            console.log('DEV login',$userSession.user.login)
            errorMessage = ''
            goto('/')
        }
        
    }

    async function getUser() {
        if (!dev) {
            const url = utils.getBackendUrl(location) + '/api/user/' + session.user.login
            const headers = new Headers()
            headers.set('Authentication', session.user.token);

            let response = await fetch(
                url,
                {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                });
            if (response.ok) { // if HTTP-status is 200-299
                // get the response body (the method explained below)
                // user.type: 0 - user, 1 - owner,system admin, 9 - organization admin
                let user = await response.json();
                session.user.organization = user.organization
                session.user.type = user.type
                userSession.set(session)
                errorMessage = ''
            } else {
                errorMessage = 'Nieudane logowanie'
                alert("HTTP-Error: " + response.status);
            }
        } else {
            session.user={}
            session.user.logged = true
            session.user.authorized = true
            session.user.token = ''
            session.user.language = 'en'
            session.user.organization = 0
            if(session.user.login=='admin'){
            session.user.type = 1
            session.user.role= 'admin'
            }else{
            session.user.type = 4
            }
            userSession.set(session)
            errorMessage = ''
        }
    }
</script>