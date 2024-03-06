<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="col-12">
    <h3>{$page.status}: {$page.error.message}</h3>
</div>
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';
    let labels = {
        'title': {
            'pl': "Błąd",
            'en': "Error"
        }
    }
</script>