<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<script>
    import { profile,token, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('applications');
        }
    });

    let labels = {
        'title': {
            'pl': "Klienci",
            'en': "Tenants"
        }
    }

</script>