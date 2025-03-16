<!-- <Dialog bind:dialog callback={handleSave} title={utils.getLabel('saveQuestion',labels,$language)}
    labels={[utils.getLabel('save',labels,$language),'cancel']}>
    {#if measurementChanged}
    <span class="text-danger"><b>{utils.getLabel('changedMeasurements',labels,$language)}</b></span><br>
    {utils.getLabel('changedMeasurementsDescription',labels,$language)}
    {/if}
</Dialog> -->
<form class="mb-2">
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('id',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-name" bind:value={taskId} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-config" class="form-label">{utils.getLabel('configuration',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-config" rows="10" bind:value="{configuration}"
                readonly={readonly} />
        </div>
    </div>

    {#if !readonly && utils.isPayingUser($profile.type)}
    <div class="row">
        <div class="col-form-label">
            <a href="/" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={handleSave}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { Toaster, toast } from 'svelte-sonner'
    //import Dialog from '$lib/components/Dialog.svelte'

    export let config
    export let callback
    export let readonly

    let taskId = config.id

    let configuration = ''
    try {
        configuration = JSON.stringify(config, null, 2)
    }catch(error){
        console.log('error: ',error)
    }

    function handleSave() {
        let errMessage = validate()
        if (errMessage != '') {
            toast.error(utils.getLabel(errMessage, labels, $language), {
                action: { label: utils.getLabel('close', labels, $language), onClick: () => { } },
                duration: Number.POSITIVE_INFINITY
            })
            return
        }
        callback(config, handleCallbackResponse)
    }

    function handleCancel(event) {
        callback(null)
    }
    function validate() {

        if (configuration!=null &&  configuration!= '') {
            try {
                config=JSON.parse(configuration)
            } catch (error) {
                return 'error.configuration'
            }
            /* if(config.id!=taskId){
                return 'error.id'
            } */
        }
        return ''
    }
    async function handleCallbackResponse(promise) {
        if (promise instanceof Promise || promise instanceof Response) {
            Promise.resolve(promise).then(response => {
                response.json()
            }).then(data => {
                let errTxt = null
                let text = data.toLowerCase()
                if (text.contains('constraint') && text.contains('organizationapp')) {
                    errTxt = 'error.applicationid'
                }
                if (errTxt != null) {
                    //alert(utils.getLabel(errTxt, labels, $language))
                    toast.error('1 ' + utils.getLabel(errTxt, labels, $language))
                } else {
                    //alert(data)
                    toast.success(data)
                }
                //alert(text)
                toast.success(text)
            }).catch(error => {
                //alert(utils.getLabel('error', labels, $language) + ': ' + error.message)
                toast.error('2 ' + utils.getLabel('error', labels, $language) + ': ' + error.message)
            })
        } else {
            //alert(utils.getLabel('error', labels, $language) + ': ' + promise)
            toast.error('3 ' + utils.getLabel('error', labels, $language) + ': ' + promise,
                {
                    action: { label: utils.getLabel('close', labels, $language), onClick: () => { } },
                    duration: Number.POSITIVE_INFINITY
                }
            )
        }
    }

    let labels = {
        'id': {
            'pl': "ID",
            'en': "ID"
        },
        'configuration': {
            'pl': "Konfiguracja",
            'en': "Configuration"
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel"
        },
        'save': {
            'pl': "Zapisz",
            'en': "Save"
        },
        'error.configuration': {
            'pl': "Błąd w konfiguracji",
            'en': "Configuration error"
        },
        'error.id': {
            'pl': "ID nie zgadza się",
            'en': "ID does not match"
        },
        'close': {
            'pl': "Zamknij",
            'en': "Close"
        },
        'error': {
            'pl': "Błąd",
            'en': "Error"
        },
    }
    //tagTableLabels = [utils.getLabel('name',labels,$language), utils.getLabel('value',labels,$language), utils.getLabel('action',labels,$language)]
</script>