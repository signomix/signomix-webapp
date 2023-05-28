<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h4>{utils.getText('title',session.language, labels)}</h4>
</div>
<div class="col-12">
    {$page.status}: {$page.error.message}
</div>
<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';
    import { redirect } from '@sveltejs/kit';

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let labels = {
        'title': {
            'pl': "Błąd",
            'en': "Error"
        }
    }
</script>