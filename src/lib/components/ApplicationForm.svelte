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
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
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
            <textarea class="form-control mb-1" id="input-config" rows="3" bind:value="{configuration}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-3 col-form-label">
            <label for="input-description" class="form-label">{utils.getLabel('description',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-description" rows="6" bind:value="{config.description}"
                readonly={readonly} />
        </div>
    </div>
    {#if !readonly && utils.isPayingUser($profile.type)}
    <div class="row">
        <div class="col-form-label">
            <a href="/devices" class="btn btn-outline-secondary mt-1"
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

    let decoderScript = unescape(config.decoder)
    let processorScript = unescape(config.code)
    //let dialog

    let configuration = ''
    try{
        configuration = JSON.stringify(config.config)
    }catch(error){
        console.log('error: ',error)
    }

    function handleSave() {
        config.decoder = decoderScript.trim()
        config.code = processorScript.trim()
        if (configuration != null) {
            configuration = configuration.trim()
            config.config=configuration //JSON.parse(configuration)
        } else {
            config.config = null
        }

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
                JSON.parse(configuration)
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
        'devid': {
            'pl': "ID urządzenia w TTN",
            'en': "TTN device ID"
        },
        'appid': {
            'pl': "ID aplikacji w TTN",
            'en': "TTN application ID"
        },
        'downlink-key': {
            'pl': "Klucz API w TTN",
            'en': "TTN API key"
        },
    }
    //tagTableLabels = [utils.getLabel('name',labels,$language), utils.getLabel('value',labels,$language), utils.getLabel('action',labels,$language)]
</script>