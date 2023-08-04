{#if !session.logged}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,session)}
</div>
{:else if session.authorized}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('pagetitle',labels,session)}</h5>
</div>
{#await promise}
{:then configs}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-1">#</th>
                        <th scope="col" class="col-4">{utils.getLabel('id',labels,session)}</th>
                        <th scope="col" class="col-5">{utils.getLabel('title',labels,session)}</th>
                        <th scope="col" class="col-2">{utils.getLabel('config',labels,session)}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each configs as config, index}
                    <tr>
                        <th scope="row" class="col-1">{offset+1+index}</th>
                        <td class="col-4"><a href="/dashboards/{config.id}">{config.id}</a></td>
                        <td class="col-5">{config.title}</td>
                        <td class="col-2">
                            <a href="/dashboards/{config.id}/edit"><i class="bi bi-pencil-square"></i></a>
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-2">
        <a class="btn btn-outline-primary" role="button" href="/dashboards/new/edit">{utils.getLabel('add',labels,session)}</a>
    </div>
    <div class="col-10">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true" class="px-2"> &laquo;</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+configs.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={configs.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true" class="px-2">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{/await}
{/if}
<script>
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { userSession } from '$lib/stores.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let session;
    userSession.subscribe(value => {
        session = value;
    })

    onMount(async () => {
        if(!session.logged || !session.authorized || session.login==''){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
        }
    });

    export let data
    let offset = 0
    let limit = 10

    let promise = getConfigs()

    async function getConfigs() {
        let configs = []
        if (!session.logged) {
            return configs
        }
        if (dev) {
            for (let i = 0; i < window.localStorage.length; i++) {
                configs.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))));
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/v2/dashboards"
            url = url + '?offset=' + offset + '&limit=' + limit
            headers.set('Authentication', session.token);
            await fetch(url, { headers: headers })
                .then((response) => {
                    if (response.status == 200) {
                        configs = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        utils.setAuthorized(session, false)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return configs;
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getConfigs()
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getConfigs();
    }
    function handleDoNothing(event) {
        console.log(event)
    }

    let labels = {
        'pagetitle': {
            'pl': "Pulpity",
            'en': "Dashboards"
        },
        'denied': {
            'pl': "Brak dostępu",
            'en': "Access denied"
        },
        'id': {
            'pl': "ID",
            'en': "ID"
        },
        'title': {
            'pl': "Tytuł",
            'en': "Title"
        },
        'config': {
            'pl': "Konfiguracja",
            'en': "Config"
        },
        'add': {
            'pl': "Dodaj",
            'en': "Add"
        }
    }
</script>