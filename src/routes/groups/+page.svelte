{#if !session.logged}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {text('denied')}
</div>
{:else if session.authorized}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{text('groups')}</h5>
</div>
<div class="row">
    <div class="col-12">
        Not implemented yet
    </div>
</div>
<!--
{#await promise}
{:then groups}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-1">#</th>
                        <th scope="col" class="col-2">EUI</th>
                        <th scope="col" class="col-9">{text('name')}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each groups as config, index}
                    <tr>
                        <th scope="row" class="col-1">{offset+1+index}</th>
                        <td class="col-3"><a href="/groups/{config.EUI}">{config.EUI}</a></td>
                        <td class="col-9">{config.name}</td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-2">
        <a class="btn btn-outline-primary" role="button" href="/groups/new/edit">{text('add')}</a>
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
                        {offset+1}-{offset+groups.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={groups.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true"> &raquo; </span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{/await}
-->
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

    let promise = getGroups(offset)

    async function getGroups(actualOffset) {
        let groups = []
        if (!session.logged) {
            return groups
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                groups.push(
                    {
                        EUI: '0000000000' + (i + actualOffset + 1),
                        name: 'group' + (i + actualOffset + 1),
                        userID: 'tester1',
                        team: ',',
                        administrators: ',',
                        description: '',
                        open: false,
                        organization: 0,
                        channels: {
                            temperature: {
                                name: 'temperature',
                                type: null
                            },
                        }
                    }
                )
            }
            console.log(groups)
        } else {
            console.log(session)
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/iot/group"
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
                        groups = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        utils.setAuthorized(session, false)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return groups;
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getGroups(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getGroups(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }

    function text(name) {
        let labels = {
            'groups': {
                'pl': "Grupy",
                'en': "Groups"
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