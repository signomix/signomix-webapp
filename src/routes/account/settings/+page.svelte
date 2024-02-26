<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5><a href="/account/settings/edit" title="Edit"><i class="bi bi-gear h5 me-2 link-dark"></i></a>
</div>
{#await data}
{:then data}
<SettingsForm config={data} callback={saveSettings} readonly={true} backLocation="/account/settings"  setPassLocation="/account/settings/password"/>
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
        /*
        let data = {
            "uid": data.settings.uid,
            "settings": config
        }
        console.log("data: ",data);
        fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong');
            }
        }).then(data => {
            console.log(data);
            if(data.status=="OK"){
                alert("Zapisano ustawienia");
            }else{
                alert("Błąd zapisu ustawień");
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
        */
    }

    let labels = {
        'title': {
            'pl': "Ustawienia konta",
            'en': "Account settings"
        }
    }

</script>