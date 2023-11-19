<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5><a href="/sentinels/{data.sentinel.id}" title="View"><i class="bi bi-eye h5 me-2 link-dark"></i></a>
</div>
{#await data}
{:then data}
<AlertForm config={data.sentinel} callback={saveSettings} editable=1/>
{/await}
<script>
    import AlertForm from '$lib/components/AlertForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';

    onMount(async () => {
        if(!$isAuthenticated){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('ALERTS',data);
        }
    });

    export let data;

    function saveSettings(config) {
        if (config != null) {
            let cfg = config
            cfg.type = cfg.result.type
            cfg.deviceEui= cfg.target.eui==null?"":cfg.target.eui
            cfg.groupEui= cfg.target.group==null?"":cfg.target.group
            cfg.tagName= cfg.target.tag.name==null?"":cfg.target.tag.name
            cfg.tagValue= cfg.target.tag.value==null?"":cfg.target.tag.value
            cfg.alertLevel= cfg.result.alertType
            if(cfg.team==null){
                cfg.team = ""
            }
            if(cfg.administrators==null){
                cfg.administrators = ""
            }
            cfg.everyTime = cfg.result.everytime==null?"":cfg.result.everytime
            for(let i=0;i<cfg.conditions.length;i++){
                    /* cfg.conditions[i].condition1=cfg.conditions[i].condition1=='<'?-1:1;
                    cfg.conditions[i].condition2= cfg.conditions[i].condition2=='<'?-1:1;
                    cfg.conditions[i].conditionOperator=cfg.conditions[i].operator=='and'?3:4;
                    cfg.conditions[i].orOperator=(cfg.conditions[i].value2!=null) */
            }
            cfg.organizationId = $profile.organization
            cfg.alertMessage = cfg.result.message==null?"":cfg.result.message
            cfg.conditionOkMessage = cfg.result.conditionOkMessage==null?"":cfg.result.conditionOkMessage
            cfg.conditionOkMessageText = cfg.result.conditionOkMessageText==null?"":cfg.result.conditionOkMessageText
            let validationError = validate(cfg)
            if (validationError != '') {
                //callback(validationError)
                alert(validationError)
                return
            }
            //sendForm(cfg, true, callback)
            console.log('SAVE',cfg)
            sendForm(cfg,true)
        }
        //goBack()
    }

    function validate(config) {
        let result = ''
/*         if (config.code.includes('%')) {
            result = utils.getLabel('illegalProc', labels, $language)
        }
        if (config.encoder.includes('%')) {
            result = utils.getLabel('illegalDecoder', labels, $language)
        } */
        return result
    }

    function sendForm(data, silent /*, callback */) {
        try {
            let result = ''
            const headers = new Headers()
            let method = ''
            let url = utils.getBackendUrl(location) + "/api/sentinel/"
            console.log('DATA',data)
             if(data.id==undefined){
                method = 'POST'
            } else {
                url = url + data.id
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
                        goto('/sentinels')
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
                        //callback(text)
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
                    //callback(error.message)
                });
        } catch (error) {
            //callback(error.message)
        }
    }

    let labels = {
        'title': {
            'pl': "Ustawienia alarmu",
            'en': "Alert settings"
        }
    }

</script>