{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('devices',labels,$language)}</h5>
    {#if nameFilter.length>0 || euiFilter.length>0 || tagName.length>0 || tagValue.length>0}
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
{:then devices}
<div class="component">
    {#if showFilter}
    <div class="row">
        <div class="col-md-6">
            <label class="col-form-label" for="input-eui">EUI:</label>
            <input type="text" id="input-eui" bind:value={euiFilter} on:input={euiChanged} class="form-control mb-2"
                aria-label="Search EUI">
        </div>
        <div class="col-md-6">
            <label class="col-form-label" for="input-name">Nazwa:</label>
            <input type="text" id="input-name" bind:value={nameFilter} on:input={nameChanged} class="form-control mb-2"
                aria-label="Search name">
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <label class="col-form-label" for="input-tagName">Tag name:</label>
            <input type="text" id="input-tagName" bind:value={tagName} on:input={tagNameChanged}
                class="form-control mb-2" aria-label="Search tag name">
        </div>
        <div class="col-md-6">
            <label class="col-form-label" for="input-tagValue">Tag value:</label>
            <input type="text" id="input-tagValue" bind:value={tagValue} on:input={tagValueChanged}
                class="form-control mb-2" aria-label="Search name">
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <label class="col-form-label" for="input-path">Path:</label>
            <input type="text" id="input-path" bind:value={devicePath} on:input={pathChanged}
                class="form-control mb-2" aria-label="Search device path">
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
                            <th scope="col" class="col-2">EUI</th>
                            <th scope="col" class="col-5">{utils.getLabel('name',labels,$language)}</th>
                            <th scope="col" class="col-2">{utils.getLabel('type',labels,$language)}</th>
                            <th scope="col" class="col-2 text-end">{utils.getLabel('actions',labels,$language)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each devices as config, index}
                        <tr>
                            <th scope="row" class="col-1">{offset+1+index}</th>
                            <td class="col-2"><a href="/devices/{config.eui}">{config.eui}</a></td>
                            <td class="col-5">{config.name}</td>
                            <td class="col-2">{config.type}</td>
                            <td class="col-2 text-end">
                                {#if config.type=='GENERIC' && $profile.uid==config.userID}
                                <a href="/devices/{config.eui}/upload"><i class="bi bi-upload me-2 link-dark"
                                        title={utils.getLabel('upload',labels,$language)}></i></a>
                                {/if}
                                <a href="/devices/{config.eui}/download"
                                    title={utils.getLabel('download',labels,$language)}><i
                                        class="bi bi-cloud-download me-2 link-dark"></i></a>
                                <a href="/devices/{config.eui}/copy" title={utils.getLabel('copy',labels,$language)}><i
                                        class="bi bi-copy me-2 link-dark"></i></a>
                                {#if sgxhelper.hasObjectAccess($profile,true,1,config,'Device')}
                                <a href="/devices/{config.eui}/edit"
                                    title={utils.getLabel('configure',labels,$language)}><i
                                        class="bi bi-gear me-2 link-dark"></i></a>
                                {/if}
                                <a href="" on:click|preventDefault={deleteSelected(config.eui)}
                                    title={utils.getLabel('delete',labels,$language)}><i
                                        class="bi bi-trash link-dark"></i></a>
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
                href="/devices/new/edit">{utils.getLabel('add',labels,$language)}</a>
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
</div>
{/await}
{/if}
<script>
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { sgxhelper } from '$lib/sgxhelper.js';
    //import { dialogs } from "svelte-dialogs";

    //export let data
    let offset = 0
    let limit = 12
    let euiFilter = ''
    let nameFilter = ''
    let tagName = ''
    let tagValue = ''
    let devicePath = ''
    let showFilter = false

    let promise = getDevices(offset)

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });

    async function getDevices(actualOffset) {
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

            let url = utils.getBackendUrl(location) + "/api/core/device"
            url = url + '?offset=' + actualOffset + '&limit=' + limit + '&full=false'

            if (euiFilter.length > 0) {
                url = url + '&search=eui:' + euiFilter
                offset = 0
            } else if (nameFilter.length > 0) {
                url = url + '&search=name:' + nameFilter
                offset = 0
            } else if (tagName.length > 0 && tagValue.length > 0) {
                url = url + '&search=tag:' + tagName + ':' + tagValue
                offset = 0
            } else if (devicePath.length > 0 ) {
                url = url + '&search=path:' + devicePath
                offset = 0
            }

            if (!utils.isDefaultOrganizationUser($profile)) {
                url = url + '&organization=' + $profile.organization
                if ($context > 0) {
                    //context is not supperted yet but it is prepared for future use
                    url = url + '&context=' + $context+'&path='+$contextRoot+'.*'
                }
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
        promise = getDevices(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getDevices(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }
    function handleSearch(event) {
        console.log('handleSearch', event)
        promise = getDevices(offset);
    }
    function handleClearFilter(event) {
        console.log('handleClearFilter', event)
        euiFilter = ''
        nameFilter = ''
        tagName = ''
        tagValue = ''
        devicePath = ''
        promise = getDevices(offset);
    }
    function isFilterSet() {
        return euiFilter.length > 0 || nameFilter.length > 0 || tagName.length > 0 || tagValue.length > 0
    }
    function euiChanged(event) {
        console.log('euiChanged', event)
        nameFilter = ''
        tagName = ''
        tagValue = ''
        devicePath = ''
    }
    function nameChanged(event) {
        console.log('nameChanged', event)
        euiFilter = ''
        tagName = ''
        tagValue = ''
        devicePath = ''
    }
    function tagNameChanged(event) {
        console.log('tagNameChanged', event)
        euiFilter = ''
        nameFilter = ''
        devicePath = ''
    }
    function tagValueChanged(event) {
        console.log('tagValueChanged', event)
        euiFilter = ''
        nameFilter = ''
        devicePath
    }
    function pathChanged(event) {
        console.log('pathChanged', event)
        euiFilter = ''
        tagName = ''
        tagValue = ''
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
                }).then(promise = getDevices(0)).catch((error) => {
                    console.log(error)
                });
        }
    }


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