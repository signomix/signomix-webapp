{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('accessdenied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5><a href="#" on:click|preventDefault={removeAll}><i class="bi bi-trash3 h5 link-dark"></i></a>
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
                        <th scope="col" class="col-2">Reguła</th>
                        <th scope="col" class="col-1">Poziom</th>
                        <th scope="col" class="col-2">Data</th>
                        <th scope="col" class="col-4">Wiadomość</th>
                        <th scope="col" class="col-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.list as alert, index}
                    <tr>
                        <td class="col-2">
                            <a href="/devices/{alert.deviceEui}">{alert.deviceEui}</a>
                        </td>
                        <td class="col-2">
                            {#if alert.sentinelConfigId>=0}
                            <a href="/sentinels/{alert.sentinelConfigId}">{alert.sentinelConfigId}</a>
                            {/if}    
                        </td>
                        <td class="col-1">{getLevelName(alert.level)}</td>
                        <td class="col-2">{new Date(alert.createdAt).toLocaleString()}</td>
                        <td class="col-4">{alert.messagePl}</td>
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
    import { invalidateAll } from '$app/navigation';
    import { sgxsentinel } from '../../lib/sgxsentinel.js';
    import { onMount } from 'svelte';

    let offset = 0
    let limit = 20

    let data=loadData()

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    })

    async function loadData(){
        return sgxsentinel.getSentinels(dev, utils.getBackendUrl(location)+'/api/signal', limit, offset, $token);
    }

    function remove(id) {
        return function () {
            if(dev){
                return
            }
            let url = utils.getBackendUrl(location) + "/api/signal/"+id
            //if (confirm('Czy na pewno chcesz usunąć ten alarm?')) {
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authentication': $token,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        console.log('OK')
                        data=loadData()
                    } else {
                        console.log('ERROR')
                    }
                })
            //}
        }
    }

    function removeAll(){
        if (confirm("Czy na pewno chcesz usunąć wszystkie alarmy?")) {
            console.log("remove all alerts")
            sendRemove("-1")
            offset = 0
            data=loadData()
        }
    }

    function sendRemove(id) {
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
                //goto('/notifications')
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
        offset = offset - limit
        if (offset < 0) offset = 0
        data=loadData()
    }

    function handleLoadNext() {
        offset = offset + limit;
        data=loadData()
    }

    function handleDoNothing() {
    }

    function getLevelName(level){
        switch(level){
            case 1:
                return 'info'
            case 2:
                return 'warning'
            case 3:
                return 'alert'
            case 4:
                return 'critical'
            case 5:
                return 'emergency'
            default:
                return 'info'
        }
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