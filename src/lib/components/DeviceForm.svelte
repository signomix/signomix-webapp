<Dialog bind:dialog callback={handleSave} title={utils.getLabel('saveQuestion',labels,$language)}
    labels={[utils.getLabel('save',labels,$language),'cancel']}>
    {#if measurementChanged}
    <span class="text-danger"><b>{utils.getLabel('changedMeasurements',labels,$language)}</b></span><br>
    {utils.getLabel('changedMeasurementsDescription',labels,$language)}
    {/if}
</Dialog>
<ul class="nav nav-underline mb-2">
    <li class="nav-item">
        <a class="nav-link" class:active={activeTab=='basic' } on:click|preventDefault={setActiveTab} name="basic"
            href="#">{utils.getLabel('basic',labels,$language)}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" class:active={activeTab=='extended' } on:click|preventDefault={setActiveTab} name="extended"
            href="#">{utils.getLabel('extended',labels,$language)}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" class:active={activeTab=='code' } on:click|preventDefault={setActiveTab} name="code"
            href="#">{utils.getLabel('code',labels,$language)}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" class:active={activeTab=='infrastructure' } on:click|preventDefault={setActiveTab}
            name="infrastructure" href="#">{utils.getLabel('infrastructure',labels,$language)}.</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" class:active={activeTab=='description' } on:click|preventDefault={setActiveTab}
            name="description" href="#">{utils.getLabel('description',labels,$language)}</a>
    </li>
</ul>
<form class="mb-2">
    {#if activeTab=='basic'}
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-eui" class="form-label">{utils.getLabel('eui',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-eui" bind:value={newEui} disabled={readonly &&
                !newDevice}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-type" class="form-label">{utils.getLabel('type',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <select class="form-select" id="input-type" bind:value={config.type} disabled={readonly}>
                <option value="GENERIC">Direct</option>
                <option value="TTN">TTN device</option>
                <option value="LORA">ChirpStack device</option>
                <option value="VIRTUAL">Virtual device</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-channels" class="form-label">{utils.getLabel('measurements',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-channels" bind:value={config.channelsAsString}
                on:change={measurementChange} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-key" class="form-label">{utils.getLabel('key',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-key" bind:value={config.key} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-interval" class="form-label">{utils.getLabel('interval',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-interval" bind:value={interval} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-dashboard" class="form-label">{utils.getLabel('dashboard',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="checkbox" class="form-check-input" id="input-dashboard" bind:checked={config.dashboard}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-status" class="form-label">{utils.getLabel('status',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input disabled type="number" class="form-control" id="input-status" bind:value={config.state}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-lastseen" class="form-label">{utils.getLabel('seen',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input disabled type="datetime-local" class="form-control" id="input-lastseen"
                value={utils.getLocalDateFormatFromTimestamp(config.lastSeen)}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-created" class="form-label">{utils.getLabel('created',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input disabled type="datetime-local" class="form-control" id="input-created"
                value={utils.getLocalDateFormatFromTimestamp(config.createdAt)}>
        </div>
    </div>
    {:else if activeTab=='code'}
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-decoder" class="form-label">{utils.getLabel('decoder',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-decoder" rows="3" bind:value="{decoderScript}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-processor" class="form-label">{utils.getLabel('processor',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-processor" rows="3" bind:value="{processorScript}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-config" class="form-label">{utils.getLabel('configuration',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-config" rows="3" bind:value="{config.configuration}"
                readonly={readonly} />
        </div>
    </div>
    {#if config.organizationId!=utils.getDefaultOrganizationId()}
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-application" class="form-label">{utils.getLabel('application',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-application" bind:value={config.orgApplicationId}
                readonly={readonly}>
        </div>
    </div>
    {/if}
    {:else if activeTab=='infrastructure'}
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-owner" class="form-label">{utils.getLabel('owner',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-owner" bind:value={config.userID} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-team" class="form-label">{utils.getLabel('team',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-team" bind:value={config.team} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-admins" class="form-label">{utils.getLabel('administrators',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-admins" bind:value={config.administrators}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-latitude" class="form-label">{utils.getLabel('latitude',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-latitude" bind:value={config.latitude}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-longitude" class="form-label">{utils.getLabel('longitude',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-longitude" bind:value={config.longitude}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-altitude" class="form-label">{utils.getLabel('altitude',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-altitude" bind:value={config.altitude}
                readonly={readonly}>
        </div>
    </div>
    {#if isNotDefaultOrganization()}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-path" class="form-label">{utils.getLabel('path',labels,$language)}</label>
        </div>
        <div class="col-md-2">
            <input type="text" class="form-control" id="input-pathRoot" value={pathRoot} disabled>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-path" bind:value={pathExt} readonly={readonly}>
        </div>
    </div>
    {/if}
    {:else if activeTab=='description'}
    <div class="row">
        <!--         <div class="col-md-3 col-form-label">
            <label for="input-interval" class="form-label">{utils.getLabel('description',labels,$language)}</label>
        </div> -->
        <div class="col-md-12">
            <textarea class="form-control mb-1" id="input-description" rows="6" bind:value="{config.description}"
                readonly={readonly} />
        </div>
    </div>
    {:else if activeTab=='extended'}
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-groups" class="form-label">{utils.getLabel('groups',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-groups" bind:value={config.groups} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-project" class="form-label">{utils.getLabel('project',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-project" bind:value={config.project} readonly={readonly}>
        </div>
    </div>
    <hr class="my-2">
<!--     <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-tagname" class="form-label">{utils.getLabel('tagname',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-tagname" bind:value={tagName} readonly={readonly}>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-tagvalue" class="form-label">{utils.getLabel('tagvalue',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-tagvalue" bind:value={tagValue} readonly={readonly}>
        </div>
    </div> -->
    <div class="row">
        <div class="col-md-12 mb-2">
            <b>{utils.getLabel('tags',labels,$language)}</b>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <Table header={tagTableLabels} columns={tagTableNames}
                data={tagArray} createAllowed={!readonly} updateAllowed={!readonly} deleteAllowed={!readonly} />
        </div>
    </div>
    {/if}
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/devices" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={decide}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { Toaster, toast } from 'svelte-sonner'
    import Dialog from '$lib/components/Dialog.svelte'
    import Table from '$lib/components/Table.svelte'

    export let config
    export let callback
    export let readonly

    let interval = config.transmissionInterval / 60000
    let decoderScript = unescape(config.encoder)
    let processorScript = unescape(config.code)
    let originalMeasurementChannels = config.channelsAsString
    let newDevice = config.eui.toUpperCase() == 'NEW'
    let dialog
    let measurementChanged = false

    //
    let originalEui = config.eui
    let newEui = config.eui
    let tagArray = []
    let tagTableLabels = []
    let tagName = ""
    let tagValue = ""

    if (config.tags != null && config.tags != '') {
        let tagDefinitions = config.tags.split(';')
        tagDefinitions.forEach(tagDef => {
            let oneTag = tagDef.split(':')
            tagArray.push({ name: oneTag[0], value: oneTag[1] })
        });
    }
    let tagTableNames=['name','value']

    if (tagArray.length > 0) {
        tagName = tagArray[0].name
        tagValue = tagArray[0].value
    }
    /*     if (config.tags != null && config.tags != '') {
            let tag = config.tags.split(':')
            tagName = tag[0]
            tagValue = tag[1]
        } */

    let activeTab = 'basic'

    let pathRoot = getPathRoot()
    let pathExt = getPathExt()

    function getPathRoot() {
        let tmpCtxRoot = $contextRoot
        console.log('$contextRoot', tmpCtxRoot)
        console.log('config.path', config.path)
        let result
        if (tmpCtxRoot == null || tmpCtxRoot == undefined || tmpCtxRoot == '') {
            tmpCtxRoot = ''
        } else {
            return tmpCtxRoot
        }

        if (config.path == null || config.path == undefined || config.path == '') {
            result = tmpCtxRoot
        } else if (config.path.indexOf('.') > -1) {
            result = config.path.substring(0, config.path.indexOf('.'))
        } else {
            result = config.path
        }
        if (result.endsWith('.')) {
            result = result.substring(0, result.length - 1)
        }
        //result=result.replace(/\./g, '/')
        console.log('getPathRoot', result)
        return result
    }
    function getPathExt() {
        let result
        /*
        if($contextRoot != null && $contextRoot != undefined && $contextRoot != ''){
            return ''
        }
        */
        if (config.path == null || config.path == undefined || config.path == '') {
            result = ''
        } else if (config.path.indexOf('.') > -1) {
            if (config.path.indexOf('.') == config.path.length - 1) {
                result = ''
            } else {
                result = config.path.substring(config.path.indexOf('.') + 1)
            }
        } else {
            result = ''
        }
        if (result.length > 0 && !result.startsWith('.')) {
            result = '.' + result
        }
        console.log('getPathExt', result)
        return result
    }

    function setActiveTab(event) {
        activeTab = event.target.name
        console.log('activeTab', activeTab)
    }
    function isActiveTab(tab) {
        console.log('isActiveTab', activeTab, tab)
        return activeTab == tab ? 'active' : ''
    }

    function decide() {
        dialog.showModal()
    }

    function isNotDefaultOrganization() {
        console.log('isNotDefaultOrganization', utils.getDefaultOrganizationId(), config.organizationId)
        return config.organizationId != utils.getDefaultOrganizationId()
    }

    function handleSave(decision) {
        dialog.close()
        if (!decision) {
            return
        }
        config.originalEui = originalEui
        config.eui = newEui.trim().toUpperCase()
        config.transmissionInterval = interval * 60000
        config.encoder = decoderScript.trim()
        config.code = processorScript.trim()
        if (config.configuration != null) {
            config.configuration = config.configuration.trim()
        } else {
            config.configuration = ''
        }
/*         if (tagName != '' && tagValue != '') {
            config.tags = tagName + ':' + tagValue
        } */
        config.tags = ''
        tagArray.forEach(tag => {
            config.tags += tag.name + ':' + tag.value + ';'
        })
        if (pathExt.length > 0 && !pathExt.startsWith('.')) {
            pathExt = '.' + pathExt
        }
        config.path = pathRoot + pathExt

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

    function measurementChange(event) {
        if (newDevice) {
            return
        }
        measurementChanged = true
    }

    function handleCancel(event) {
        callback(null)
    }
    function validate() {

        if (config.configuration != '') {
            try {
                JSON.parse(config.configuration)
            } catch (error) {
                return 'error.configuration'
            }
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
        'eui': {
            'pl': "EUI",
            'en': "EUI"
        },
        'name': {
            'pl': "Nazwa",
            'en': "Name"
        },
        'type': {
            'pl': "Typ",
            'en': "Type"
        },
        'owner': {
            'pl': "Właściciel",
            'en': "Owner"
        },
        'team': {
            'pl': "Zespół",
            'en': "Team"
        },
        'administrators': {
            'pl': "Administratorzy",
            'en': "Administrators"
        },
        'key': {
            'pl': "Klucz autoryzacyjny",
            'en': "Authorization key"
        },
        'measurements': {
            'pl': "Pomiary",
            'en': "Measurements"
        },
        'groups': {
            'pl': "Grupy",
            'en': "Groups"
        },
        'project': {
            'pl': "Projekt",
            'en': "Project"
        },
        'latitude': {
            'pl': "Szerokość geograficzna",
            'en': "Latitude"
        },
        'longitude': {
            'pl': "Długość geograficzna",
            'en': "Longitude"
        },
        'altitude': {
            'pl': "Wysokość",
            'en': "Altitude"
        },
        'interval': {
            'pl': "Interwał transmisji (min)",
            'en': "Transmission interval (min)"
        },
        'description': {
            'pl': "Opis",
            'en': "Description"
        },
        'decoder': {
            'pl': "Skrypt dekodera danych",
            'en': "Data decoder script"
        },
        'processor': {
            'pl': "Skrypt procesora danych",
            'en': "Data processor script"
        },
        'configuration': {
            'pl': "Konfiguracja",
            'en': "Configuration"
        },
        'application': {
            'pl': "Aplikacja",
            'en': "Application"
        },
        'path': {
            'pl': "Ścieżka",
            'en': "Path"
        },
        'tags': {
            'pl': "Znaczniki",
            'en': "Tags"
        },
        'tagname': {
            'pl': "Nazwa tagu",
            'en': "Tag name"
        },
        'tagvalue': {
            'pl': "Wartość tagu",
            'en': "Tag value"
        },
        'name': {
            'pl': "Nazwa",
            'en': "Name"
        },
        'value': {
            'pl': "Wartość",
            'en': "Value"
        },
        'action': {
            'pl': "Akcja",
            'en': "Action"
        },
        'dashboard': {
            'pl': "Domyślny pulpit tworzony automatycznie",
            'en': "Default dashboard created automatically"
        },
        'status': {
            'pl': "Status",
            'en': "Status"
        },
        'seen': {
            'pl': "Ostatnio widziany",
            'en': "Last seen"
        }
        ,
        'created': {
            'pl': "Data rejestracji",
            'en': "Registration date"
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel"
        },
        'save': {
            'pl': "Zapisz",
            'en': "Save"
        },
        'error.applicationid': {
            'pl': "Niewłaściwe ID aplikacji",
            'en': "Wrong application ID"
        },
        'error.configuration': {
            'pl': "Tekst konfiguracji nie jest poprawnym JSONem",
            'en': "Configuration text is not a valid JSON"
        },
        'error': {
            'pl': "Błąd",
            'en': "Error"
        },
        'saveQuestion': {
            'pl': "Zapisać zmiany?",
            'en': "Save changes?"
        },
        'changedMeasurements': {
            'pl': "Zmieniono listę pomiarów!",
            'en': "Changed measurements list!"
        },
        'changedMeasurementsDescription': {
            'pl': "Zmiana listy pomiarów spowoduje utratę danych historycznych. Czy chcesz zapisać zmiany?",
            'en': "Changing the list of measurements will result in loss of historical data. Do you want to save the changes?"
        },
        'undo': {
            'pl': "Cofnij zmiany",
            'en': "Undo changes"
        },
        'close': {
            'pl': "Zamknij",
            'en': "Close"
        },
        'basic': {
            'pl': "Podstawowe",
            'en': "Basic"
        },
        'extended': {
            'pl': "Rozszerzone",
            'en': "Extended"
        },
        'code': {
            'pl': "Kod",
            'en': "Code"
        },
        'infrastructure': {
            'pl': "Infrastruktura",
            'en': "Infrastructure"
        },
        'description': {
            'pl': "Opis",
            'en': "Description"
        },
    }
    tagTableLabels = [utils.getLabel('name',labels,$language), utils.getLabel('value',labels,$language), utils.getLabel('action',labels,$language)]
</script>