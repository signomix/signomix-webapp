<form>
    do zrobienia
</form>
<script>
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { dev } from '$app/environment';

    export let config
    export let callback
    export let readonly

    console.log('config', config);

    function getChannelName(channel) {
        if (channel == 'general') {
            return config.generalNotificationChannel.substring(0, config.generalNotificationChannel.indexOf(":"))
        } else if (channel == 'info') {
            return config.infoNotificationChannel.substring(0, config.infoNotificationChannel.indexOf(":"))
        } else if (channel == 'warning') {
            return config.warningNotificationChannel.substring(0, config.warningNotificationChannel.indexOf(":"))
        } else if (channel == 'alert') {
            return config.alertNotificationChannel.substring(0, config.alertNotificationChannel.indexOf(":"))
        }
        return ''
    }
    function getChannelConfig(channel) {
        if (channel == 'general') {
            return config.generalNotificationChannel.substring(config.generalNotificationChannel.indexOf(":") + 1)
        } else if (channel == 'info') {
            return config.infoNotificationChannel.substring(config.infoNotificationChannel.indexOf(":") + 1)
        } else if (channel == 'warning') {
            return config.warningNotificationChannel.substring(config.warningNotificationChannel.indexOf(":") + 1)
        } else if (channel == 'alert') {
            return config.alertNotificationChannel.substring(config.alertNotificationChannel.indexOf(":") + 1)
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
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }
    function handlePassword(event) {
        alert('Not implemented yet')
    }
    function handleRemove(event) {
        alert('Not implemented yet')
    }

    const apiUrl = utils.getBackendUrl(location) + '/api/core/organization/' + config.organization
    let promise = sgxdata.getOrganization(dev, apiUrl, $token);


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

    }


</script>