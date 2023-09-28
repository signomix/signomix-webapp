<form class="mb-2">
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('eui',labels,$language)}</label>
        </div>
        <div class="col-md-3">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.eui}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-7">
            <input disabled type="text" class="form-control" id="input-name" bind:value={config.name}>
        </div>
    </div>
    {#each measurements as measurement}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-{measurement.name}" class="form-label">{measurement.name}</label>
        </div>
        <div class="col-md-10">
            <input type="number" class="form-control" id="input-{measurement.name}" bind:value={measurement.value}>
        </div>
    </div>
    {/each}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-timestamp" class="form-label">timestamp</label>
        </div>
        <div class="col-md-4">
            <input type="datetime-local" class="form-control" id="input-timestamp" bind:value={timestamp}>
        </div>
    </div>
    <div class="row">
        <div class="col-form-label">
            <a href="/devices" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={handleSave}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

    export let config
    export let callback

    let channelNames=config.channelsAsString.split(',')
    let measurements=[]
    for (let i=0; i<channelNames.length; i++) {
        measurements.push({name: channelNames[i], value: ''})
    }
    let timestamp=''

    function handleSave(event) {
        let data={
            payload_fields: measurements,
            timestamp: timestamp
        }
        callback(data, handleCallbackResponse)
    }
    function handleCancel(event) {
        callback(null)
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
        'status': {
            'pl': "Status",
            'en': "Status"
        },
        'seen': {
            'pl': "Ostatnio widziany",
            'en': "Last seen"
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
        }
    }
</script>