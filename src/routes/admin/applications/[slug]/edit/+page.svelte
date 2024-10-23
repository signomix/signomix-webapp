<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{data.name}</h5>
    <!--{#if (utils.isObjectAdmin($profile, data.userID, $defaultOrganizationId))}-->
    {#if sgxhelper.hasObjectAccess($profile,true,1,data,'Device')}
    <a href="/admin/applications/{data.id}/edit" title={utils.getLabel('configure',labels,$language)}><i
        class="bi bi-gear h5 me-2 link-dark"></i></a>
    {/if}
</div>
{#await data}
{:then data}
{#if data!==undefined}
<ApplicationForm config={data} callback={saveSettings} readonly={false} />
{/if}
{/await}
<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { defaultOrganizationId } from '$lib/stores.js';
    import ApplicationForm from '$lib/components/ApplicationForm.svelte';
    import { sgxhelper } from '$lib/sgxhelper.js';

    export let data
    let errorMessage = ''

    onMount(async () => {
        if(!$isAuthenticated){  
            console.log('redirect to login');
            goto('/login');
        }
    });

    function saveSettings(config){
        console.log("saveSettings: ",config);
        /* errorMessage=validate(config)
        if(errorMessage!=''){
            dialog1.showModal()
            return
        } */
        const headers = new Headers()
        let method = config.newConfig ? 'POST' : 'PUT'
        let url = utils.getBackendUrl(location) + "/api/core/application/"
        if(method == 'PUT'){
            url = url + config.id
        }
        headers.set('Authentication', $token);
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(config) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/admin/applications')
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
            } else if (response.status == 409) {
                errorMessage= utils.getLabel('user_exists',labels,$language)
                //dialog1.showModal()
            } else {
                errorMessage = utils.getMessage(utils.FETCH_STATUS)
                    .replace('%1', response.status)
                    .replace('%2', response.statusText)
                cons
                //dialog1.showModal()
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

    let labels = {
        'configure': {
            'en': 'Configure',
            'pl': 'Konfiguruj'
        }
    }


</script>