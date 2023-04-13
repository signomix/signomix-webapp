<p>{text('info')}</p>
<script>
    import { userSession } from '$lib/stores.js';
    let session;
    userSession.subscribe(value => {
        session = value;
    });
    function text(name) {
        let labels = {
            'info': {
                'pl': "Tu będzie strona startowa",
                'en': "This will be the home page"
            }
        }
        return labels[name][session.language]
    }
</script>