<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>Ustawienia</h5><a href="/account/settings" title="View"><i class="bi bi-eye h5 me-2 link-dark"></i></a>
</div>

{#await data}
{:then data}
<SettingsForm config={data} callback={saveSettings} readonly={false} backLocation="/account/settings"  setPassLocation="/account/settings/password"/>
{/await}
<script>
    import SettingsForm from '$lib/components/SettingsForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        }
    });

    export let data;

    function getChannelType(config){
        if(config.startsWith("SIGNOMIX")){
            return "Application";
        }else if(config.startsWith("SMTP")){
            return "Email";
        }else if(config.startsWith("SMS")){
            return "SMS";
        }else if(config.startsWith("WEBHOOK")){
            return "Webhook";
        }else{
            return "Unknown";
        }
    }

    function getChannelConfig(config){
        console.log("config: ",config);
        if(config.indexOf(":")>0){
            return config.substring(config.indexOf(":")+1);
        }else{
            return "";
        }
    }

    function saveSettings(config){
        console.log("saveSettings: ",config);
        const headers = new Headers()
        let url = utils.getBackendUrl(location) + "/api/account/user/"+config.uid
        //if (!(data.id === 'new' || data.id == null || data.id == '' || data.id == undefined)) {
        //    url = url + data.id
        //    method = 'PUT'
        //}
        config.password = null
        config.preferredLanguage = config.preferredLanguage.toLowerCase()
        headers.set('Authentication', $token);
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: 'PUT', mode: 'cors', headers: headers, body: JSON.stringify(config) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/settings')
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
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
    }

</script>