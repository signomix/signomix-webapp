<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
<div class="row">
    <div class="col-12">
        <h6>
            {utils.getLabel('tokens',labels, $language)}
        </h6>
        <p>Here you can manage your access tokens.</p>
    </div>
</div>
<div class="row">
    <div class="col-12">
        {#await promise}
            <p>loading...</p>
        {:then data}
            <pre>{data}</pre>
        {:catch error}
            <p>error: {error.message}</p>
        {/await}
    </div>
</div>

    <script>
        import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
        import { onMount } from 'svelte';
        import { goto } from '$app/navigation';
        import { utils } from '$lib/utils.js';

        onMount(async () => {
            if (!$isAuthenticated) {
                console.log('redirect to login');
                goto('/login');
            }
        });

        /* let promise = fetch('/api/auth/token?lifetime='+100, {
            method: 'POST',
            headers: {
                'Authentication': $token,
            }
        }).then(response => response.text()).then(data => {
            console.log(data);
            return data;
        }); */

        let promise = fetch('/api/auth/token', {
            method: 'GET',
            headers: {
                'Authentication': $token,
            }
        }).then(response => response.text()).then(data => {
            console.log(data);
            return data;
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