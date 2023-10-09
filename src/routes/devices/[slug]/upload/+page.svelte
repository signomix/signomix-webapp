<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h5>Przesyłanie danych</h5>
</div>
{#await data}
{:then data}
{#if data!==undefined}
<DataUploadForm config={data} callback={sendData} />
{/if}
{/await}
<script>
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import DataUploadForm from '$lib/components/DataUploadForm.svelte';

    export let data
    let errorMessage = ''

    let previousPage = base;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
    function goBack() {
        goto("/devices");
    }

    function sendData(dataToSend, callback) {
        if(dataToSend==null){
            goBack()
            return
        }
        console.log('data to send', dataToSend)
        sendFormData(dataToSend, callback)
    }

    function sendFormData(dataToSend,callback) {
        try {
            let silent = false
            let result = ''
            let formData = new URLSearchParams();
            for(let i=0; i<dataToSend.payload_fields.length; i++){
                formData.append(dataToSend.payload_fields[i].name, dataToSend.payload_fields[i].value)
            }
            formData.append('timestamp', utils.getDateApiFormat(dataToSend.timestamp))
            formData.append('project', 'simulation')
            const headers = new Headers()
            let url = utils.getBackendUrl(location) + "/api/receiver/in"
            headers.set('Authorization', data.key);
            headers.set('X-device-eui', data.eui)
            let response = fetch(
                url,
                { 
                    method:'POST',
                    //referrerPolicy: 'strict-origin-when-cross-origin',
                    mode: 'cors',
                    headers: headers, 
                    body: formData }
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
                            errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
                        }
                    }
                    if(error.message=='Failed to fetch'){
                        error.message = utils.getLabel('failToFetch',labels,$language)
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
        },
        'view': {
            'pl': "Pokaż",
            'en': "View"
        }
    }

</script>