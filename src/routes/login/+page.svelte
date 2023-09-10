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

<script>
    import { profile, token, language, isAuthenticated } from '$lib/usersession.js';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';

    let errorMessage = ''

    function clearMessage(event) {
        errorMessage = ''
    }
    async function doLogin(event) {
        event.preventDefault()
        const pwd = event.target.elements['password'].value
        const lg = event.target.elements['login'].value
        if (!dev) {
            const url = utils.getBackendUrl(location) + '/api/auth/v2'
            const headers = new Headers()
            headers.set('Authentication', 'Basic ' + btoa(lg + ":" + pwd));

            const result = fetch(
                url,
                {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                })
                .then(response => response.text())
                .then(text => {
                    token.set(text)
                    const headers2 = new Headers()
                    headers2.set('Authentication', text);
                    return fetch(
                        utils.getBackendUrl(location) + '/api/core/user/' + lg,
                        {
                            method: 'GET',
                            mode: 'cors',
                            credentials: 'include',
                            referrerPolicy: 'origin-when-cross-origin',
                            headers: headers2
                        })
                })
                .then(response => response.json())
                .catch(error => {
                    errorMessage = 'Nieudane logowanie'
                    alert("HTTP-Error: " + error);
                    token.set(null)
                })

                result.then(user => {
                    console.log('user after login', user)
                    profile.set(user)
                    goto('/')
                })

        } else {
            errorMessage = ''
            let user = {language:'en',organization:0,login:lg}
            profile.set(user)
            token.set('dev')
            goto('/')
        }

    }
</script>