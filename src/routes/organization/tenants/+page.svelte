{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
{#await promise}
{:then tenants}
<div class="component">
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="col-1">#</th>
                            <th scope="col" class="col-6">{utils.getLabel('name',labels,$language)}</th>
                            <th scope="col" class="col-3">{utils.getLabel('path',labels,$language)}</th>
                            <th scope="col" class="col-2 text-end">{utils.getLabel('actions',labels,$language)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each tenants as config, index}
                        <tr>
                            <th scope="row" class="col-1">{offset+1+index}</th>
                            <td class="col-6">{config.name}<!--<a href="/organization/tenants/{config.id}">{config.name}</a>--></td>
                            <td class="col-3">{config.root}</td>
                            <td class="col-2 text-end">
                                {#if $context==config.id}
                                <a href="" on:click|preventDefault={setContext(null,'')}
                                    title={utils.getLabel('removecontext',labels,$language)}><i class="bi bi-box-arrow-left"></i></a>
                                {:else}
                                <a href="" on:click|preventDefault={setContext(config.id,config.root)}
                                    title={utils.getLabel('setcontext',labels,$language)}><i
                                        class="bi bi-box-arrow-right"></i></a>
                                {/if}
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
            <a class="btn btn-outline-primary" role="button"
                href="/organization/tenants/new/edit">{utils.getLabel('add',labels,$language)}</a>
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
                            {offset+1}-{offset+tenants.length}
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" class:disabled={tenants.length<limit} on:click={handleLoadNext}>
                            <span aria-hidden="true"> &raquo; </span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>
{/await}
{/if}
<script>
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    //import { dialogs } from "svelte-dialogs";

    //export let data
    let offset = 0
    let limit = 12
    let loginFilter = ''
    let nameFilter = ''
    let pathFilter = ''
    let showFilter = false

    let promise = getTenants(offset)

    onMount(async () => {
        if (!$isAuthenticated) {
            goto('/login');
        }
    });

    async function getTenants(actualOffset) {
        let devcs = []
        if (!$isAuthenticated) {
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
            let headers = new Headers();

            let url = utils.getBackendUrl(location) + "/api/tenant"
            url = url + '?offset=' + actualOffset + '&limit=' + limit + '&organization=' + $profile.organization
            if ($profile.tenant != null && $profile.tenant > 0) {
                url = url + '&tenant=' + $profile.tenant
            }

            if (loginFilter.length > 0) {
                url = url + '&search=login:' + loginFilter
                offset = 0
            } else if (nameFilter.length > 0) {
                url = url + '&search=name:' + nameFilter
                offset = 0
            } else if (pathFilter.length > 0) {
                url = url + '&search=path:' + pathFilter
                offset = 0
            }
            headers.set('Authentication', $token);
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
                        token.set(null)
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
        promise = getTenants(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getTenants(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }
    function setContext(tenant, root) {
        return function (event) {
            event.preventDefault();
            context.set(tenant)
            contextRoot.set(root)
            goto('/organization/tenants')
        }
    }



    let labels = {
        'title': {
            'pl': "Klienci",
            'en': "Tenants"
        },
        'name': {
            'pl': "Nazwa",
            'en': "Name"
        },
        'path': {
            'en': "Path root",
            'pl': "Start ścieżki"
        },
        'denied': {
            'pl': "Brak dostępu",
            'en': "Access denied"
        },
        'add': {
            'pl': "Dodaj",
            'en': "Add"
        },
        'actions': {
            'pl': "Akcje",
            'en': "Actions"
        },
        'configure': {
            'pl': "Konfiguruj",
            'en': "Configure"
        },
        'copy': {
            'pl': "Kopiuj",
            'en': "Copy"
        },
        'delete': {
            'pl': "Usuń",
            'en': "Delete"
        },
        'setcontext': {
            'pl': "Ustaw kontekst",
            'en': "Set context"
        },
        'removecontext': {
            'pl': "Usuń kontekst",
            'en': "Remove context"
        }

    }

</script>