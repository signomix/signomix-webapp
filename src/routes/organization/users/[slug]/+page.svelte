<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    {#await data}
    <h5>{utils.getLabel('title',labels, $language)}</h5>
    {:then data}
    <h5>{utils.getLabel('title',labels, $language)}</h5>
    {#if utils.isHigherAccountType($profile, data)}
    <a href="/organization/users/{data.uid}/edit" title="Edit"><i class="bi bi-gear h5 me-2 link-dark"></i></a>
    {/if}
    {/await}
</div>
{#await data}
{:then data}
<SettingsForm config={data} callback={saveSettings} readonly={true} backLocation="/organization/users"  setPassLocation="/organization/users/{data.uid}/password"/>
{/await}
<script>
    import SettingsForm from '$lib/components/SettingsForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';

    export let data;
    
    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        }
    });

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
    }

    let labels = {
        'title': {
            'pl': "Ustawienia konta",
            'en': "Account settings"
        }
    }

</script>