<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    {#await data}
    <h5>{utils.getLabel('title',labels, $language)}</h5><i class="bi bi-eye h5 me-2 link-dark"></i>
    {:then data}
    <h5>{utils.getLabel('title',labels, $language)}</h5><a href="/organization/users/{data.uid}" title="View"><i class="bi bi-eye h5 me-2 link-dark"></i></a>
    {/await}
</div>
<Dialog title="Uwaga!" message={errorMessage} bind:dialog callback={closeDialog} 
labels={[utils.getLabel('ok',labels, $language)]} color="danger">
</Dialog>
{#await data}
{:then data}
<TenantForm config={data} callback={saveSettings} readonly={false}/>
{/await}
<script>
    import TenantForm from '$lib/components/TenantForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import  Dialog  from '$lib/components/Dialog.svelte';

    let errorMessage = '';
    export let data;

    let dialog

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        }
    });

    function closeDialog() {
        errorMessage = ''
        dialog.close()
    }


    function saveSettings(config){
        console.log("saveSettings: ",config);
        errorMessage=validate(config)
        if(errorMessage!=''){
            dialog.showModal()
            return
        }
        const headers = new Headers()
        let method = config.newConfig ? 'POST' : 'PUT'
        let url = utils.getBackendUrl(location) + "/api/tenant/"
        if(method == 'PUT'){
            url = url + config.name
        }
        headers.set('Authentication', $token);
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(config) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/organization/tenants')
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
            } else if (response.status == 409) {
                errorMessage= utils.getLabel('user_exists',labels,$language)
                dialog.showModal()
            } else {
                errorMessage = utils.getMessage(utils.FETCH_STATUS)
                    .replace('%1', response.status)
                    .replace('%2', response.statusText)
                dialog.showModal()
                //alert(
                //    utils.getMessage(utils.FETCH_STATUS)
                //        .replace('%1', response.status)
                //        .replace('%2', response.statusText)
                //)
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' ' + utils.getLabel('fetcherror_message', labels, $language)
            }
            console.log(error)
        });
    }

    function validate(cfg){
        return ""
    }

    let labels = {
        'title': {
            'pl': "Definicja klienta",
            'en': "Tenant definition"
        },
        'user_exists': {
            'pl': "Ten klient już istnieje",
            'en': "This tenant already exists"
        },
        'ok': {
            'pl': "OK",
            'en': "OK"
        }
    }

</script>