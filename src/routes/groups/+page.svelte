{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied', labels, $language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title', labels, $language)}</h5>
</div>
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
                        <th scope="col" class="col-8">{utils.getLabel('name', labels, $language)}</th>
                        <th scope="col" class="col-1">{utils.getLabel('action',labels,$language)}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each groups as config, index}
                    <tr>
                        <th scope="row" class="col-1">{offset+1+index}</th>
                        <td class="col-2"><a href="/groups/{config.eui}">{config.eui}</a></td>
                        <td class="col-8">{config.name}</td>
                        <td class="col-1">
                            <a href="/groups/{config.eui}/download"
                                    title={utils.getLabel('download',labels,$language)}><i
                                        class="bi bi-cloud-download me-2 link-dark"></i></a>
                            {#if (utils.isObjectAdmin($profile, config.userID, $defaultOrganizationId))}
                            <a href="/groups/{config.eui}/edit" title={utils.getLabel('configure',labels,$language)}><i class="bi bi-pencil-square me-2 link-dark"></i></a>
                            <a href="" on:click|preventDefault={deleteSelected(config.eui)} title={utils.getLabel('delete',labels,$language)}><i
                                class="bi bi-trash link-dark"></i></a>
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
        <a class="btn btn-outline-primary" role="button" href="/groups/new/edit">{utils.getLabel('add', labels, $language)}</a>
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

{/if}
<script>
    import { profile,token, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { defaultOrganizationId } from '$lib/stores.js';
    import { sgxdata } from '$lib/sgxdata.js';

    //export let data
    let offset = 0
    let limit = 20

    //let endpoint=utils.getBackendUrl(location) + "/api/core/group?offset=" + offset + "&limit=" + limit
    let promise = getGroups(offset)

    async function getGroups(offset) {
        let endpoint=utils.getBackendUrl(location) + "/api/core/group?offset=" + offset + "&limit=" + limit
        return sgxdata.getGroups(dev,endpoint,'',$token)
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

    function showUploadForm(eui) {
        return function (event) {
            event.preventDefault();
            console.log('show upload form', eui)
            alert('upload form not implemented')
        }
    }

    function deleteSelected(eui) {
        return function (event) {
            event.preventDefault();
            let confirmed = confirm(utils.getLabel('question_delete',labels,$language))
            if(!confirmed || dev) return
            
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/group/"+eui
            headers.set('Authentication', $token);
            promise = fetch(url,
                {
                    mode: 'cors',
                    method: 'DELETE',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                }).then(response => {
                    return getGroups(offset)
                }).catch((error) => {
                    console.log(error)
                });
        }
    }

    let labels = {
        'title': {
            'pl': "Grupy",
            'en': "Groups"
        },
        'name': {
            'pl': "Nazwa",
            'en': "Name"
        },
        'action': {
            'pl': "Akcje",
            'en': "Actions"
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
        },
        'configure': {
            'pl': "Konfiguruj",
            'en': "Configure"
        },
        'delete': {
            'pl': "Usuń",
            'en': "Delete"
        },
        'question_delete': {
            'pl': "Czy na pewno usunąć?",
            'en': "Are you sure to delete?"
        },
        'not_implemented': {
            'pl': "Funkcjonalność w przygotowaniu",
            'en': "Not implemented yet"
        }
    }

</script>