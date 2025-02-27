<form class="mb-2">
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('eui',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            {#if config.new === true}
            <input type="text" class="form-control" id="input-uid" bind:value={config.eui} >
            {:else}
            <input type="text" class="form-control" id="input-uid" bind:value={config.eui} disabled>
            {/if}
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-owner" class="form-label">{utils.getLabel('owner',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-owner" bind:value={config.userID} disabled>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-team" class="form-label">{utils.getLabel('team',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-team" bind:value={config.team} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-admins" class="form-label">{utils.getLabel('administrators',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-admins" bind:value={config.administrators}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-channels" class="form-label">{utils.getLabel('measurements',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-channels" bind:value={channelsAsString}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-interval" class="form-label">{utils.getLabel('description',labels,$language)}</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-description" rows="3" bind:value="{config.description}"
                readonly={readonly} />
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

    let channelsAsString=getChannelsAsString(config.channels)

    function handleSave(event) {

        let errMessage = validate()
        if (errMessage != '') {
            alert(utils.getLabel(errMessage, labels, $language))
            return
        }
        //config.channels = getChannels(channelsAsString)
        config.channelsAsString=channelsAsString
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

    function getChannelsAsString(channels) {
        let result = ''
        if (channels != null) {
            for (let key in channels) {
                result = result + key + ','
            }
        }
        return result
    }

    function getChannels(channelsAsString) {
        let result = {}
        if (channelsAsString != null) {
            let channels = channelsAsString.split(',')
            for (let i = 0; i < channels.length; i++) {
                result[channels[i]] = {name: channels[i], type: null}
            }
        }
        return result
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