<div class="container mt-5 w-75 text-center">
    <h6 class="mb-4">{utils.getLabel('info',labels,session)}</h6>
    <h2>{utils.getLabel('info2',labels,session)}</h2>
</div>
<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { browser } from '$app/environment'
    import { redirects } from '$lib/redirects.js';

    redirects.handleOriginalUri();
    
    let session;
    userSession.subscribe(value => {
        session = value;
        if (!session.logged) {
            try {
                if (browser) {
                    if (window.localStorage.getItem('sgx.session.token') != null) {
                        session.token = window.localStorage.getItem('sgx.session.token')
                        session.logged = true
                        session.authorized = true
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    });
    let labels = {
        'info': {
            'pl': "To jest prototyp nowej webaplikacji Signomiksa. Niektóre funkcjonalności mogą nie działać prawidłowo lub nie działać wcale. Wszystko może się zmienić w przyszłości.",
            'en': "This is the prototype of the new Signomix web application. Some features may not work properly or not work at all. Everything may change in the future."
        },
        'info2': {
            'pl': "Używasz tej aplikacji na własne ryzyko",
            'en': "You use this app at your own risk"
        }
    }
</script>