<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h5>Konfiguracja urządzenia</h5>
    {#if data.eui!='new'}<a href="/devices/{data.eui}">Show</a>{/if}
</div>
{#await data}
{:then data}
{#if data!==undefined}
<DeviceForm config={data} callback={saveSettings} readonly={false} />
{/if}
{/await}
<script>
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { userSession } from '$lib/stores.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import DeviceForm from '$lib/components/DeviceForm.svelte';

    export let data
    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let previousPage = base;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
    function goBack() {
        goto("/devices");
    }

    function saveSettings(config){
        //TODO: save settings
        goBack()
    }

    function saveDashboard() {
        data.items = gridHelp.normalize(data.items, COLS);
        console.log(data)
        if (data.version == 1) {
            if (!confirm('Zapisana konfiguracja pulpitu jest w wersji 1.0. \nPo zaktualizowaniu do wersji 2 nie będzie możliwe wyświetlenie go w starszej wersji aplikacji?\n Zapisać?')) {
                return;
            }
        }
        if (dev) {
            if (browser) {
                if (data.id == 'new') {
                    data.id = new Date().getTime();
                }
                data.updatedAt = new Date();
                window.localStorage.setItem(data.id, JSON.stringify(transformBack(data)));
            }
        } else {
            sendForm(data);
        }
        modified = false;
    }


    function sendForm(data) {
        data = transformBack(data)
        const headers = new Headers()
        let method = 'POST'
        let url = utils.getBackendUrl(location) + "/api/core/device/"
        if (!(data.id === 'new' || data.id == null || data.id == '' || data.id == undefined)) {
            url = url + data.id
            method = 'PUT'
        }
        headers.set('Authentication', session.user.token);
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(data) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/dashboards')
            } else if (response.status == 401 || response.status == 403 || response.status == 404) {
                utils.setAuthorized(session, false)
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


    function setCurrentConfigureIndex(idx) {
        currentConfigureIndex = idx;
        console.log('New currentConfigureIndex: ', currentConfigureIndex);
    }

    function widgetFormCallback(idx, cfg) {
        console.log('testCallback ', idx, cfg);
        modified = true
    }

</script>