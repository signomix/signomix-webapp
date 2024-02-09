<div class="row">
    <div class="col-12">
        {#if type == 'device'}
        <p>{utils.getLabel('info1d',labels,$language)} <b>{eui}</b>
            {utils.getLabel('info2',labels,$language)}
        </p>
        {/if}
        {#if type == 'group'}
        <p>{utils.getLabel('info1g',labels,$language)} <b>{eui}</b>
            {utils.getLabel('info2',labels,$language)}
        </p>
        {/if}
    </div>
</div>
<form class="mb-2">
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-from" class="form-label">{utils.getLabel('from',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input required type="datetime-local" class="form-control" id="input-from" bind:value={fromDate}
                on:change={handleClick}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('to',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input required type="datetime-local" class="form-control" id="input-to" bind:value={toDate}
                on:change={handleClick}>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            {#if zoneType==1}
            <input class="form-check-input" type="radio" name="gr" id="groupRadio1" value="1" on:click={setZoneType1}
                checked>
            {:else}
            <input class="form-check-input" type="radio" name="gr" id="groupRadio1" value="1" on:click={setZoneType1}>
            {/if}
            <label class="form-check-label" for="groupRadio1">
                {utils.getLabel('zone', labels, $language)}: {userZoneId}
            </label>
            {#if zoneType==0}
            <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio2" value="0"
                on:click={setZoneType0} checked>
            {:else}
            <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio2" value="0"
                on:click={setZoneType0}>
            {/if}
            <label class="form-check-label" for="gropuRadio2">
                {utils.getLabel('zone', labels, $language)}: UTC
            </label>
        </div>
    </div>
    <div class="row">
        <div class="col-form-label">
            {#if type == 'device'}
            <a href="/devices" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            {/if}
            {#if type == 'group'}
            <a href="/groups" class="btn btn-outline-secondary mt-1"
                on:click|preventDefault={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            {/if}
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click|preventDefault={handleDownload}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {#if docUrl != null}
    <div class="row">
        <div class="col-12">
            <a href={docUrl} download={eui+'.csv'} on:click={handleClick}
                target="_blank">{utils.getLabel('openFile',labels,$language)}</a>
        </div>
    </div>
    {/if}
    {#if errorMessage != null}
    <div class="alert alert-danger mt-2" role="alert">
        {errorMessage}
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

    export let eui
    export let callback
    export let type

    let docUrl = null
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let toDate = now.toISOString().slice(0, 16);
    let fromDate = '2000-01-01T00:00'
    let errorMessage = null
    let formError = null
    let userZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone
    let zoneId = userZoneId
    let zoneType = 1

    function validate() {
        if (fromDate == null || fromDate.length == 0) {
            errorMessage = utils.getLabel('fromDateRequired', labels, $language)
            return false
        }
        if (toDate == null || toDate.length == 0) {
            errorMessage = utils.getLabel('toDateRequired', labels, $language)
            return false
        }
        try {
            let d1 = new Date(fromDate)
            let d2 = new Date(toDate)
            if (d1 > d2) {
                errorMessage = utils.getLabel('fromDateAfterToDate', labels, $language)
                return false
            }
        } catch (e) {
            errorMessage = utils.getLabel('invalidDate', labels, $language)
            return false
        }
        return true
    }

    function setZoneType1(event) {
        zoneType = 1
        zoneId = userZoneId
    }
    function setZoneType0(event) {
        zoneType = 0
        zoneId = 'UTC'
    }

    function handleDownload(event) {
        if (!validate()) {
            return
        }
        if(type=='device'){
            downloadDeviceData(eui, toDate, fromDate, zoneId)
        }else if(type=='group'){
            downloadGroupData(eui, toDate, fromDate, zoneId)
        }else{
            errorMessage = 'Invalid type'
        }
        
    }

    function downloadDeviceData(eui, toDate, fromDate, zoneId) {
        // zone list: Intl.supportedValuesOf('timeZone')
        // actual zone: Intl.DateTimeFormat().resolvedOptions().timeZone
        const headers = new Headers()
        let toDateEncoded = encodeURIComponent(utils.getDateApiISOFormat(toDate))
        let fromDateEncoded = encodeURIComponent(utils.getDateApiISOFormat(fromDate))
        let url = utils.getBackendUrl(location) + "/api/provider/v2/device/" + eui + "/*"
            + "?query=from " + fromDateEncoded + " to " + toDateEncoded
            + "&zone=" + zoneId
        headers.set('Authentication', $token);
        headers.set('Accept', 'text/csv');
        let response = fetch(
            url,
            {
                method: 'GET',
                //referrerPolicy: 'strict-origin-when-cross-origin',
                mode: 'cors',
                headers: headers
            }
        ).then(response => response.blob())
            .then(blob => {
                docUrl = window.URL.createObjectURL(blob);
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

    function downloadGroupData(eui, toDate, fromDate, zoneId) {
        // zone list: Intl.supportedValuesOf('timeZone')
        // actual zone: Intl.DateTimeFormat().resolvedOptions().timeZone
        const headers = new Headers()
        let toDateEncoded = encodeURIComponent(utils.getDateApiISOFormat(toDate))
        let fromDateEncoded = encodeURIComponent(utils.getDateApiISOFormat(fromDate))
        let url = utils.getBackendUrl(location) + "/api/provider/group/" + eui + "/*"
            + "?query=from " + fromDateEncoded + " to " + toDateEncoded
            + "&zone=" + zoneId
        headers.set('Authentication', $token);
        headers.set('Accept', 'text/csv');
        let response = fetch(
            url,
            {
                method: 'GET',
                //referrerPolicy: 'strict-origin-when-cross-origin',
                mode: 'cors',
                headers: headers
            }
        ).then(response => response.blob())
            .then(blob => {
                docUrl = window.URL.createObjectURL(blob);
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

    function handleClick(event) {
        docUrl = null
        errorMessage = null
    }

    function handleCancel(event) {
        callback()
    }


    let labels = {
        'title': {
            'pl': "Pobiernie danych",
            'en': "Download data"
        },
        'info1d': {
            'pl': "Z urządzenia o identyfikatorze",
            'en': "From device with identifier"
        },
        'info1g': {
            'pl': "Z grupy urządzeń o identyfikatorze",
            'en': "From device group with identifier"
        },
        'info2': {
            'pl': "zostaną pobrane dane dotyczące wybranego zakresu czasu. Daty w generowanym pliku będą zapisane zgodnie z wybraną strefą czasową.",
            'en': "will be downloaded data for selected time range. Dates in generated file will be saved according to selected time zone."
        },
        'eui': {
            'pl': "EUI",
            'en': "EUI"
        },
        'from': {
            'pl': "Od daty",
            'en': "From date"
        },
        'to': {
            'pl': "Do daty",
            'en': "To date"
        },
        'zone': {
            'pl': "Strefa czasowa",
            'en': "Time zone"
        },
        'fromDateRequired': {
            'pl': "Data początkowa jest wymagana",
            'en': "From date is required"
        },
        'toDateRequired': {
            'pl': "Data końcowa jest wymagana",
            'en': "To date is required"
        },
        'fromDateAfterToDate': {
            'pl': "Data początkowa musi być przed datą końcową",
            'en': "From date must be before to date"
        },
        'invalidDate': {
            'pl': "Nieprawidłowa data",
            'en': "Invalid date"
        },
        'cancel': {
            'pl': "Powrót",
            'en': "Back"

        },
        'save': {
            'pl': "Pobierz dane",
            'en': "Download data"
        },
        'error': {
            'pl': "Błąd",
            'en': "Error"
        },
        'openFile': {
            'pl': "Otwórz plik",
            'en': "Open file"
        }
    }
</script>