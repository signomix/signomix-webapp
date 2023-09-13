<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
{#await data}
{:then data}
<OrganizationForm config={data} callback={saveSettings} readonly={true} />
{/await}
<script>
    import OrganizationForm from '$lib/components/OrganizationForm.svelte';
    import { profile,token, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    export let data

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('organization');
        }
    });
    function saveSettings(config){
        console.log("saveSettings: ",config);
    }
    let labels = {
        'title': {
            'pl': "Organizacja",
            'en': "Organization"
        }
    }
</script>