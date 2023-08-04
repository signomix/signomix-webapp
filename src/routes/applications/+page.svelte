<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,session)}</h5>
</div>
<div class="col-12">
    TODO
</div>
<script>
    import { utils } from '$lib/utils.js';
    import { userSession } from '$lib/stores.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let session;
    userSession.subscribe(value => {
        session = value;
    })

    onMount(async () => {
        if(!session.logged || !session.authorized || session.login==''){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        }
    });

    let labels = {
        'title': {
            'pl': "Aplikacje",
            'en': "Applications"
        }
    }
</script>