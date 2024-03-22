<form class="mb-2">
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-root" class="form-label">{utils.getLabel('root',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-root" bind:value={config.root} readonly={readonly}>
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/groups" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={handleSave}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

    export let config
    export let callback
    export let readonly

    if(config.name==null || config.name==''){
        config.newConfig=true
    }else{
        config.newConfig=false 
    }

    function handleSave(event) {
        let errMessage = validate()
        if (errMessage != '') {
            alert(utils.getLabel(errMessage, labels, $language))
            return
        }
        if(config.name==null || config.name==''){
            alert(utils.getLabel('error.name', labels, $language))
            return
        }
        if(config.root==null || config.root==''){
            alert(utils.getLabel('error.root', labels, $language))
            return
        }
        config.organizationId = $profile.organization
        config.menuDefinition=''
        callback(config, handleCallbackResponse)
    }
    function handleCancel(event) {
        callback(null)
    }
    function validate() {
        return ''
    }
    async function handleCallbackResponse(promise) {
        if (promise instanceof Promise || promise instanceof Response) {
            Promise.resolve(promise).then(response => {
                response.json()
            }).then(data => {
                let errTxt = null
                let text = data.toLowerCase()
/*                 if (text.contains('constraint') && text.contains('organizationapp')) {
                    errTxt = 'error.applicationid'
                } */
                if (errTxt != null) {
                    alert(utils.getLabel(errTxt, labels, $language))
                } else {
                    alert(data)
                }
                alert(text)
            }).catch(error => {
                alert(utils.getLabel('error', labels, $language) + ': ' + error.message)
            })
        } else {
            alert(utils.getLabel('error', labels, $language) + ': ' + promise)
        }
    }

    let labels = {
        'name': {
            'pl': "Nazwa",
            'en': "Name"
        },
        'root': {
            'en': "Path root",
            'pl': "Ścieżka główna"
        },
        'error': {
            'en': "Error",
            'pl': "Błąd"
        },
        'erroe.name': {
            'en': "Name is required",
            'pl': "Nazwa jest wymagana"
        },
        'error.root': {
            'en': "Path root is required",
            'pl': "Ścieżka główna jest wymagana"
        },
        'cancel': {
            'en': "Cancel",
            'pl': "Anuluj"
        },
        'save': {
            'en': "Save",
            'pl': "Zapisz"
        }
    }
</script>