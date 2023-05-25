<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Logowanie</h1>
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
    {$userSession.login}
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
        if (!dev) {
            const pwd = event.target.elements['password'].value
            const lg = event.target.elements['login'].value
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
                session.logged = true
                session.login = lg
                session.password = pwd
                session.authorized = true
                session.token = text
                userSession.set(session)
                errorMessage = ''
                goto('/')
            } else {
                errorMessage = 'Nieudane logowanie'
                alert("HTTP-Error: " + response.status);
            }

            /* let response = fetch(
                url,
                {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                })
                .then((response) => {
                    if (response.status == 401 || response.status == 403 || response.status == 404) {
                        console.log('UNAUTHORIZED')
                        errorMessage = 'Nieudane logowanie'
                    } else {
                        //OK
                        console.log('RESPONSE: ' + response.text())
                        userSession.set({
                            logged: true,
                            login: lg,
                            password: pwd,
                            authorized: true,
                            token: response.text()
                        })
                        console.log($userSession.login, ' ', $userSession.token)
                        errorMessage = ''
                        goto('/')
                    }
                }).catch((error) => {
                    errorMessage = error.message
                    if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                        errorMessage = errorMessage + '. Możliwa przyczyna: self signed nie są obsługiwane.'
                    }
                    console.log(error)
                }); */
        } else {
            userSession.set({ logged: true, login: 'user', password: 'user', authorized: true, language: 'en', token: '' })
            console.log($userSession.login)
            errorMessage = ''
            goto('/')
        }
    }
</script>