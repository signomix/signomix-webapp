<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('about',labels,session)}</h5>
</div>
<div class="col-12">
    {utils.getLabel('description',labels,session)}
</div>
<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    let session;
    userSession.subscribe(value => {
        session = value;
    });
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