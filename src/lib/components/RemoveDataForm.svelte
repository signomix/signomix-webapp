<Dialog bind:dialog callback={handleRemove} title={utils.getLabel('saveQuestion',labels,$language)}
    labels={[utils.getLabel('save',labels,$language),'cancel']}>
</Dialog>
<div class="row">
    <div class="col-12">
        <p>{utils.getLabel('info1',labels,$language)} <b>{eui}</b>
        </p>
    </div>
</div>
<form class="mb-2">
    <div class="row">
        <div class="col-form-label">
            <a href="/devices/{eui}" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click|preventDefault={decide}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {#if errorMessage != null}
    <div class="alert alert-danger mt-2" role="alert">
        {errorMessage}
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import Dialog from '$lib/components/Dialog.svelte'

    export let eui
    export let callback

    let errorMessage = null
    let formError = null
    let dialog


    function decide() {
        dialog.showModal()
    }

    function handleRemove(decision) {
        dialog.close()
        if (!decision) {
            return
        }
        removeDeviceData(eui)
    }

    function removeDeviceData(eui) {
        const headers = new Headers()
        let url = utils.getBackendUrl(location) + "/api/core/device/" + eui + "/data"
        headers.set('Authentication', $token);
        let response = fetch(
            url,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: headers
            }
        ).then(response => response.json())
            .then(data => {
                console.log("removeData response", data)
            })
            .catch((error) => {
                if (!silent) {
                    errorMessage = error.message
                    if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                        errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
                    }
                }
                if (error.message == 'Failed to fetch') {
                    error.message = utils.getLabel('failToFetch', labels, $language)
                }
            });
    }

    function handleCancel(event) {
        callback()
    }


    let labels = {
        'title': {
            'pl': "Usuwanie danych",
            'en': "Remove data"
        },
        'info1': {
            'pl': "Z bazy danych zostaną usunięte wszystkie dane dotyczące urządzenia o identyfikatorze",
            'en': "All data related to device with identifier"
        },
        'saveQuestion': {
            'pl': "Czy na pewno chcesz usunąć dane?",
            'en': "Are you sure you want to remove data?"
        },
        'cancel': {
            'pl': "Powrót",
            'en': "Back"

        },
        'save': {
            'pl': "Usuń dane",
            'en': "Remove data"
        },
        'error': {
            'pl': "Błąd",
            'en': "Error"
        }
    }
</script>