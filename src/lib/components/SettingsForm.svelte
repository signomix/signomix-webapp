<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">Login</label>
        </div>
        <div class="col-md-3">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.settings.uid}>
        </div> 
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">Name</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-name" bind:value={config.settings.name} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-surname" class="form-label">Surame</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-surname" bind:value={config.settings.surname} readonly={readonly}>
        </div>
    </div>
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
    <hr>
    <div class="row"><div class="col"><h6>Sposoby powiadomień</h6></div></div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-generalNotificationChannel" class="form-label">General notifications</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-generalNotificationChannel" bind:value={config.settings.generalNotificationChannel} readonly={readonly}>
                <option value="signomix">W aplikacji</option>
                <option value="smtp">E-mail</option>
                <option value="webhook">Webhook</option>
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
                <option value="signomix">W aplikacji</option>
                <option value="smtp">E-mail</option>
                <option value="webhook">Webhook</option>
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
                <option value="signomix">W aplikacji</option>
                <option value="smtp">E-mail</option>
                <option value="webhook">Webhook</option>
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
                <option value="signomix">W aplikacji</option>
                <option value="smtp">E-mail</option>
                <option value="webhook">Webhook</option>
            </select>
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control" id="input-alertNotificationChannelConfig" bind:value={config.settings.alertNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <button class="btn btn-outline-secondary mt-1" on:click={handleCancel}>Cancel</button>
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