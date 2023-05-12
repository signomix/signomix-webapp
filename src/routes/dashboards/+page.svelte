{#if !session.logged}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    Brak dostępu
</div>
{:else if session.authorized}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h2>Pulpity</h2>
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
                        <th scope="col" class="col-1">ID</th>
                        <th scope="col" class="col-5">Opis</th>
                        <th scope="col" class="col-4">Data aktualizacji</th>
                        <th scope="col" class="col-1">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {#each configs as config, index}
                    <tr>
                        <th scope="row" class="col-1">{offset+1+index}</th>
                        <td class="col-1">{config.id}</td>
                        <td class="col-5">{config.description.substring(0,20)}</td>
                        <td class="col-4">{utils.getLocalDateFormat(config.updated)}</td>
                        <td class="col-1">
                            <a href="/dashboards/{config.id}"><i class="bi bi-eye me-2"></i></a>
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
        <a class="btn btn-outline-primary" role="button" href="/dashboards/new/edit">Dodaj</a>
    </div>
    <div class="col-10">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true"> &laquo; poprzednie {limit}</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+configs.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={configs.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true">kolejne {limit} &raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{/await}
{/if}
<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';

    export let data
    let offset = 0
    let limit = 10
    let session;
    userSession.subscribe(value => {
        session = value;
    });

    let promise = getConfigs()

    async function getConfigs() {
        let configs = []
        if (!session.logged) {
            return configs
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                configs.push(
                    {
                        id: (i + offset + 1),
                        name: 'My Dasboard ' + (i + offset + 1),
                        description: 'Dasboard description ' + (i + offset + 1),
                        widgets: [
                            {id: 0, title: 'widget 0', description: 'sample widget', width: 1, height: 1},
                            {id: 1, title: 'widget 1',description: 'sample widget', width: 1, height: 1},
                        ],
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    }
                )
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/dashboards"
            url = url + '?offset=' + offset + '&limit=' + limit
            headers.set('Authorization', 'Basic ' + btoa(session.login + ":" + session.password));
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

    function handleMeterConfigSelected(event) {
        console.log(event)
        deviceTabActive = false
    }
    function handleDeviceConfigSelected(event) {
        getConfigs()
        deviceTabActive = true
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        getConfigs()
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        getConfigs();
    }
    function handleDoNothing(event) {
        console.log(event)
    }


</script>