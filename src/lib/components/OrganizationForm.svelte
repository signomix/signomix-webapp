<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-id" class="form-label">{utils.getLabel('id',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input disabled type="text" class="form-control" id="input-id" bind:value={config.id}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-code" class="form-label">{utils.getLabel('code',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-code" bind:value={config.code} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-locked" class="form-label">{utils.getLabel('locked',labels,$language)}</label>
        </div>
        <div class="col-md-1">
            <input class="form-check-input" type="checkbox" id="input-locked" bind:checked={config.locked} readonly={readonly}>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-11">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-config" class="form-label">{utils.getLabel('configuration',labels,$language)}</label>
        </div>
        <div class="col-md-11">
            <textarea class="form-control mb-1" id="input-config" rows="3" bind:value="{config.configuration}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <textarea rows="4" class="form-control" id="input-description" bind:value={config.description} readonly={readonly}></textarea>
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/settings" class="btn btn-outline-secondary mt-1"
                on:click={handleCancel}>{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={handleSave}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { utils } from '$lib/utils.js';
    import { profile,token, language, isAuthenticated } from '$lib/usersession.js';
    import { dev } from '$app/environment';

    export let config
    export let callback
    export let readonly

    console.log('config', config);

    function handleSave(event) {
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }

    // const apiUrl = utils.getBackendUrl(location) + '/api/organization/'+$profile.organization
    // let promise = sgxdata.getOrganization(dev,apiUrl,$token);

    let labels = {
        'id': {
            'en': 'ID',
            'pl': 'ID',
        },
        'name': {
            'en': 'Name',
            'pl': 'Nazwa',
        },
        'code': {
            'en': 'Code',
            'pl': 'Kod'
        },
        'description': {
            'en': 'Description',
            'pl': 'Opis'
        },
        'configuration': {
            'en': 'Configuration',
            'pl': 'Konfiguracja'
        },
        'locked': {
            'en': 'Locked',
            'pl': 'Zablokowana'
        },
    }


</script>