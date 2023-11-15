<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
    {#if data.eui!='new'}<a href="/devices/{data.eui}" title="{utils.getLabel('view',labels,$language)}"><i
            class="bi bi-eye h5 me-2 link-dark"></i></a>{/if}
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
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import DeviceForm from '$lib/components/DeviceForm.svelte';

    export let data
    let errorMessage = ''

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
            let validationError = validate(cfg)
            if (validationError != '') {
                callback(validationError)
                return
            }
            sendForm(cfg, true, callback)
        }
        goBack()
    }

    function validate(config) {
        let result = ''
        if (config.code.includes('%')) {
            result = utils.getLabel('illegalProc', labels, $language)
        }
        if (config.encoder.includes('%')) {
            result = utils.getLabel('illegalDecoder', labels, $language)
        }
        return result
    }

    function sendForm(data, silent, callback) {
        try {
            let result = ''
            const headers = new Headers()
            let method = ''
            let url = utils.getBackendUrl(location) + "/api/core/device/"
            console.log('DATA',data)
            //if (data.eui == null || data.eui == '' || data.eui == undefined || data.eui.toLowerCase() == 'new') {
            if(data.isNew){
                method = 'POST'
            } else {
                url = url + data.eui
                method = 'PUT'
            }
            headers.set('Authentication', $token);
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
                        token.set(null)
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
                            errorMessage = errorMessage + utils.getLabel('selfSigned', labels, $language)
                        }
                    }
                    if (error.message == 'Failed to fetch') {
                        error.message = utils.getLabel('failToFetch', labels, $language)
                    }
                    callback(error.message)
                });
        } catch (error) {
            callback(error.message)
        }
    }

    let labels = {
        'title': {
            'pl': "Konfiguracja urządzenia",
            'en': "Device configuration"
        },
        'failToFetch': {
            'pl': "Problem z połączeniem internetowym",
            'en': "Internet connection problem"
        },
        'view': {
            'pl': "Pokaż",
            'en': "View"
        },
        'illegalProc': {
            'en': "illegal characters in data processor script",
            'pl': "niedozwolone znaki w skrypcie procesora danych"
        },
        'illegalDecoder': {
            'en': "illegal characters in decoder script",
            'pl': "niedozwolone znaki w skrypcie dekodera"
        },
        'selfSigned': {
            'pl': " Możliwa przyczyna: certyfikaty self signed nie są obsługiwane",
            'en': " Possible cause: self signed certificates are not supported"
        },
    }

</script>