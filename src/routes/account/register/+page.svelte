<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="container">
    {#if registered}
    <div class="row">
        <div class="col-md-12 alert alert-success"><span>{utils.getLabel('success',labels,$language)}</span></div>
    </div>
    {:else}
    <div class="row">
        <div class="col-12">
            <form class="card border-0 p2" id="registration-form" on:submit|preventDefault={sendData}>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="login_input">* {utils.getLabel('login',labels,$language)}</label>
                        <input type="text" class="form-control" id="login_input" required
                            aria-describedby="login_inputHelp" bind:value={login} />
                        <small id="login_inputHelp" class="form-text text-muted">{utils.getLabel('login_hint',labels,$language)}</small>
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="email_input">* {utils.getLabel('email',labels,$language)}</label>
                        <input type="email" class="form-control" id="email_input" required
                            aria-describedby="email_inputHelp" bind:value={email} />
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="name_input">* {utils.getLabel('name',labels,$language)}</label>
                        <input type="text" class="form-control" id="name_input" required
                            aria-describedby="name_inputHelp" bind:value={name} />
                        <small id="password_inputHelp" class="form-text text-muted">{utils.getLabel('name_hint',labels,$language)}</small>
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="name_input">{utils.getLabel('surname',labels,$language)}</label>
                        <input type="text" class="form-control" id="name_input"
                            aria-describedby="surname_inputHelp" bind:value={surname} />
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="password_input">* {utils.getLabel('password',labels,$language)}</label>
                        <input type="password" class="form-control" id="password_input" required
                            aria-describedby="password_inputHelp" bind:value={password} />
                        <small id="password_inputHelp" class="form-text text-muted">{utils.getLabel('password_hint',labels,$language)}</small>
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="input-field mr-1">
                        <label for="password2_input">* {utils.getLabel('password_retype',labels,$language)}</label>
                        <input type="password" class="form-control" id="password2_input" required
                            aria-describedby="password2_inputHelp" bind:value={password2} />
                        <small id="password2_inputHelp" class="form-text text-muted">{utils.getLabel('password_retype_hint',labels,$language)}</small>
                    </div>
                </div>

                <label class="form-check-label mt-2">{utils.getLabel('preferredLanguage',labels,$language)}</label>
                {#each ['PL', 'EN'] as language}
                <div class="form-check form-check-inline">
                    <label class="form-check-label">{language}</label>
                    <input class="form-check-input" type="radio" name="preferredLanguage" id="preferredLanguage1"
                        value={language} bind:group={preferredLanguage}>
                </div>
                {/each}

                <div class="form-check mt-2 mb-3">
                    <input class="form-check-input" type="checkbox" value="y" id="accept" name="accept" required
                        bind:checked={accepted}>
                    <label class="form-check-label" for="accept">
                        {utils.getLabel('legal_text1',labels,$language)} <a href="/#!doc,legal" target="_blank">{utils.getLabel('legal_text2',labels,$language)}</a>.
                    </label>
                </div>
                {#if validationError!=''}
                <div class="row">
                    <div class="col-md-12 alert alert-warning"><span><strong>{utils.getLabel('warning',labels,$language)} </strong>
                        {utils.getLabel(validationError,warnings,$language)}</span></div>
                </div>
                {/if}
                {#if errorMessage!=''}
                <div class="row">
                    <div class="col-md-12 alert alert-danger"><span><strong>{utils.getLabel('warning',labels,$language)} </strong>{errorMessage}</span></div>
                </div>
                {/if}
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">{utils.getLabel('continue',labels,$language)}</button>
                    <button type="button" class="btn btn-secondary" on:click|preventDefault={cancel}>{utils.getLabel('cancel',labels,$language)}</button>
                </div>
            </form>

        </div>
    </div>
    {/if}
</div>
<script>
    import { onMount } from 'svelte';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { goto } from '$app/navigation';
 
    let login = ''
    let email = ''
    let name = ''
    let surname = ''
    let password = ''
    let password2 = ''
    let preferredLanguage = 'PL'
    let accepted = false
    let validationError=''

    let registered = false
    let errorMessage = ''

    onMount(async () => {
        login = ''
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
            email: email,
            name: name,
            surname: surname,
            password: password,
            accept: accepted,
            preferredLanguage: preferredLanguage
        }
        const headers = new Headers()
        let url = utils.getBackendUrl(location) + "/api/account/register/"
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: 'POST', mode: 'cors', headers: headers, body: JSON.stringify(data) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                registered = true
            } else if (response.status == 409) {
                errorMessage = utils.getLabel('user_exists', labels, $language)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' ' + utils.getLabel('fetcherror_message', labels, $language)
            }
            console.log(error)
        });
        console.log('sending', data)
        return false
    }
    function validateForm() {
        if (login.match(/^[a-zA-Z0-9_.-@].{2,32}$/) == null) {
            validationError='login'
            return false
        }
        if (login.match(/^\S+$/) == null) {
            validationError='login_spaces'
            return false
        }
        if (email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) == null) {
            validationError='email'
            return false
        }
        if (name.match(/^.{1,}$/) == null) { ///^[a-zA-Z0-9_.+-@].{2,}$/
            validationError='name'
            return false
        }
        if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) == null) {
            validationError='password'
            return false
        }
        if (password != password2) {
            validationError='passwords_not_match'
            return false
        }
        return true
    }


    //{utils.getLabel('remove',labels,$language)}

    let labels = {
        'title': {
            'pl': "Rejestracja nowego użytkownika",
            'en': "Register new user",
        },
        'login': {
            'pl': "Login",
            'en': "Login",
        },
        'login_hint': {
            'pl': "Login musi mieć od 3 do 32 znaków i może zawierać tylko litery, cyfry oraz znaki _ . - @",
            'en': "Login must be 3 to 32 characters long and can contain only letters, digits, dots, dashes and underscores.",
        },
        'email': {
            'pl': "Email",
            'en': "Email",
        },
        'name': {
            'pl': "Imię",
            'en': "Name",
        },
        'name_hint': {
            'pl': "Imię musi mieć co najmniej 2 znaki",
            'en': "Name must be at least 2 characters long",
        },
        'surname': {
            'pl': "Nazwisko",
            'en': "Surname",
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
        'preferredLanguage': {
            'pl': "Preferowany język",
            'en': "Preferred language",
        },
        'legal_text1': {
            'pl': "Wysyłając formularz akceptuję ",
            'en': "By submitting the form I accept ",
        },
        'legal_text2': {
            'pl': "Regulamin serwisu oraz politykę prywatności",
            'en': "Terms of service and privacy policy",
        },
        'continue': {
            'pl': "Kontynuuj rejestrację",
            'en': "Continue registration",
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel",
        },
        'warning': {
            'pl': "Uwaga! ",
            'en': "Warning! ",
        },
        'user_exists': {
            'pl': "Użytkownik o podanym loginie już istnieje",
            'en': "User with this login already exists",
        },
        'success': {
            'pl': "Konto zostało utworzone. Na podany adres e-mail została wysłana wiadomość z linkiem aktywacyjnym. Sprawdź swoją skrzynkę pocztową.",
            'en': "Account has been created. An activation link has been sent to the email address you provided. Check your mailbox.",
        },
    }
    let warnings = {
        'login': {
            'pl': "Login nie spełnia wymagań",
            'en': "Login does not meet requirements",
        },
        'login_spaces': {
            'pl': "Login nie może zawierać spacji",
            'en': "Login cannot contain spaces",
        },
        'email': {
            'pl': "Adres e-mail wygląda na niepoprawny",
            'en': "Email address looks invalid",
        },
        'name': {
            'pl': "Imię musi mieć co najmniej 2 znaki",
            'en': "Name must be at least 2 characters long",
        },
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