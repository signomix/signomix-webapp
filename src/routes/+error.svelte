<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,session)}</h5>
</div>
<div class="col-12">
    <h3>{$page.status}: {$page.error.message}</h3>
</div>
<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';

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