<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('login',labels,session)}</label>
        </div>
        <div class="col-md-5">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.uid}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-account" class="form-label">{utils.getLabel('account',labels,session)}</label>
        </div>
        <div class="col-md-5">
            <input disabled type="text" class="form-control" id="input-account"
                value={sgxhelper.getAccountTypeName(config.type,session.language).toUpperCase()}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,session)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-surname" class="form-label">{utils.getLabel('surname',labels,session)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-surname" bind:value={config.surname} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-email" class="form-label">{utils.getLabel('email',labels,session)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-email" bind:value={config.email} readonly={readonly}>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-email" class="form-label">{utils.getLabel('phone_prefix',labels,session)}</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-email" bind:value={config.phonePrefix} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-role" class="form-label">{utils.getLabel('roles',labels,session)}</label>
        </div>
        <div class="col-md-10">
            <input disabled type="text" class="form-control" id="input-role" bind:value={config.role}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-language" class="form-label">{utils.getLabel('language',labels,session)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-language" bind:value={config.preferredLanguage}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-createdAt" class="form-label">{utils.getLabel('registration',labels,session)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-createdAt" value={new Date(config.createdAt).toISOString()
                } readonly>
        </div>
    </div>

    <hr>

    <div class="row">
        <div class="col">
            <h6>{utils.getLabel('notyfication_methods',labels,session)}</h6>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-generalNotificationChannel" class="form-label">{utils.getLabel('general_notifications',labels,session)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-generalNotificationChannel"
                bind:value={config.generalNotificationChannel} readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,session)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,session)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,session)}</option>
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-generalNotificationChannelConfig"
                bind:value={config.generalNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-infoNotificationChannel" class="form-label">{utils.getLabel('info_notifications',labels,session)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-infoNotificationChannel" bind:value={config.infoNotificationChannel}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,session)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,session)}</option>
                <option value="WEBHOOK">Web{utils.getLabel('webhook',labels,session)}hook</option>
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-infoNotificationChannelConfig"
                bind:value={config.infoNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-warningNotificationChannel" class="form-label">{utils.getLabel('warning_notifications',labels,session)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-warningNotificationChannel"
                bind:value={config.warningNotificationChannel} readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,session)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,session)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,session)}</option>
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-warningNotificationChannelConfig"
                bind:value={config.warningNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-alertNotificationChannel" class="form-label">{utils.getLabel('alert_notifications',labels,session)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-alertNotificationChannel" bind:value={config.alertNotificationChannel}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,session)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,session)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,session)}</option>
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-alertNotificationChannelConfig"
                bind:value={config.alertNotificationChannelConfig} readonly={readonly}>
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/settings" class="btn btn-outline-secondary mt-1" on:click={handleCancel}>{utils.getLabel('cancel',labels,session)}</a>
            <button class="btn btn-outline-primary me-4 mt-1" on:click={handleSave}>{utils.getLabel('save',labels,session)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { utils } from '$lib/utils.js';
    import { userSession } from '$lib/stores.js';

    export let config
    export let callback
    export let readonly

    console.log('config', config);
    let session;
    userSession.subscribe(value => {
        session = value;
    });

    function handleSave(event) {
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }

    let labels = {
            'login': {
                'en': 'Login',
                'pl': 'Login',
            },
            'name': {
                'en': 'Name',
                'pl': 'Imię',
            },
            'surname': {
                'en': 'Surname',
                'pl': 'Nazwisko',
            },
            'account': {
                'en': 'Account type',
                'pl': 'Typ konta',
            },
            'email': {
                'en': 'E-mail',
                'pl': 'E-mail',
            },
            'phone_prefix': {
                'en': 'Phone prefix',
                'pl': 'Prefiks telefonu',
            },
            'roles': {
                'en': 'Role',
                'pl': 'Rola',
            },
            'language': {
                'en': 'Preffered language',
                'pl': 'Preferowany język',
            },
            'registration': {
                'en': 'Registration date',
                'pl': 'Data rejestracji',
            },
            'notyfication_methods': {
                'en': 'Notification methods',
                'pl': 'Sposoby powiadomień',
            },
            'general_notifications': {
                'en': 'General notifications',
                'pl': 'Powiadomienia ogólne',
            },
            'info_notifications': {
                'en': 'Info notifications',
                'pl': 'Powiadomienia informacyjne',
            },
            'warning_notifications': {
                'en': 'Warning notifications',
                'pl': 'Powiadomienia ostrzegawcze',
            },
            'alert_notifications': {
                'en': 'Alert notifications',
                'pl': 'Powiadomienia alarmowe',
            },
            'cancel': {
                'en': 'Cancel',
                'pl': 'Anuluj',
            },
            'save': {
                'en': 'Save',
                'pl': 'Zapisz',
            },
            'in_app': {
                'en': 'In application',
                'pl': 'W aplikacji',
            },
            'webhook': {
                'en': 'Webhook',
                'pl': 'Webhook',
            },

        }
    

</script>