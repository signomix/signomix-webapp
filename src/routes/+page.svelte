{#if !$isAuthenticated}
<div class="alert  w-100 mt-2 text-center" role="alert">
    {utils.getLabel('notlogged',labels,$language)}
</div>
{:else}
{#await promise}
{:then dashboards}
<div class="row mt-4">
    <div class="col-12">
        <h5>{utils.getLabel('favourite',labels,$language)}</h5>
        <ul>
            {#if dashboards.length == 0}
            <li class="list-group-item">{utils.getLabel('nofav',labels,$language)}</li>
            {:else}
            {#each dashboards as dashboard}
            <li class="list-group-item"><i class="bi bi-star-fill me-2 text-warning"></i><a href="/dashboards/{dashboard.id}">{dashboard.title}</a></li>
            {/each}
            {/if}
        </ul>
    </div>
</div>
{/await}
<div class="row mt-4">
    <div class="col-12">
        <hr>
        <p>{utils.getLabel('info',labels,$language)}<br>
        <p>{utils.getLabel('info2',labels,$language)}</p>
    </div>
</div>
{/if}
<script>
    import { profile,token, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { browser, dev } from '$app/environment'
    import { redirects } from '$lib/redirects.js';

    let promise = getConfigs()

    async function getConfigs() {
        let configs = []
        if(!$isAuthenticated) return configs
        if (dev) {
            return [
                {
                    "uid": "1",
                    "title": "Test 1"
                },
                {
                    "uid": "2",
                    "title": "Test 2"
                }
            ]
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/favourite/dashboards?offset=0&limit=100"
            headers.set('Authentication', $token);
            await fetch(url, { headers: headers })
                .then((response) => {
                    if (response.status == 200) {
                        configs = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return configs;
    }

    redirects.handleOriginalUri();

    let alertMessage = "HTTP-Error: %1 %2"

    let labels = {
        'notlogged': {
            'pl': "Proszę się zalogować",
            'en': "Please log in"
        },
        'nofav': {
            'pl': "W tym miejscu pojawią się ulubione pulpity",
            'en': "Favorite dashboards will appear here"
        },
        'favourite': {
            'pl': "Ulubione pulpity",
            'en': "Favorite dashboards"
        },
        'info': {
            'pl': "To jest prototyp nowej webaplikacji Signomiksa. Niektóre funkcjonalności mogą nie działać prawidłowo lub nie działać wcale. Wszystko może się zmienić w przyszłości.",
            'en': "This is prototype of the new Signomix web application. Some features may not work properly or not work at all. Everything may change in the future."
        },
        'info2': {
            'pl': "",
            'en': ""
        }
    }

</script>