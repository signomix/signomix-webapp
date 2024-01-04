<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-6">
        <form class="" on:submit|preventDefault={sendData}>
            {#if !success}
            <div class="form-floating mb-3 text-center">
                <p>{utils.getLabel('info',labels,$language)}</p>
            </div>
            <div class="form-floating mb-3 text-center">
                <input required type="text" class="form-control" id="login" name="login" placeholder="login"
                    on:change={clearMessage} bind:value={login}>
                <label for="login">{utils.getLabel('login',labels,$language)}</label>
            </div>
            <div class="form-floating mb-3 text-center">
                <input required type="email" class="form-control" id="email" name="email" placeholder="email"
                    on:change={clearMessage} bind:value={email}>
                <label for="email">{utils.getLabel('email',labels,$language)}</label>
            </div>
            {/if}
            {#if errorMessage!=''}
            <div class="alert alert-danger w-100" role="alert">
                {errorMessage}
            </div>
            {/if}
            {#if success}
            <div class="alert alert-success w-100" role="alert">
                {utils.getLabel('success',labels,$language)}
            </div>
            {/if}
            <div class="form-floating mb-3 text-center">
                {#if !success}
                <button class="btn btn-lg btn-primary" type="submit">{utils.getLabel('send',labels,$language)}</button>
                {/if}
                <button class="btn btn-lg btn-secondary" type="button"
                    on:click|preventDefault={doCancel}>{utils.getLabel('cancel',labels,$language)}</button>
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
    let login = ''
    let email = ''
    let success = false

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
        if (!dev) {
            const url = utils.getBackendUrl(location) + '/api/account/' + login + '/resetpassword?email=' + email
            const result = fetch(
                url,
                {
                    method: 'POST',
                    mode: 'cors',
                    referrerPolicy: 'origin-when-cross-origin'
                }).then((response) => {
                    if (response.status == 200) {
                        errorMessage = ''
                        success = true
                    } else {
                        errorMessage = utils.getMessage(utils.FETCH_STATUS)
                            .replace('%1', response.status)
                            .replace('%2', response.statusText)
                        alert(errorMessage)
                    }
                }).catch((error) => {
                    errorMessage = error.message
                    if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                        errorMessage = errorMessage + ' ' + utils.getLabel('fetcherror_message', labels, $language)
                    }
                    console.log(error)
                });

        } else {
            errorMessage = ''
            let user = { language: 'en', organization: 0, login: lg, uid: 'user' }
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
        },
        'success': {
            'pl': "Jeżeli podany login i e-mail są poprawne, na podany adres został wysłany link do zmiany hasła. Sprawdź swoją skrzynkę pocztową.",
            'en': "If the given login and e-mail are correct, a link to change the password has been sent to the given address. Check your mailbox."
        },
    }
</script>