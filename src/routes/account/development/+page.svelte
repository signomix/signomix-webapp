<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
<script>
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

    let labels = {
        'tokens': {
            'en': "Access tokens",
            'pl': "Tokeny dostępu"
        },
        'title': {
            'en': "Developer settings",
            'pl': "Ustawienia deweloperskie"
        },
    }
</script>