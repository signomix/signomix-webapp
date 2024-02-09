<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="row">
    <div class="col-12">
        <DownloadForm eui={slug} callback={goBack} type="group"/>
    </div>
</div>

<script>
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import DownloadForm from '$lib/components/DownloadForm.svelte';
    import { page } from '$app/stores';

    let slug = $page.params.slug;

    export let data
    let errorMessage = ''


    let previousPage = base;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
    function goBack() {
        goto("/groups");
    }

    

    

    let labels = {
        'failToFetch': {
            'pl': "Problem z połączeniem internetowym",
            'en': "Internet connection problem"
        },
        'view': {
            'pl': "Pokaż",
            'en': "View"
        },
        'title': {
            'pl': "Pobieranie danych",
            'en': "Download data"
        },
    }

</script>