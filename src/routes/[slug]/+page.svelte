<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { utils } from '$lib/utils.js';
    import {  profile, token, language, isAuthenticated, viewMode } from '$lib/usersession.js';
    
    console.log('/[slug]', $page)

    /* if (false) {
        console.log('/[slug]2', $page)
        var tokenObject;
        let serviceUrl = utils.getBackendUrl(location)
        console.log('page', $page);
        // Call the API - get the token object
        token.set('SLUG',$page.params.slug)
        fetch(serviceUrl + '/api/auth/token/' + $page.params.slug).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (data) {
            // Store the token data to a variable
            tokenObject = data;
            console.log('tokenObject1', tokenObject);
            token.set(tokenObject.token);
            let user = {language:'en',organization:1,login:'public',uid:'public'}
            profile.set(user)
            goto('/dashboards/'+tokenObject.payload)
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    } else { */
        viewMode.set('full')
        goto('/')
    //}
</script>