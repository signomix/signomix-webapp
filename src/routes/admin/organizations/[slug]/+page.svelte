<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{data.name}</h5>
    <!--{#if (utils.isObjectAdmin($profile, data.userID, $defaultOrganizationId))}-->
    <a href="/admin/organizations/{data.id}/edit" title={utils.getLabel('configure',labels,$language)}><i
        class="bi bi-gear h5 me-2 link-dark"></i></a>
</div>
{#await data}
{:then data}
{#if data!==undefined}
<OrganizationForm config={data} callback={saveSettings} readonly={true} />
{/if}
{/await}
<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import OrganizationForm from '$lib/components/OrganizationForm.svelte';

    export let data
    let errorMessage = ''

    onMount(async () => {
        if(!$isAuthenticated){  
            console.log('redirect to login');
            goto('/login');
        }
    });

    function saveSettings(config){

    }

    let labels = {
        'configure': {
            'en': 'Configure',
            'pl': 'Konfiguruj'
        }
    }


</script>