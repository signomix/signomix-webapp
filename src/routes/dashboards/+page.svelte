{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('pagetitle',labels,$language)}</h5>
</div>
{#await promise}
{:then configs}
<div class="component">
    <div class="row">
        {#if !utils.isUserRole($profile, 'limited', true)}
        <div class="col-1">
            <label class="col-form-label">Filtruj:</label>
        </div>
        <div class="col-4">
            <input type="text" bind:value={idFilter} on:input={idChanged} class="form-control mb-2" aria-label="Search EUI">
        </div>
        <div class="col-5">
            <input type="text" bind:value={titleFilter} on:input={titleChanged} class="form-control mb-2" aria-label="Search name">
        </div>
        <div class="col-1">
            <button on:click={handleSearch} class="btn btn-outline-secondary mb-2" type="button">Szukaj</button>
        </div>
        <div class="col-1"></div>
        {:else}
        <div class="col-1">
            <label class="col-form-label">Filtruj:</label>
        </div>
        <div class="col-9">
            <input type="text" bind:value={titleFilter} on:input={titleChanged} class="form-control mb-2" aria-label="Search name">
        </div>
        <div class="col-1">
            <button on:click={handleSearch} class="btn btn-outline-secondary mb-2" type="button">Szukaj</button>
        </div>
        <div class="col-1"></div>
        {/if}
    </div>
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table">
                    <thead class="table-light">
                        {#if !utils.isUserRole($profile, 'limited', true)}
                        <tr>
                            <th scope="col" class="col-1">#</th>
                            <th scope="col" class="col-4">{utils.getLabel('id',labels,$language)}</th>
                            <th scope="col" class="col-5">{utils.getLabel('title',labels,$language)}</th>
                            <th scope="col" class="col-2">{utils.getLabel('action',labels,$language)}</th>
                        </tr>
                        {:else}
                        <tr>
                            <th scope="col" class="col-1">#</th>
                            <th scope="col" class="col-9">{utils.getLabel('title',labels,$language)}</th>
                            <th scope="col" class="col-2">{utils.getLabel('action',labels,$language)}</th>
                        </tr>
                        {/if}
                    </thead>
                    <tbody>
                        {#each configs as config, index}
                        {#if !utils.isUserRole($profile, 'limited', true)}
                        <tr>
                            <th scope="row" class="col-1">{offset+1+index}</th>
                            <td class="col-4"><a href="/dashboards/{config.id}">{config.id}</a></td>
                            <td class="col-5"><a href="/dashboards/{config.id}">{config.title}</a></td>
                            <td class="col-2">
                                <a href="/dashboards/{config.id}/copy"><i class="bi bi-copy link-dark"></i></a>
                                {#if (utils.isObjectAdmin($profile, config.userID, $defaultOrganizationId, config.administrators, config.team)  && !utils.isUserRole($profile, 'limited', false))}
                                <a href="/dashboards/{config.id}/edit"><i
                                        class="bi bi-pencil-square ms-2 link-dark"></i></a>
                                <a href="" on:click|preventDefault={deleteSelected(config.id)}
                                    title={utils.getLabel('delete',labels,$language)}><i
                                        class="bi bi-trash link-dark"></i></a>
                                {/if}
                                {#if config.favourite}
                                <a href="" on:click|preventDefault={toggleFav(config.id,false)}><i
                                        class="bi bi-star-fill ms-2 text-warning"></i></a>
                                {:else}
                                <a href="" on:click|preventDefault={toggleFav(config.id,true)}><i
                                        class="bi bi-star ms-2 link-dark"></i></a>
                                {/if}
                            </td>
                        </tr>
                        {:else}
                        <tr>
                            <th scope="row" class="col-1">{offset+1+index}</th>
                            <td class="col-9"><a href="/dashboards/{config.id}">{config.title}</a></td>
                            <td class="col-2">
                                {#if config.favourite}
                                <a href="" on:click|preventDefault={toggleFav(config.id,false)}><i
                                        class="bi bi-star-fill ms-2 text-warning"></i></a>
                                {:else}
                                <a href="" on:click|preventDefault={toggleFav(config.id,true)}><i
                                        class="bi bi-star ms-2 link-dark"></i></a>
                                {/if}
                            </td>
                        </tr>
                        {/if}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-2">
            {#if !utils.isUserRole($profile, 'limited', true)}
            <a class="btn btn-outline-primary" role="button"
                href="/dashboards/new/edit">{utils.getLabel('add',labels,$language)}</a>
            {/if}
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
</div>
{/await}
{/if}
<script>
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { defaultOrganizationId } from '$lib/stores.js';

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });

    let offset = 0
    let limit = 20
    let idFilter = ''
    let titleFilter = ''

    let promise = getConfigs()

    async function getConfigs() {
        let configs = []
        if (!$isAuthenticated) {
            return configs
        }
        if (dev) {
            for (let i = 0; i < window.localStorage.length; i++) {
                configs.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))));
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/v2/dashboards"
            url = url + '?offset=' + offset + '&limit=' + limit + '&shared=true'
            if (idFilter.length > 0) {
                url = url + '&search=id:' + idFilter
            }else if (titleFilter.length > 0) {
                url = url + '&search=title:' + titleFilter
            }
            headers.set('Authentication', $token);
            await fetch(url, { headers: headers })
                .then((response) => {
                    if (response.status == 200) {
                        configs = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        token.set(null)
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
        //console.log(event)
    }
    function handleSearch(event) {
        //console.log('handleSearch', event)
        promise = getConfigs(offset);
    }
    function idChanged(event) {
        //console.log('idChanged', event)
        titleFilter = ''
    }
    function titleChanged(event) {
        //console.log('titleChanged', event)
        idFilter = ''
    }

    function toggleFav(id, favourite) {
        return function (event) {
            event.preventDefault();
            //console.log('toggle fav', id, favourite)
            let headers = new Headers();
            headers.set('Authentication', $token);
            promise = fetch(utils.getBackendUrl(location) + '/api/core/favourite/dashboards/' + id, { headers: headers, method: favourite ? 'POST' : 'DELETE' })
                .then(response => response.text()) // pass the data as promise to next then block
                .then(data => {
                    return getConfigs()
                })
                //.then(response => response.json())
                .catch(err => {
                    console.error('Request failed', err)
                })
        }
    }

    function deleteSelected(id) {
        return function (event) {
            event.preventDefault();
            let confirmed = confirm(utils.getLabel('question_delete', labels, $language))
            if (!confirmed || dev) return

            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/v2/dashboards/" + id
            headers.set('Authentication', $token);
            promise = fetch(url,
                {
                    mode: 'cors',
                    method: 'DELETE',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                }).then(response => {
                    return getConfigs()
                }).catch((error) => {
                    console.log(error)
                });
        }
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
        'action': {
            'pl': "Akcje",
            'en': "Actions"
        },
        'add': {
            'pl': "Dodaj",
            'en': "Add"
        },
        'delete': {
            'pl': "Usuń",
            'en': "Delete"
        },
        'question_delete': {
            'pl': "Czy na pewno usunąć?",
            'en': "Are you sure to delete?"
        }
    }
</script>