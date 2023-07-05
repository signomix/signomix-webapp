{#if !session.logged}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    Brak dostępu
</div>
{:else if session.authorized}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>Powiadomienia</h5><i class="bi bi-trash3 h5"></i>
</div>
{#await promise}
{:then alerts}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-1">Typ</th>
                        <th scope="col" class="col-2">Źródło</th>
                        <th scope="col" class="col-2">Data</th>
                        <th scope="col" class="col-6">Wiadomość</th>
                        <th scope="col" class="col-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each alerts as alert, index}
                    <tr>
                        <td class="col-1">{alert.type}</td>
                        <td class="col-2">{alert.deviceEUI}</td>
                        <td class="col-2">{alert.createdAt}</td>
                        <td class="col-6">{alert.payload}</td>
                        <td class="col-1"><i class="bi bi-trash3"></i></td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true" class="px-2"> &laquo;</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+alerts.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={alerts.length<limit} on:click={handleLoadNext}>
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
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';

    export let data
    let offset = 0
    let limit = 20
    let session;
    userSession.subscribe(value => {
        session = value;
        if (!session.logged) {
            try {
                if (window.localStorage.getItem('sgx.session.token') != null) {
                    session.token = window.localStorage.getItem('sgx.session.token')
                    session.logged = true
                    session.authorized = true
                }
            } catch (error) {
                console.log(error)
            }
        }
    });

    let promise = getAlerts()

    async function getAlerts() {
        let alerts = []
        if (!session.logged) {
            return alerts
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                alerts.push(
                    {
                        "userID": "greg",
                        "deviceEUI": "00033728193A26DB",
                        "id": 8402,
                        "name": null,
                        "category": "IOT",
                        "type": "WARNING",
                        "origin": "greg\t00033728193A26DB",
                        "payload": "konieczny restart smogometru",
                        "timePoint": "",
                        "calculatedTimePoint": 0,
                        "createdAt": 1688552050220,
                        "serviceId": "",
                        "serviceUuid": {
                            "mostSigBits": 0,
                            "leastSigBits": 0
                        },
                        "rootEventId": -1,
                        "request": null,
                        "cyclic": false,
                        "iamtheroot": true
                    }
                )
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/alert/"
            url = url + '?offset=' + offset + '&limit=' + limit
            headers.set('Authentication', session.token);
            await fetch(url, { headers: headers })
                .then((response) => {
                    if (response.status == 200) {
                        alerts = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        utils.setAuthorized(session, false)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return alerts;
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getAlerts()
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getAlerts();
    }
    function handleDoNothing(event) {
        console.log(event)
    }


</script>