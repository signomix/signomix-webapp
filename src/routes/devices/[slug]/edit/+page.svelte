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

    function saveSettings(config, callback) {
        if (config != null) {
            let cfg = config
            cfg.channels = "{}"
            cfg.applicationConfig = "{}"
            sendForm(cfg, true, callback)
        }
        goBack()
    }

    function sendForm(data, silent, callback) {
        try {
            let result = ''
            const headers = new Headers()
            let method = 'POST'
            let url = utils.getBackendUrl(location) + "/api/core/device/"
            if (!(data.eui === 'new' || data.eui == null || data.eui == '' || data.eui == undefined)) {
                url = url + data.eui
                method = 'PUT'
            }
            headers.set('Authentication', session.user.token);
            headers.set('Content-Type', 'application/json');
            let response = fetch(
                url,
                { method: method, mode: 'cors', headers: headers, body: JSON.stringify(data) }
            )
                .then((response) => {
                    if (response.status == 200) {
                        goto('/devices')
                        return ''
                    } else if (response.status == 401 || response.status == 403 || response.status == 404) {
                        utils.setAuthorized(session, false)
                    } else if (response.status == 400) {
                    } else {
                        if (!silent) {
                            alert(
                                utils.getMessage(utils.FETCH_STATUS)
                                    .replace('%1', response.status)
                                    .replace('%2', response.statusText)
                            )
                        }
                    }
                    return response.text()
                })
                .then((text) => {
                    if (text != '') {
                        callback(text)
                    }
                })
                .catch((error) => {
                    if (!silent) {
                        errorMessage = error.message
                        if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                            errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
                        }
                    }
                    if(error.message=='Failed to fetch'){
                        error.message = utils.getLabel('failToFetch',labels,session)
                    }
                    callback(error.message)
                });
        } catch (error) {
            callback(error.message)
        }
    }

    let labels = {
        'failToFetch': {
            'pl': "Problem z połączeniem internetowym",
            'en': "Internet connection problem"
        }
    }

</script>