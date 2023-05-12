<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    {#if data.id=='new'}
    <h2>Nowy pulpit</h2>
    {:else}
    <h2>Modyfikacja definicji pulpitu</h2>
    {/if}
</div>
<div class="component">
    <div class="row">
        <div class="col">
            <form class="text-center" on:submit|preventDefault={doSend}>
                <div class="form-floating mb-3">
                    <input disabled type="text" class="form-control" id="id" name="id" placeholder="ID konfiguracji"
                        value={data.id=='new' ?'':data.id}>
                    <label for="id">ID</label>
                </div>
                <div class="form-floating mb-3">
                    <textarea class="form-control" id="description" name="description"
                        rows="3">{data.description||''}</textarea>
                    <label for="description">Opis</label>
                </div>
                <div class="form-floating mb-3">
                    <input disabled type="datetime-local" class="form-control" id="createdAt" name="createdAt"
                        value={utils.getLocalDateFormat(data.created)}>
                    <label for="createdAt">Data utworzenia</label>
                </div>
                <div class="form-floating mb-3">
                    <input disabled type="datetime-local" class="form-control" id="updatedAt" name="updatedAt"
                        value={utils.getLocalDateFormat(data.updated)}>
                    <label for="initiatedAt">Data modyfikacji</label>
                </div>
                {#if errorMessage!=''}
                <div class="alert alert-danger w-100" role="alert">
                    {errorMessage}
                </div>
                {/if}
                <div class="checkbox form-floating mb-3">
                    <button class="w-25 btn btn-lg btn-primary" type="submit">Zapisz</button>
                    <button class="w-25 btn btn-lg btn-secondary" type="button" on:click={cancel}>Wróć</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';

    export let data
    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });

    function doSend(event) {

        let dataToSend = {}
        let method = 'POST'
        if (event.target.elements['id'].value.length > 0) {
            dataToSend.id = event.target.elements['id'].value
        }
        dataToSend.description = event.target.elements['description'].value
        dataToSend.created = utils.getDateApiFormat(event.target.elements['createdAt'].value)
        dataToSend.updated = event.target.elements['updatedAt'].value
        if (dataToSend.updated.length > 0) {
            dataToSend.updated = utils.getDateApiFormat(dataToSend.updated)
        }

        const headers = new Headers()
        let url = utils.getBackendUrl(location) + '/api/dashboards/'
        if (!(dataToSend.id == null || dataToSend.id == '' || dataToSend.id == undefined)) {
            url = url + dataToSend.id
            method = 'PUT'
        }
        if (!isValid(dataToSend)) {
            return
        }
        headers.set('Authorization', 'Basic ' + btoa(session.login + ":" + session.password));
        headers.set('Content-Type', 'application/json')
        //console.log('URL:' + url)
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(dataToSend) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/configs')
            } else if (response.status == 401 || response.status == 403 || response.status == 404) {
                utils.setAuthorized(session, false)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
            }
            console.log(error)
        });
    }

    function isValid(data) {

        return true
    }

    function cancel() {
        goto('/dashboards')
    }
    function clearMessage() {
        errorMessage = ''
    }

</script>