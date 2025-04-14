<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<form class="" on:submit|preventDefault={handleLoginAs}>
    <div class="form-floating mb-3 text-center">
        <input required type="text" class="form-control" id="login" name="login" placeholder="login"
            on:change={clearMessage}>
        <label for="login">{utils.getLabel('login',labels,$language)}</label>
    </div>
    {#if errorMessage!=''}
    <div class="alert alert-danger w-100" role="alert">
        {errorMessage}
    </div>
    {/if}
    <div class="form-floating mb-3 text-center">
    <button class="w-50 btn btn-lg btn-primary" type="submit">{utils.getLabel('send',labels,$language)}</button>
    </div>
</form>

<script>
    import { profile, token, language, organizationConfig } from '$lib/usersession.js';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';

    let errorMessage = ''
    let submitted=false

    function clearMessage(event) {
        errorMessage = ''
    }

    async function handleLoginAs(event) {
        let lg = event.target.elements['login'].value
        let errorMessage = ''
        let submitted = false
        if(dev==true) {
            return
        }
        //if (!dev) {
            submitted=true
            const url = utils.getBackendUrl(location) + '/api/auth/take/'+lg
            const headers = new Headers()
            headers.set('Authentication', $token);
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
                    if(text=='' || text==null || text== undefined) {
                        errorMessage = utils.getLabel('failure', labels, $language)
                        submitted=false
                        goto('/admin/login')
                        return
                    }
                    token.set(text)
                    const headers2 = new Headers()
                    headers2.set('Authentication', text);
                    headers2.set('X-signomix-takeover', 'true');
                    return fetch(
                        utils.getBackendUrl(location) + '/api/account/user/' + lg,
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
                    token.set(null)
                })

                result.then(user => {
                    if(errorMessage!='') return
                    profile.set(user)
                    if(user.organization!=utils.getDefaultOrganizationId()) {
                        let headers = new Headers();
                        headers.set('Authentication', $token);
                        if(user.tensnt!=0){
                        fetch(utils.getBackendUrl(location) + '/api/organization/' + user.organization,
                            {
                                method: 'GET',
                                mode: 'cors',
                                credentials: 'include',
                                referrerPolicy: 'origin-when-cross-origin',
                                headers: headers
                            })
                            .then(response => response.json())
                            .then(org => {
                                try{
                                    organizationConfig.set(JSON.parse(org.configuration))
                                } catch(e) {
                                    console.log('error parsing organization.configuration',e)
                                }
                                
                            })
                        }
                    }
                    goto('/')
                })

        //}

    }



    let labels = {
        'title': {
            'pl': "Logowanie na konto użytkownika",
            'en': "Login to user account"
        },
        'send': {
            'pl': "Kontynuuj",
            'en': "Continue"
        },
        'login': {
            'pl': "Login",
            'en': "Login"
        },
        'failure': {
            'pl': "Nieudane logowanie",
            'en': "Login failed"
        }
    }
</script>