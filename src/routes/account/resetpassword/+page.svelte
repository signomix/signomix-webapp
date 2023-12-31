<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="row">
<div class="col-md-2"></div>
<div class="col-md-6">
<form class="" on:submit|preventDefault={sendData}>
    <div class="form-floating mb-3 text-center">
        <p>{utils.getLabel('info',labels,$language)}</p>
        </div>
    <div class="form-floating mb-3 text-center">
        <input required type="text" class="form-control" id="login" name="login" placeholder="login"
            on:change={clearMessage}>
        <label for="login">{utils.getLabel('login',labels,$language)}</label>
    </div>
    <div class="form-floating mb-3 text-center">
        <input required type="email" class="form-control" id="email" name="email" placeholder="email"
            on:change={clearMessage}>
        <label for="email">{utils.getLabel('email',labels,$language)}</label>
    </div>
    {#if errorMessage!=''}
    <div class="alert alert-danger w-100" role="alert">
        {errorMessage}
    </div>
    {/if}
    <div class="form-floating mb-3 text-center">
    <button class="btn btn-lg btn-primary" type="submit">{utils.getLabel('send',labels,$language)}</button>
    <button class="btn btn-lg btn-secondary" type="button" on:click|preventDefault={doCancel}>{utils.getLabel('cancel',labels,$language)}</button>
    </div>
</form>
</div>
<div class="col-md-2"></div>
</div>

<script>
    import { profile, token, language, isAuthenticated } from '$lib/usersession.js';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';

    let errorMessage = ''

    function isCloud() {
        return utils.isCloudSubdomain($page.url)
    }
    function clearMessage(event) {
        errorMessage = ''
    }
    function doCancel(event) {
        goto('/')
    }
    async function sendData(event) {
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
            let user = {language:'en',organization:0,login:lg,uid:'user'}
            profile.set(user)
            token.set('dev')
            goto('/')
        }

    }

    let labels = {
        'title': {
            'pl': "Przywracanie hasła",
            'en': "Reset password"
        },
        'send': {
            'pl': "Kontynuuj",
            'en': "Continue"
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel"
        },
        'login': {
            'pl': "Login",
            'en': "Login"
        },
        'email': {
            'pl': "E-mail",
            'en': "E-mail"
        },
        'info': {
            'pl': "Wpisz swój login i e-mail. Na podany adres zostanie wysłany link do zmiany hasła.",
            'en': "Enter your login and e-mail. A link to change your password will be sent to the given address."
        }
    }
</script>