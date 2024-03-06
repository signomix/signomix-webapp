{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
    {#if nameFilter.length>0 || loginFilter.length>0 || pathFilter.length>0}
    <a title={utils.getLabel('filter',labels,$language)} on:click|preventDefault={switchFilter}>
        <i class="bi bi-funnel-fill h5 me-2 link-dark"></i>
    </a>
    {:else}
    <a title={utils.getLabel('filter',labels,$language)} on:click|preventDefault={switchFilter}>
        <i class="bi bi-funnel h5 me-2 link-dark"></i>
    </a>
    {/if}
</div>
{#await promise}
{:then users}
<div class="component">
    {#if showFilter}
    <div class="row">
        <div class="col-md-6">
            <label class="col-form-label" for="input-eui">Login:</label>
            <input type="text" id="input-eui" bind:value={loginFilter} on:input={loginFilterChanged} class="form-control mb-2"
                aria-label="Search login">
        </div>
        <div class="col-md-6">
            <label class="col-form-label" for="input-name">Nazwa:</label>
            <input type="text" id="input-name" bind:value={nameFilter} on:input={nameChanged} class="form-control mb-2"
                aria-label="Search name">
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <label class="col-form-label" for="input-pathFilter">Path:</label>
            <input type="text" id="input-pathFilter" bind:value={pathFilter} on:input={pathFilterChanged} class="form-control mb-2"
                aria-label="Search tag name">
        </div>
        <div class="col-md-6">
            <label class="col-form-label" for="input-tenantName">REMOVE:</label>
            <input type="text" id="input-tenantName" class="form-control mb-2"
                aria-label="Search name">
        </div>
    </div>
    <div class="row">
        <div class="col">
            <button on:click={handleSearch} class="btn btn-outline-primary mb-2" type="button">Szukaj</button>
            <button on:click={handleClearFilter} class="btn btn-outline-secondary mb-2" type="button">Wyczyść</button>
        </div>
    </div>
    {/if}
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="col-1">#</th>
                            <th scope="col" class="col-2">Login</th>
                            <th scope="col" class="col-6">{utils.getLabel('name',labels,$language)}</th>
                            <th scope="col" class="col-1">{utils.getLabel('type',labels,$language)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as config, index}
                        <tr>
                            <th scope="row" class="col-1">{offset+1+index}</th>
                            {#if isAuthorized($profile,config)}
                            <td class="col-2"><a href="/organization/users/{config.uid}">{config.uid}</a></td>
                            {:else}
                            <td class="col-2">{config.uid}</td>
                            {/if}
                            <td class="col-6">{config.name} {config.surname}</td>
                            <td class="col-1">{config.type}</td>
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
                href="/organization/users/new/edit">{utils.getLabel('add',labels,$language)}</a>
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
                            {offset+1}-{offset+users.length}
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" class:disabled={users.length<limit} on:click={handleLoadNext}>
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

    let promise = getUsers(offset)

    onMount(async () => {
        if (!$isAuthenticated) {
            goto('/login');
        }
    });

    async function getUsers(actualOffset) {
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

            let url = utils.getBackendUrl(location) + "/api/organization/users"
            url = url + '?offset=' + actualOffset + '&limit=' + limit + '&organization=' + $profile.organization
            
            if($context!=null && $context!=''){
                url = url + '&tenant=' + $context
            }else if($profile.tenant!=null){
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
    function switchFilter() {
        showFilter = !showFilter
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getUsers(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getUsers(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }
    function handleSearch(event) {
        console.log('handleSearch', event)
        promise = getUsers(offset);
    }
    function handleClearFilter(event) {
        console.log('handleClearFilter', event)
        loginFilter = ''
        nameFilter = ''
        pathFilter = ''
        promise = getUsers(offset);
    }
    function isFilterSet() {
        return loginFilter.length > 0 || nameFilter.length > 0 || pathFilter.length > 0 
    }
    function loginFilterChanged(event) {
        console.log('loginFilterChanged', event)
        nameFilter = ''
        pathFilter = ''
    }
    function nameChanged(event) {
        console.log('nameChanged', event)
        loginFilter = ''
        pathFilter = ''
    }
    function pathFilterChanged(event) {
        console.log('pathFilterChanged', event)
        loginFilter = ''
        nameFilter = ''
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
            let confirmed = confirm(utils.getLabel('question_delete', labels, $language))
            if (!confirmed || dev) return

            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/device/" + eui
            headers.set('Authentication', $token);
            fetch(url,
                {
                    mode: 'cors',
                    method: 'DELETE',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                }).then(promise = getUsers(0)).catch((error) => {
                    console.log(error)
                });
        }
    }

    function isAuthorized(userProfile, configElement){
        if(userProfile.type==9 || userProfile.type==8){
            return true
        }else if(userProfile.uid==configElement.uid){
            return true
        }else{
            return false
        }
    }


    let labels = {
        'title': {
            'pl': "Użytkownicy",
            'en': "Users"
        },
        'name': {
            'pl': "Imię Nazwisko",
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
        'upload': {
            'pl': "Prześlij dane",
            'en': "Upload data"
        },
        'download': {
            'pl': "Pobierz dane",
            'en': "Download data"
        },
        'question_delete': {
            'pl': "Czy na pewno chcesz usunąć urządzenie? Również dane związane z tym urządzeniem zostaną usunięte. Potwierdzasz?",
            'en': "Are you sure you want to delete this device? All data related to this device will be deleted as well. Confirm?"
        }

    }

</script>