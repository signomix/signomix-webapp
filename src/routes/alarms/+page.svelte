{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('accessdenied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
{/if}

{#await data}
{:then data}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-2">Źródło</th>
                        <th scope="col" class="col-1">Poziom</th>
                        <th scope="col" class="col-2">Data</th>
                        <th scope="col" class="col-6">Wiadomość</th>
                        <th scope="col" class="col-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.list as alert, index}
                    <tr>
                        <td class="col-2">{alert.deviceEui}</td>
                        <td class="col-1">{alert.level}</td>
                        <td class="col-2">{new Date(alert.createdAt).toLocaleString()}</td>
                        <td class="col-6">{alert.messagePl}</td>
                        <td class="col-1"><a href="#" on:click|preventDefault={remove(alert.id)}><i class="bi bi-trash3 link-dark"></i></a></td>
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
                        {offset+1}-{offset+data.list.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={data.list.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true" class="px-2">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{:catch error}
{/await}

<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';

    export let data

    let offset = 0
    let limit = 10

    function removeAlert(id) {
        if(dev){
            return
        }
        const headers = new Headers()
        let method = 'DELETE'
        let url = utils.getBackendUrl(location) + "/api/signal/" + id
        headers.set('Authentication', $token);
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
            }
            console.log(error)
        });
    }

    function handleLoadPrevious() {
    }

    function handleLoadNext() {
    }

    function handleDoNothing() {
    }

    let labels = {
        'title': {
            'pl': "Alarmy",
            'en': "Alarms",
        },
        'accessdenied': {
            'pl': "Brak dostępu",
            'en': "Access denied",
        },
    }
</script>