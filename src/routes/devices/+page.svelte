{#if !session.logged}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {text('denied')}
</div>
{:else if session.authorized}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{text('devices')}</h5>
</div>
{#await promise}
{:then devices}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-1">#</th>
                        <th scope="col" class="col-1"></th>
                        <th scope="col" class="col-2">EUI</th>
                        <th scope="col" class="col-6">{text('name')}</th>
                        <th scope="col" class="col-2">{text('type')}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each devices as config, index}
                    <tr>
                        <th scope="row" class="col-1">{offset+1+index}</th>
                        <td class="col-1">&nbsp;</td>
                        <td class="col-2"><a href="/devices/{config.eui}">{config.eui}</a></td>
                        <td class="col-6">{config.name}</td>
                        <td class="col-2">{config.type}</td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-2">
        <a class="btn btn-outline-primary" role="button" href="/devices/new/edit">{text('add')}</a>
    </div>
    <div class="col-10">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true"> &laquo; </span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+devices.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={devices.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true"> &raquo; </span>
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

    //export let data
    let offset = 0
    let limit = 10
    let session;
    userSession.subscribe(value => {
        session = value;
    });

    let promise = getDevices(offset)

    async function getDevices(actualOffset) {
        let devcs = []
        if (!session.logged) {
            return devcs
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                devcs.push(
                    {
                        id: (i + actualOffset + 1),
                        eui: '0000000000' + (i + actualOffset + 1),
                        name: 'device' + (i + actualOffset + 1),
                        type: 'GENERIC',
                        status: 'ACTIVE',
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    }
                )
            }
            console.log(devcs)
        } else {
            console.log(session)
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/device"
            url = url + '?offset=' + actualOffset + '&limit=' + limit + '&full=true'
            headers.set('Authentication', session.token);
            headers.set('Access-Control-Allow-Origin', '*');
            await fetch(url,
                {
                    mode: 'cors',
                    method: 'GET',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                })
                .then((response) => {
                    if (response.status == 200) {
                        devcs = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        utils.setAuthorized(session, false)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return devcs;
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getDevices(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getDevices(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }

    function text(name) {
        let labels = {
            'devices': {
                'pl': "Urządzenia",
                'en': "Devices"
            },
            'name': {
                'pl': "Nazwa",
                'en': "Name"
            },
            'type': {
                'pl': "Typ",
                'en': "Type"
            },
            'denied': {
                'pl': "Brak dostępu",
                'en': "Access denied"
            },
            'add': {
                'pl': "Dodaj",
                'en': "Add"
            }
        }
        return labels[name][session.language]
    }


</script>