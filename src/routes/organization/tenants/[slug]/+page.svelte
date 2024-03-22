<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    {#await data}
    <h5>{utils.getLabel('title',labels, $language)}</h5>
    {:then data}
    <h5>{utils.getLabel('title',labels, $language)}</h5>
    {#if utils.isHigherAccountType($profile, data)}
    <a href="/organization/tenants/{data.uid}/edit" title="Edit"><i class="bi bi-gear h5 me-2 link-dark"></i></a>
    {/if}
    {/await}
</div>
{#await data}
{:then data}
<TenantForm config={data} callback={saveSettings} readonly={true} />
{/await}
<script>
    import TenantForm from '$lib/components/TenantForm.svelte';
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


    function saveSettings(config){
    }

    let labels = {
        'title': {
            'pl': "Definicja klienta",
            'en': "Tenant definition"
        }
    }

</script>