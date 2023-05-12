<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h2>{data.name}</h2><a href="/dashboards/{data.id}/edit">Configure</a>
</div>
<div class="component">
    <div class="row">
        
        {#each data.widgets as widget}
        <div class="col-{widget.width} p-2 m-1 border border-primary">{widget.title}</div>
        {/each}
        
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