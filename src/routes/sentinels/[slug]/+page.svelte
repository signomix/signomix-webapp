<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5><a href="/sentinels/{data.sentinel.id}/edit" title="Edit"><i class="bi bi-gear h5 me-2 link-dark"></i></a>
</div>
{#await data}
{:then data}
<AlertForm config={data.sentinel} callback={saveSettings} editable=0/>
{/await}
<script>
    import AlertForm from '$lib/components/AlertForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('ALERTS',data);
        }
    });

    export let data;

    function saveSettings(config){
        console.log("saveSettings: ",config);
    }

    let labels = {
        'title': {
            'pl': "Ustawienia alarmu",
            'en': "Alert settings"
        }
    }

</script>