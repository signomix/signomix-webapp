<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('login',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input disabled type="text" class="form-control" id="input-uid" bind:value={config.uid}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-account" class="form-label">{utils.getLabel('account',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input disabled type="text" class="form-control" id="input-account"
                value={sgxhelper.getAccountTypeName(config.type,$language).toUpperCase()}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-name" class="form-label">{utils.getLabel('name',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-name" bind:value={config.name} readonly={readonly}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-surname" class="form-label">{utils.getLabel('surname',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-surname" bind:value={config.surname} readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-email" class="form-label">{utils.getLabel('email',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-email" bind:value={config.email} readonly={readonly}>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-phone" class="form-label">{utils.getLabel('mobile',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input type="tel" class="form-control" id="input-phone" bind:value={config.phone} pattern="[0-9]"
                readonly={readonly}>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-language" class="form-label">{utils.getLabel('language',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <!--             <input type="text" class="form-control" id="input-language" bind:value={config.preferredLanguage}
                readonly={readonly}> -->
            <select class="form-select" id="input-language" value={config.preferredLanguage} readonly={readonly}>
                <option value="pl">{utils.getLabel('polish',labels,$language)}</option>
                <option value="en">{utils.getLabel('english',labels,$language)}</option>
            </select>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-phone_prefix" class="form-label">{utils.getLabel('phone_prefix',labels,$language)}</label>
        </div>
        <div class="col-md-4">
            <input type="tel" class="form-control" id="input-phone_prefix" bind:value={config.phonePrefix}
                pattern="[0-9]{3}" readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-role" class="form-label">{utils.getLabel('roles',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input disabled type="text" class="form-control" id="input-role" bind:value={config.role}
                readonly={readonly}>
        </div>
    </div>
    {#if config.organization!=0}
    {#await promise}
    {:then data}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-organization" class="form-label">{utils.getLabel('organization',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-organization" value={data.name} disabled>
        </div>
    </div>
    {/await}
    {/if}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-path" class="form-label">{utils.getLabel('path',labels,$language)}</label>
        </div>
        <div class="col-md-2">
            <input type="text" class="form-control" id="input-pathRoot" value={pathRoot}
                disabled>
        </div>
        <div class="col-md-8">
            <input type="text" class="form-control" id="input-path" bind:value={pathExt}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-createdAt" class="form-label">{utils.getLabel('registration',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-createdAt" value={getDateAsString(config.createdAt)}
                disabled>
        </div>
    </div>

    <hr>

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

    <div class="row">
        <div class="col">
            <div class="col-form-label  text-center">
                <a href="/account/settings/password"
                    class="btn btn-outline-danger mt-1">{utils.getLabel('changePassword',labels,$language)}</a>
            </div>
        </div>
        <div class="col">
            <div class="col-form-label text-center">
                <button class="btn btn-outline-danger mt-1"
                    on:click={handleRemove}>{utils.getLabel('deleteAccount',labels,$language)}</button>
            </div>
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
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';

    export let config
    export let callback
    export let readonly
    export let backLocation

    let pathExt = ''
    let pathRoot = getPathRoot()

    console.log('config', config);

    function getPathRoot(){
        let tmpRoot
        if(config.path.indexOf('.')>-1){
            pathExt=config.path.substring(config.path.indexOf('.')+1).replace(/\./g,'/')
            tmpRoot=config.path.substring(0,config.path.indexOf('.'))
        }else{
            pathExt=''
            tmpRoot=config.path
        }
        if(tmpRoot.length==0){
            return ''
        }
        if(tmpRoot.endsWith('/')){
            return tmpRoot
        }else{
            return tmpRoot+'/'
        }
    }

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

    function getDateAsString(d) {
        try {
            return new Date(d).toISOString()
        } catch (e) {
            return ''
        }
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
        config.path=(pathRoot+pathExt).replace(/\//g,'.')
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }
    /*     function handlePassword(event) {
            console.log('handlePassword')
            goto('/account/settings/password')
        } */
    function handleRemove(event) {
        alert(utils.getLabel('alert_remove', labels, $language))
    }

    function canEdit(actualProfile, user) {
        // system admin can edit all users
        if (actualProfile.uid == user.uid || actualProfile.type == 1) {
            return true
        }
        // admins can edit users from their organization
        if (actualProfile.organization != utils.getDefaultOrganization()
            && actualProfile.organization == user.organization) {
            if (actualProfile.type == 9) {
                // tenant admin can edit all users from the same tree path
                // TODO: check path and compare with user path
                    return true
            } else if (actualProfile.type == 8) {
                // managing admin can edit all users from his organization and tenants
                return true
            } else {
                return false
            }
        }else{
            return false
        }
    }

    function getTypesAllowed(profile) {
        let types = []
        if (profile.type == 8) { // managing admin
            types.push({ type: 0, name: 'standard' }) // standard
            types.push({ type: 4, name: 'free' }) // free
            types.push({ type: 8, name: 'mgn.admin' }) // managing admin
            types.push({ type: 9, name: 'admin' }) // tenant admin
        } else if (profile.type == 9) { // tenant admin
            types.push({ type: 0, name: 'standard' }) // standard
            types.push({ type: 4, name: 'free' }) // free
            types.push({ type: 9, name: 'admin' }) // tenant admin
        } else if (profile.type == 1) { // system admin
            types.push({ type: 0, name: 'standard' }) // standard
            types.push({ type: 1, name: 'sys.admin' }) // system admin
            types.push({ type: 2, name: 'application' }) // application
            types.push({ type: 3, name: 'demo' }) // demo
            types.push({ type: 4, name: 'free' }) // free
            types.push({ type: 5, name: 'primary' }) // primary
            types.push({ type: 6, name: 'readonly' }) // readonly
            types.push({ type: 7, name: 'extended' }) // extended
            types.push({ type: 8, name: 'mgn.admin' }) // managing admin
            types.push({ type: 9, name: 'admin' }) // tenant admin
            types.push({ type: 10, name: 'anonymous' }) // anonymous
            types.push({ type: 100, name: 'subscriber' }) // subscriber
        }
        return types
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
        }

    }


</script>