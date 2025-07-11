<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>about</h5>
</div>
<div class="col-12">
    
</div>
<script>
    //log the current route
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    console.log('Current route:', $page.url.pathname);
    let labels = {
        'about': {
            'pl': "O aplikacji",
            'en': "About"
        },
        'description': {
            'pl': "Opis aplikacji ...",
            'en': "Application description ..."
        }
    }
</script>