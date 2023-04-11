<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Logowanie</h1>
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

    function clearMessage(event) {
        errorMessage = ''
    }
    function doLogin(event) {
        event.preventDefault()
        if (!dev) {
            const pwd = event.target.elements['password'].value
            const lg = event.target.elements['login'].value
            const url = utils.getBackendUrl(location) + '/sdd/api/user/' + lg
            const headers = new Headers()
            headers.set('Authorization', 'Basic ' + btoa(lg + ":" + pwd));
            let response = fetch(
                url,
                {
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
                        userSession.set({ logged: true, login: lg, password: pwd, authorized: true })
                        console.log($userSession.login)
                        errorMessage = ''
                        goto('/')
                    }
                }).catch((error) => {
                    errorMessage = error.message
                    if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                        errorMessage = errorMessage + '. Możliwa przyczyna: self signed nie są obsługiwane.'
                    }
                    console.log(error)
                });
        } else {
            userSession.set({ logged: true, login: 'user', password: 'user', authorized: true })
            console.log($userSession.login)
            errorMessage = ''
            goto('/')
        }
    }
</script>