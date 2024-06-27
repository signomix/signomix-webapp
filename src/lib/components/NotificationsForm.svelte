<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('login',labels,$language)}</label>
        </div>
        <div class="col-md-11">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.uid}>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <h6>{utils.getLabel('notyfication_methods',labels,$language)}</h6>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <h6>{utils.getLabel('type',labels,$language)}</h6>
        </div>
        <div class="col-md-3">
            <h6>{utils.getLabel('channel',labels,$language)}</h6>
        </div>
        <div class="col-md-7">
            <h6>{utils.getLabel('config',labels,$language)}</h6>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-generalNotificationChannel"
                class="form-label">{utils.getLabel('general_notifications',labels,$language)}</label>
        </div>

        <div class="col-md-2">
            <select class="form-select" id="input-generalNotificationChannel" value={getChannelName('general')}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,$language)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,$language)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,$language)}</option>
                {#if utils.isServiceAvailable($profile,'sms') }
                <option value="SMS">SMS</option>
                {/if}
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-generalNotificationChannelConfig"
                value={getChannelConfig('general')} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-infoNotificationChannel"
                class="form-label">{utils.getLabel('info_notifications',labels,$language)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-infoNotificationChannel" value={getChannelName('info')}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,$language)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,$language)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,$language)}</option>
                {#if utils.isServiceAvailable($profile,'sms') }
                <option value="SMS">SMS</option>
                {/if}
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-infoNotificationChannelConfig"
                value={getChannelConfig('info')} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-warningNotificationChannel"
                class="form-label">{utils.getLabel('warning_notifications',labels,$language)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-warningNotificationChannel" value={getChannelName('warning')}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,$language)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,$language)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,$language)}</option>
                {#if utils.isServiceAvailable($profile,'sms') }
                <option value="SMS">SMS</option>
                {/if}
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-warningNotificationChannelConfig"
                value={getChannelConfig('warning')} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-alertNotificationChannel"
                class="form-label">{utils.getLabel('alert_notifications',labels,$language)}</label>
        </div>
        <div class="col-md-2">
            <select class="form-select" id="input-alertNotificationChannel" value={getChannelName('alert')}
                readonly={readonly}>
                <option value="SIGNOMIX">{utils.getLabel('in_app',labels,$language)}</option>
                <option value="SMTP">{utils.getLabel('email',labels,$language)}</option>
                <option value="WEBHOOK">{utils.getLabel('webhook',labels,$language)}</option>
                {#if utils.isServiceAvailable($profile,'sms') }
                <option value="SMS">SMS</option>
                {/if}
            </select>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-alertNotificationChannelConfig"
                value={getChannelConfig('alert')} readonly={readonly}>
        </div>
    </div>

    <hr>

    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="{backLocation}"
                class="btn btn-outline-secondary mt-1">{utils.getLabel('cancel',labels,$language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1"
                on:click={handleSave}>{utils.getLabel('save',labels,$language)}</button>
        </div>
    </div>
    {/if}
</form>
<script>
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';

    export let config
    export let callback
    export let readonly
    export let backLocation


    let userLogin = ''
    let errorMessage = ''

    function getChannelName(channel) {
        try {
            if (channel == 'general') {
                return config.generalNotificationChannel.substring(0, config.generalNotificationChannel.indexOf(":"))
            } else if (channel == 'info') {
                return config.infoNotificationChannel.substring(0, config.infoNotificationChannel.indexOf(":"))
            } else if (channel == 'warning') {
                return config.warningNotificationChannel.substring(0, config.warningNotificationChannel.indexOf(":"))
            } else if (channel == 'alert') {
                return config.alertNotificationChannel.substring(0, config.alertNotificationChannel.indexOf(":"))
            }
        } catch (e) {
            return ''
        }
        return ''
    }
    function getChannelConfig(channel) {
        try {
            if (channel == 'general') {
                return config.generalNotificationChannel.substring(config.generalNotificationChannel.indexOf(":") + 1)
            } else if (channel == 'info') {
                return config.infoNotificationChannel.substring(config.infoNotificationChannel.indexOf(":") + 1)
            } else if (channel == 'warning') {
                return config.warningNotificationChannel.substring(config.warningNotificationChannel.indexOf(":") + 1)
            } else if (channel == 'alert') {
                return config.alertNotificationChannel.substring(config.alertNotificationChannel.indexOf(":") + 1)
            }
        } catch (e) {
            return ''
        }
        return ''
    }

    function handleSave(event) {
        config.generalNotificationChannel = document.getElementById('input-generalNotificationChannel').value
            + ':' + document.getElementById('input-generalNotificationChannelConfig').value
        config.infoNotificationChannel = document.getElementById('input-infoNotificationChannel').value
            + ':' + document.getElementById('input-infoNotificationChannelConfig').value
        config.warningNotificationChannel = document.getElementById('input-warningNotificationChannel').value
            + ':' + document.getElementById('input-warningNotificationChannelConfig').value
        config.alertNotificationChannel = document.getElementById('input-alertNotificationChannel').value
            + ':' + document.getElementById('input-alertNotificationChannelConfig').value
        //prevent saving parameters other than notification channels
        config.name = null
        config.surname = null
        config.email = null
        //console.log('save: ',config)
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
        'mobile': {
            'en': 'Mobile',
            'pl': 'Tel. komórkowy',
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
            'en': 'Configuration of notification types',
            'pl': 'Konfiguracja typów powiadomień',
        },
        'general_notifications': {
            'en': 'General',
            'pl': 'Ogólne',
        },
        'info_notifications': {
            'en': 'Info',
            'pl': 'Informacyjne',
        },
        'warning_notifications': {
            'en': 'Warning',
            'pl': 'Ostrzegawcze',
        },
        'alert_notifications': {
            'en': 'Alert',
            'pl': 'Alarmowe',
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
        'organization': {
            'en': 'Organization',
            'pl': 'Organizacja'
        },
        'tenant': {
            'pl': 'Organizacja',
            'en': 'Organization'
        },
        'password': {
            'en': 'Password',
            'pl': 'Hasło'
        },
        'changePassword': {
            'en': 'Change password',
            'pl': 'Zmień hasło'
        },
        'deleteAccount': {
            'en': 'Delete account',
            'pl': 'Usuń konto'
        },
        'type': {
            'en': 'Type',
            'pl': 'Typ'
        },
        'channel': {
            'en': 'Channel',
            'pl': 'Kanał'
        },
        'config': {
            'en': 'Configuration',
            'pl': 'Konfiguracja'
        },
        'english': {
            'en': 'English',
            'pl': 'English'
        },
        'polish': {
            'en': 'Polski',
            'pl': 'Polski'
        },
        'alert_remove': {
            'pl': 'Jeśli chcesz usunąć konto, skontaktuj się z administratorem wysyłąjąc wiadomość na adres signomix@experiot.pl z konta e-mail podanego podczas zakładania konta.',
            'en': 'If you want to remove your account, please contact administrator by sending e-mail to signomix@experiot pl from the e-mail address provided during account creation.'
        },
        'standard': {
            'pl': 'Standardowe',
            'en': 'Standard'
        },
        'free': {
            'pl': 'Darmowe',
            'en': 'Free'
        },
        'mgn.admin': {
            'pl': 'Adm. zarządzający',
            'en': 'Managing admin'
        },
        'admin': {
            'pl': 'Administrator',
            'en': 'Admin'
        },
        'sys.admin': {
            'pl': 'Admin. systemowy',
            'en': 'System admin'
        },
        'primary': {
            'pl': 'Premium',
            'en': 'Premium'
        },
        'application': {
            'pl': 'Aplikacja',
            'en': 'Application'
        },
        'demo': {
            'pl': 'Demo',
            'en': 'Demo'
        },
        'readonly': {
            'pl': 'Tylko do odczytu',
            'en': 'Readonly'
        },
        'extended': {
            'pl': 'Rozszerzone',
            'en': 'Extended'
        },
        'anonymous': {
            'pl': 'Anonimowe',
            'en': 'Anonymous'
        },
        'subscriber': {
            'pl': 'Subskrybent',
            'en': 'Subscriber'
        }


    }


</script>