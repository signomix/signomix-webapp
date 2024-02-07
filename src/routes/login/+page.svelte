<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
    {#if dev}
    <br><i>{utils.getLabel('dev_mode',labels,$language)}</i>
    {/if}
</div>
<form class="" on:submit|preventDefault={doLogin}>
    <div class="form-floating mb-3 text-center">
        <input required type="text" class="form-control" id="login" name="login" placeholder="login"
            on:change={clearMessage}>
        <label for="login">{utils.getLabel('login',labels,$language)}</label>
    </div>
    <div class="form-floating mb-3 text-center">
        <input required type="password" class="form-control" id="password" name="password" placeholder="password"
            on:change={clearMessage}>
        <label for="password">{utils.getLabel('password',labels,$language)}</label>
    </div>
    <div class="form-floating mb-3 text-left">
        <a href="/account/resetpassword" class="">{utils.getLabel('forgotten_password',labels,$language)}</a>
    </div>
    <div class="form-floating mb-3 text-left">
        {#if isCloud() || dev==true}
        {utils.getLabel('not_registered',labels,$language)}<a href="/account/register" class="">{utils.getLabel('register',labels,$language)}</a>
        {/if}
    </div>
    {#if errorMessage!=''}
    <div class="alert alert-danger w-100" role="alert">
        {errorMessage}
    </div>
    {/if}
    <div class="form-floating mb-3 text-center">
    <button class="w-50 btn btn-lg btn-primary" type="submit">{utils.getLabel('send',labels,$language)}</button>
    </div>
    <!--    <p class="mt-5 mb-3 text-muted">&copy; 2017–2022</p> -->
</form>

<script>
    import { profile, token, language, isAuthenticated } from '$lib/usersession.js';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';

    let errorMessage = ''
    let submitted=false

    function isCloud() {
        return utils.isCloudSubdomain($page.url)
    }
    function clearMessage(event) {
        errorMessage = ''
    }
    async function doLogin(event) {
        event.preventDefault()
        if (submitted) return
        errorMessage = ''
        const pwd = event.target.elements['password'].value
        const lg = event.target.elements['login'].value
        if (!dev) {
            submitted=true
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
                    if(text=='' || text==null) {
                        errorMessage = utils.getLabel('failure', labels, $language)
                        submitted=false
                        return
                    }
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
                    errorMessage = utils.getLabel('failure', labels, $language)
                    submitted=false
                    //alert("HTTP-Error: " + error);
                    token.set(null)
                })

                result.then(user => {
                    if(errorMessage!='') return
                    console.log('user after login', user)
                    profile.set(user)
                    goto('/')
                })

        } else {
            errorMessage = ''
            let user = {language:'en',organization:0,login:lg,uid:'user'}
            profile.set(user)
            token.set('dev')
            goto('/')
        }

    }

    let labels = {
        'title': {
            'pl': "Logowanie do serwisu",
            'en': "Login to the service"
        },
        'send': {
            'pl': "Kontynuuj",
            'en': "Continue"
        },
        'dev_mode': {
            'pl': "Tryb develperski. Login: user, hasło: user",
            'en': "Developer mode. Login: user, password: user"
        },
        'login': {
            'pl': "Login",
            'en': "Login"
        },
        'password': {
            'pl': "Hasło",
            'en': "Password"
        },
        'forgotten_password': {
            'pl': "Zapomniałem hasła",
            'en': "Forgotten password"
        },
        'not_registered': {
            'pl': "Jeżeli nie masz konta, ",
            'en': "If you don't have an account, "
        },
        'failure': {
            'pl': "Nieudane logowanie",
            'en': "Login failed"
        },
        'register': {
            'pl': "zarejestruj się",
            'en': "register"
        },
    }
</script>