<form class="mb-2">
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">EUI</label>
        </div>
        <div class="col-md-10">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.eui}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">Name</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} disabled={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-type" class="form-label">Type</label>
        </div>
        <div class="col-md-10">
            <select class="form-select" id="input-type" bind:value={config.type} disabled={readonly}>
                <option value="TTN">TTN device</option>
                <option value="CHIRPSTACK">ChirpStack device</option>
                <option value="VIRTUAL">Virtual device</option>
                <option value="GENERIC">Generic</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-owner" class="form-label">Owner</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-owner" bind:value={config.userID} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-team" class="form-label">Team</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-team" bind:value={config.team} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-admins" class="form-label">Administrators</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-admins" bind:value={config.administrators}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-key" class="form-label">Key</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-key" bind:value={config.key} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-channels" class="form-label">Measurements</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-channels" bind:value={config.channelsAsString}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-groups" class="form-label">Groups</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-groups" bind:value={config.groups} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-project" class="form-label">Project</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-project" bind:value={config.project} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-latitude" class="form-label">Latitude</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-latitude" bind:value={config.latitude}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-longitude" class="form-label">Longitude</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-longitude" bind:value={config.longitude}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-altitude" class="form-label">Altitude</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-altitude" bind:value={config.altitude}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-interval" class="form-label">Transmission interval</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-interval" bind:value={config.transmissionInterval}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-interval" class="form-label">Description</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-description" rows="3" value="{config.description}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-decoder" class="form-label">Payload decoder script</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-decoder" rows="3" value="{config.encoder}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-processor" class="form-label">Data processor script</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-processor" rows="3" value="{config.code}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-config" class="form-label">Configuration</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control mb-1" id="input-config" rows="3" value="{config.configuration}"
                readonly={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-application" class="form-label">Application ID</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-application" bind:value={config.applicationID}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-status" class="form-label">Status</label>
        </div>
        <div class="col-md-9">
            <input disabled type="number" class="form-control" id="input-status" bind:value={config.state}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-lastseen" class="form-label">Last seen</label>
        </div>
        <div class="col-md-9">
            <input disabled type="datetime-local" class="form-control" id="input-lastseen" value={utils.getLocalDateFormatFromTimestamp(config.lastSeen)}>
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/devices" class="btn btn-outline-secondary mt-1" on:click|preventDefault={handleCancel}>Cancel</a>
            <button class="btn btn-outline-primary me-4 mt-1" on:click={handleSave}>Save</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';

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

    
</script>