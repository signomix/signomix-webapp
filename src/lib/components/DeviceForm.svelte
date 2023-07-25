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
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-type" class="form-label">Type</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-type" bind:value={config.type} readonly={readonly}>
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
            <input type="text" class="form-control" id="input-channels" bind:value={config.channelsAsString} readonly={readonly}>
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
            <input type="text" class="form-control" id="input-admins" bind:value={config.administrators} readonly={readonly}>
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
            <input type="text" class="form-control" id="input-latitude" bind:value={config.latitude} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-longitude" class="form-label">Longitude</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-longitude" bind:value={config.longitude} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-altitude" class="form-label">Altitude</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-altitude" bind:value={config.altitude} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-interval" class="form-label">Transmission interval</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-interval" bind:value={config.transmissionInterval} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-interval" class="form-label">Description</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control" id="input-description"  rows="3" value="{config.description}" readonly={readonly}/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-decoder" class="form-label">Payload decoder script</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control" id="input-decoder"  rows="3" value="{config.encoder}" readonly={readonly}/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-processor" class="form-label">Data processor script</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control" id="input-processor"  rows="3" value="{config.code}" readonly={readonly}/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-config" class="form-label">Configuration</label>
        </div>
        <div class="col-md-9">
            <textarea class="form-control" id="input-config"  rows="3" value="{config.configuration}" readonly={readonly}/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-application" class="form-label">Application ID</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-application" bind:value={config.applicationID} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-status" class="form-label">Status</label>
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control" id="input-status" bind:value={config.state} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-lastseen" class="form-label">Last seen</label>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-lastseen" value={new Date(config.lastSeen)} readonly={readonly}>
        </div>
    </div>
        <!--
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-email" class="form-label">Email</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-email" bind:value={config.settings.email} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-language" class="form-label">Language</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-language" bind:value={config.settings.preferredLanguage} readonly={readonly}>
        </div>
        
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-role" class="form-label">Role</label>
        </div>
        <div class="col-md-5">
            <input disabled type="text" class="form-control" id="input-role" bind:value={config.settings.role} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-createdAt" class="form-label">Registration</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-createdAt" value={new Date(config.settings.createdAt).toISOString() } readonly>
        </div>
    </div>
-->
    <!--
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-title" class="form-label">Title</label>
        </div>
        <div class="col-md-11">
            <input type="text" class="form-control" id="input-name" bind:value={data.title}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-team" class="form-label">Team</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-team" bind:value={data.team}>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-admins" class="form-label">Administrators</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-admins" bind:value={data.administrators}>
        </div>
    </div>
-->
<!--
    <hr>
    <div class="row"><div class="col"><h6>Sposoby powiadomień</h6></div></div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-generalNotificationChannel" class="form-label">General notifications</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-generalNotificationChannel" bind:value={config.settings.generalNotificationChannel} readonly={readonly}>
                <option value="SIGNOMIX">W aplikacji</option>
                <option value="SMTP">E-mail</option>
                <option value="WEBHOOK">Webhook</option>
            </select>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-generalNotificationChannelConfig" bind:value={config.settings.generalNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-infoNotificationChannel" class="form-label">Info notifications</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-infoNotificationChannel" bind:value={config.settings.infoNotificationChannel} readonly={readonly}>
                <option value="SIGNOMIX">W aplikacji</option>
                <option value="SMTP">E-mail</option>
                <option value="WEBHOOK">Webhook</option>
            </select>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-infoNotificationChannelConfig" bind:value={config.settings.infoNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-warningNotificationChannel" class="form-label">Warning notifications</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-warningNotificationChannel" bind:value={config.settings.warningNotificationChannel} readonly={readonly}>
                <option value="SIGNOMIX">W aplikacji</option>
                <option value="SMTP">E-mail</option>
                <option value="WEBHOOK">Webhook</option>
            </select>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-warningNotificationChannelConfig" bind:value={config.settings.warningNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-alertNotificationChannel" class="form-label">Alert notifications</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-alertNotificationChannel" bind:value={config.settings.alertNotificationChannel} disabled={readonly}>
                <option value="SIGNOMIX">W aplikacji</option>
                <option value="SMTP">E-mail</option>
                <option value="WEBHOOK">Webhook</option>
            </select>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-alertNotificationChannelConfig" bind:value={config.settings.alertNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    -->
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/settings" class="btn btn-outline-secondary mt-1" on:click={handleCancel}>Cancel</a>
            <button class="btn btn-outline-primary me-4 mt-1" on:click={handleSave}>Save</button>
        </div>
    </div>
    {/if}
</form>
<script>
    export let config
    export let callback
    export let readonly

    console.log('config',config);   

    function handleSave(event) {
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }
</script>