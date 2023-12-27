<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>Register</h5>
</div>
<div class="container">
    <div class="row">
        <div class="col-12">
            <form class="card border-0 p2" id="registration-form" on:submit|preventDefault={sendData}>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="login_input">* LOGIN</label>
                        <input type="text" class="form-control" id="login_input" required
                            aria-describedby="login_inputHelp" bind:value={login} />
                        <small id="login_inputHelp" class="form-text text-muted">LOGIN HINT</small>
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="email_input">* EMAIL</label>
                        <input type="email" class="form-control" id="email_input" required
                            aria-describedby="email_inputHelp" bind:value={email} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="name_input">* NAME</label>
                        <input type="text" class="form-control" id="name_input" required
                            aria-describedby="name_inputHelp" bind:value={name} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="name_input">SURNAME</label>
                        <input type="text" class="form-control" id="name_input"
                            aria-describedby="surname_inputHelp" bind:value={surname} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="password_input">* PASSWORD</label>
                        <input type="password" class="form-control" id="password_input" required
                            aria-describedby="password_inputHelp" bind:value={password} />
                        <small id="password_inputHelp" class="form-text text-muted">PASSWORD HINT</small>
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-field mr-1">
                        <label for="password2_input">* PASS RETYPE</label>
                        <input type="password" class="form-control" id="password2_input" required
                            aria-describedby="password2_inputHelp" bind:value={password2} />
                        <small id="password2_inputHelp" class="form-text text-muted">PASSWORD HINT</small>
                    </div>
                </div>

                <label class="form-check-label">PREF LANG</label>

                {#each ['PL', 'EN'] as language}
                <div class="form-check form-check-inline">
                    <label class="form-check-label">{language}</label>
                    <input class="form-check-input" type="radio" name="preferredLanguage" id="preferredLanguage1"
                        value={language} bind:group={preferredLanguage}>
                </div>
                {/each}

                <div class="form-check" style="margin-bottom: 20px;">
                    <input class="form-check-input" type="checkbox" value="y" id="accept" name="accept" required
                        bind:checked={accepted}>
                    <label class="form-check-label" for="accept">
                        LEGAL TEXT 1 <a href="/#!doc,legal" target="_blank">LEGAL TEXT 2</a>.
                    </label>
                </div>
                {#if validationError!=''}
                <div class="row">
                    <div class="col-md-12 alert alert-warning"><span><strong>WARNING </strong>ALERT TEXT</span></div>
                </div>
                {/if}
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">REGISTER</button>
                    <button type="button" class="btn btn-secondary">CANCEL</button>
                </div>
            </form>

        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';

    let login = ''
    let email = ''
    let name = ''
    let surname = ''
    let password = ''
    let password2 = ''
    let preferredLanguage = 'PL'
    let accepted = false
    let validationError=''

    onMount(async () => {
        login = ''
    });
    function sendData() {
        if (!validateForm()) {
            console.log('form not valid')
            return false
        }
        let data = {
            login: login,
            email: email,
            name: name,
            surname: surname,
            password: password,
            accept: accepted,
            preferredLanguage: preferredLanguage
        }
        console.log('sending', data)
        return false
    }
    function validateForm() {
        if (login.match(/^[a-zA-Z0-9_.-@].{2,32}$/) == null) {
            validationError='login not valid'
            return false
        }
        if (login.match(/^\S+$/) == null) {
            console.log('login has spaces')
            return false
        }
        if (email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) == null) {
            console.log('email not valid')
            return false
        }
        if (name.match(/^.{2,}$/) == null) { ///^[a-zA-Z0-9_.+-@].{2,}$/
            console.log('name not valid')
            return false
        }
        if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) == null) {
            console.log('password not valid')
            return false
        }
        if (password2.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) == null) {
            console.log('password2 not valid')
            return false
        }
        if (password != password2) {
            console.log('passwords not equal')
            return false
        }
        return true
    }
</script>