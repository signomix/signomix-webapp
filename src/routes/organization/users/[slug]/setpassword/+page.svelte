<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="container">
    <div class="row">
        <div class="col-12">
            <form class="card border-0 p2" id="registration-form" on:submit|preventDefault={sendData}>
                {#if registered==false}
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="login_input">* {utils.getLabel('login',labels,$language)}</label>
                        <input type="text" class="form-control" id="login_input" disabled
                            aria-describedby="login_inputHelp" bind:value={login} />
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="password_input">* {utils.getLabel('password',labels,$language)}</label>
                        <input type="password" class="form-control" id="password_input" required
                            aria-describedby="password_inputHelp" bind:value={password} />
                        <small id="password_inputHelp"
                            class="form-text text-muted">{utils.getLabel('password_hint',labels,$language)}</small>
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="password2_input">* {utils.getLabel('password_retype',labels,$language)}</label>
                        <input type="password" class="form-control" id="password2_input" required
                            aria-describedby="password2_inputHelp" bind:value={password2} />
                        <small id="password2_inputHelp"
                            class="form-text text-muted">{utils.getLabel('password_retype_hint',labels,$language)}</small>
                    </div>
                </div>
                {/if}
                {#if validationError!=''}
                <div class="row">
                    <div class="col-md-12 alert alert-warning"><span><strong>{utils.getLabel('warning',labels,$language)}
                            </strong>
                            {utils.getLabel(validationError,warnings,$language)}</span></div>
                </div>
                {/if}
                {#if registered==true}
                <div class="row">
                    <div class="col-md-12 alert alert-success"><span>
                            {utils.getLabel('success',labels,$language)}</span></div>
                </div>
                {/if}
                {#if errorMessage!=''}
                <div class="row">
                    <div class="col-md-12 alert alert-danger"><span><strong>{utils.getLabel('warning',labels,$language)}
                            </strong>{errorMessage}</span></div>
                </div>
                {/if}
                <div class="form-group">
                    {#if registered==false}
                    <button type="submit" class="btn btn-primary">{utils.getLabel('continue',labels,$language)}</button>
                    <button type="button" class="btn btn-secondary"
                        on:click|preventDefault={cancel}>{utils.getLabel('cancel',labels,$language)}</button>
                    {:else}
                    <button type="button" class="btn btn-secondary"
                        on:click|preventDefault={cancel}>{utils.getLabel('ok',labels,$language)}</button>
                    {/if}

                </div>
            </form>

        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { page } from '$app/stores';

    let login = $page.slug

    let password = ''
    let password2 = ''
    let validationError = ''

    let registered = false
    let errorMessage = ''

    onMount(async () => {
        //login = $profile.uid
    });
    function cancel() {
        goto('/')
    }
    function sendData() {
        if (!validateForm()) {
            console.log('form not valid')
            return false
        }
        let data = {
            uid: login,
            password: password
        }
        const headers = new Headers()
        let url = utils.getBackendUrl(location) + "/api/account/" + login + "/password/"
        headers.set('Content-Type', 'application/json');
        headers.set('Authentication', $token);
        let response = fetch(
            url,
            { method: 'PUT', mode: 'cors', headers: headers, body: JSON.stringify(data) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                validationError = ''
                registered = true
            } else {
                /* alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                ) */
                errorMessage = utils.getLabel('error_message1', labels, language) + response.status + utils.getLabel('error_message2', labels, language)
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' ' + utils.getLabel('fetcherror_message', labels, language)
            }
            console.log(error)
        });
        console.log('sending', data)
        return false
    }
    function validateForm() {
        if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) == null) {
            validationError = 'password'
            return false
        }
        if (password != password2) {
            validationError = 'passwords_not_match'
            return false
        }
        return true
    }

    let labels = {
        'title': {
            'pl': "Zmiana hasła",
            'en': "Change password",
        },
        'login': {
            'pl': "Login",
            'en': "Login",
        },
        'password': {
            'pl': "Hasło",
            'en': "Password",
        },
        'password_hint': {
            'pl': "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną małą literę, jedną wielką literę oraz jedną cyfrę",
            'en': "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one digit",
        },
        'password_retype': {
            'pl': "Powtórz hasło",
            'en': "Retype password",
        },
        'password_retype_hint': {
            'pl': "Powtórz hasło wpisanie powyżej",
            'en': "Retype password as above",
        },
        'continue': {
            'pl': "Zapisz nowe hasło",
            'en': "Save new password",
        },
        'cancel': {
            'pl': "Wróć",
            'en': "Back",
        },
        'ok': {
            'pl': "OK",
            'en': "OK",
        },
        'warning': {
            'pl': "Uwaga! ",
            'en': "Warning! ",
        },
        'success': {
            'pl': "Hasło zostało zmienione. Możesz teraz zalogować się na swoje konto",
            'en': "Password has been changed. You can now log in to your account",
        },
        'error_message2': {
            'pl': ". Skontaktuj się z administratorem serwisu.",
            'en': ". Contact the service administrator.",
        },
        'error_message1': {
            'pl': "Nie udało się zmienić hasła. Błąd nr ",
            'en': "Failed to change password. Error no. ",
        },
    }
    let warnings = {
        'password': {
            'pl': "Hasło nie spełnia wymagań",
            'en': "Password does not meet requirements",
        },
        'passwords_not_match': {
            'pl': "Hasła nie są identyczne",
            'en': "Passwords are not identical",
        },

    }
</script>