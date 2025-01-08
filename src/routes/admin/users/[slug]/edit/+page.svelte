<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    {#await data}
    <h5>{utils.getLabel('title',labels, $language)}</h5><i class="bi bi-eye h5 me-2 link-dark"></i>
    {:then data}
    <h5>{utils.getLabel('title',labels, $language)}</h5><a href="/admin/users/{data.uid}" title="View"><i class="bi bi-eye h5 me-2 link-dark"></i></a>
    {/await}
</div>
<Dialog title="Uwaga!" message={errorMessage} bind:dialog1 callback={closeDialog} 
labels={[utils.getLabel('ok',labels, $language)]} color="danger">
</Dialog>
{#await data}
{:then data}
<SettingsForm config={data} callback={saveSettings} readonly={false} backLocation="/admin/users"  setPassLocation="/admin/users/{data.uid}/password"/>
{/await}
<script>
    import SettingsForm from '$lib/components/SettingsForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import  Dialog  from '$lib/components/Dialog.svelte';

    let errorMessage = '';
    export let data;

    let dialog1

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
        dialog1.close()
    }

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
                goto('/admin/users')
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

    function validate(cfg) {
        if (isNaN(cfg.phone)) {
            if (cfg.phone.startsWith("+") || cfg.phone.startsWith("0") || cfg.phone.length > 9 || cfg.phone.length == 0) {
                return utils.getLabel('invalid_phone', labels, $language)
            }
        } else {
            if (cfg.phone > 999999999) {
                return utils.getLabel('invalid_phone', labels, $language)
            }
        }
        if(cfg.phonePrefix!=null&&cfg.phonePrefix.length>0){
            if(cfg.phonePrefix.charCodeAt(0)!=43){
                cfg.phonePrefix = "+" + cfg.phonePrefix;
            }
            if(isNaN(cfg.phonePrefix)&&cfg.phonePrefix.length>0){
                return utils.getLabel('invalid_phonePrefix', labels, $language)
            }
        }
        return ""
    }

    let labels = {
        'title': {
            'pl': "Ustawienia konta",
            'en': "Account settings"
        },
        'user_exists': {
            'pl': "Podany login użytkownika już jest zajęty",
            'en': "The user login is already taken"
        },
        'invalid_phone': {
            'pl': "Nieprawidłowy numer telefonu",
            'en': "Invalid phone number"
        },
        'invalid_phonePrefix': {
            'pl': "Nieprawidłowy prefix numeru telefonu",
            'en': "Invalid phone prefix"
        },
        'ok': {
            'pl': "OK",
            'en': "OK"
        }
    }

</script>