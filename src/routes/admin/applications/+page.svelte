<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>applications</h5>
</div>
<div class="col-12">
    TODO
</div>
<script>
    import { utils } from '$lib/utils.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(async () => {
/*         if(!session.user.logged || !session.user.authorized || session.user.login==''){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        } */
    });

    let labels = {
        'title': {
            'pl': "Aplikacje",
            'en': "Applications"
        }
    }
</script>