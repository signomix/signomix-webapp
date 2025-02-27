<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-2 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
    {#if data.eui!='new'}<a href="/groups/{data.eui}"
    title="{utils.getLabel('view',labels,$language)}"><i class="bi bi-eye h5 me-2 link-dark"></i></a>{/if}
</div>
{#await data}
{:then data}
{#if data!==undefined}
<GroupForm config={data} callback={saveSettings} readonly={false} />
{/if}
{/await}
<script>
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import GroupForm from '$lib/components/GroupForm.svelte';

    export let data
    let errorMessage = ''

    let previousPage = base;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
    function goBack() {
        goto("/groups");
    }

    function saveSettings(config, callback) {
        if (config != null) {
            let cfg = config
            let validationError=validate(cfg)
            if(validationError!=''){
                callback(validationError)
                return
            }
            sendForm(cfg, true, callback)
        }
        goBack()
    }

    function validate(config) {
        let result=''
        return result
    }

    function sendForm(data, silent, callback) {
        try {
            let result = ''
            const headers = new Headers()
            let method = 'POST'
            let url = utils.getBackendUrl(location) + "/api/core/group/"
            if (!(data.eui === 'new' || data.eui == null || data.eui == '' || data.eui == undefined
                || data.new === true
            )) {
                url = url + data.eui
                method = 'PUT'
            }
            data.channels=getChannels(data.channelsAsString)
            headers.set('Authentication', $token);
            headers.set('Content-Type', 'application/json');
            let response = fetch(
                url,
                { method: method, mode: 'cors', headers: headers, body: JSON.stringify(data) }
            )
                .then((response) => {
                    if (response.status == 200) {
                        goto('/groups')
                        return ''
                    } else if (response.status == 401 || response.status == 403) {
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
                            errorMessage = errorMessage + utils.getLabel('selfSigned',labels,$language)
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

    function getChannels(channelsAsString){
        let channels={}
        if(channelsAsString!=null && channelsAsString!=''){
            let channelsArray=channelsAsString.split(',')
            for(let i=0;i<channelsArray.length;i++){
                let channel=channelsArray[i]
                channels[channel]={name:channel,type:null}
            }
        }
        return JSON.stringify(channels)
    }

    let labels = {
        'title': {
            'pl': "Konfiguracja grupy",
            'en': "Group configuration"
        },
        'failToFetch': {
            'pl': "Problem z połączeniem internetowym",
            'en': "Internet connection problem"
        },
        'view': {
            'pl': "Pokaż",
            'en': "View"
        },
        'selfSigned': {
            'pl': " Możliwa przyczyna: certyfikaty self signed nie są obsługiwane",
            'en': " Possible cause: self signed certificates are not supported"
        },
    }

</script>