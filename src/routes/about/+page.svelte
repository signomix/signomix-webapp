<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{text('about')}</h1>
</div>
<div class="col-12">
    {text('description')}
</div>
<script>
    import { userSession } from '$lib/stores.js';
    let session;
    userSession.subscribe(value => {
        session = value;
    });
    function text(name) {
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
        return labels[name][session.language]
    }
</script>