<div>
    <h1>{config.metadata.title}</h1>
    {@html config.content}
</div>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

    export let config
    export let callback

    let labels = {
        'goback': {
            'pl': "Powrót",
            'en': "Go back"
        }
    }
</script>