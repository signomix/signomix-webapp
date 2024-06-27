<!-- <Dialog title="Uwaga!" message={errorMessage} bind:dialog callback={closeDialog} labels={["OK"]} color="danger">
</Dialog> -->
<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-uid" class="form-label">{utils.getLabel('login',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            <input disabled={!isEditable('uid')} type="text" class="form-control" id="input-uid" bind:value={userLogin}
                readonly={readonly||!isEditable('uid')}>
        </div>
        <div class="col-md-1 col-form-label">
            <label for="input-account" class="form-label">{utils.getLabel('account',labels,$language)}</label>
        </div>
        <div class="col-md-5">
            {#if isEditable('type')}
            <select class="form-select" id="input-account" value="{config.type}" readonly={readonly}>
                {#each getTypesAllowed() as type}
                <option value={type.type}>{utils.getLabel(type.name,labels,$language)}</option>
                {/each}
            </select>
            {:else}
            <input disabled={!isEditable('type')} type="text" class="form-control" id="input-account"
                value={sgxhelper.getAccountTypeName(config.type,$language)} readonly={readonly}>
            {/if}
            <!--
            <input disabled={!isManager} type="text" class="form-control" id="input-account"
                value={sgxhelper.getAccountTypeName(config.type,$language).toUpperCase()}
                readonly={readonly}>
            -->
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
            <!--             <input type="tel" class="form-control" name="input-phone" id="input-phone" bind:value={config.phone} pattern="[0-9]"
                readonly={readonly}> -->
            <input type="text" class="form-control" name="input-phone" id="input-phone" bind:value={config.phone}
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
            <!-- <input type="tel" class="form-control" id="input-phone_prefix" bind:value={config.phonePrefix}
                pattern="[0-9]{3}" readonly={readonly}> -->
            <input type="text" class="form-control" id="input-phone_prefix" bind:value={config.phonePrefix}
                readonly={readonly}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-role" class="form-label">{utils.getLabel('roles',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input disabled={!isEditable('role')} type="text" class="form-control" id="input-role"
                bind:value={config.role} readonly={readonly}>
        </div>
    </div>

    {#if config.tenant!=0 && config.organization!=utils.getDefaultOrganizationId()}
    {#await promise2}
    {:then data}
    <div class="row">
        <div class="col-md-2 col-form-label">
            <label for="input-tenant" class="form-label">{utils.getLabel('tenant',labels,$language)}</label>
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control" id="input-tenant" value={data.name} disabled>
        </div>
    </div>
    {/await}
    {/if}
    {#if config.organization!=utils.getDefaultOrganizationId() && config.tenant==0}
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
            <input type="text" class="form-control" id="input-pathRoot" value={pathRoot} disabled>
        </div>
        <div class="col-md-8">
            <input disabled={!isEditable('pathExt')} type="text" class="form-control" id="input-path"
                bind:value={pathExt} readonly={readonly}>
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

<!--     <hr>

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

 -->    
 <hr>

    <div class="row">
        {#if isEditable('password') && config.uid != $profile.uid}
        <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-password" class="form-label">{utils.getLabel('password',labels,$language)}</label>
            </div>
            <div class="col-md-10">
                <input type="text" class="form-control" id="input-password" bind:value={password} readonly={readonly}>
            </div>
        </div>
        {:else if config.uid == $profile.uid}
        <div class="col">
            <div class="col-form-label  text-center">
                <a href="{setPassLocation}"
                    class="btn btn-outline-danger mt-1">{utils.getLabel('changePassword',labels,$language)}</a>
            </div>
        </div>
        <div class="col">
            <div class="col-form-label text-center">
                <button class="btn btn-outline-danger mt-1"
                    on:click={handleRemove}>{utils.getLabel('deleteAccount',labels,$language)}</button>
            </div>
        </div>
        {/if}
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
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';
    import Dialog from "$lib/components/Dialog.svelte";

    export let config
    export let callback
    export let readonly
    export let backLocation
    export let setPassLocation


    let pathRoot = getPathRoot()
    let pathExt = getPathExt()
    let userLogin = ''
    let password = isNew() ? '' : null
    let errorMessage = ''
    let dialog

    /*     function closeDialog(result) {
            console.log("closeDialog", result)
            try { dialog.close() } catch (e) { }
            if (result) {
                handleSave(true)
            }
        } */

    //console.log('config', config);
    if (!isNew()) {
        userLogin = config.uid
    }

    function getUserTypeName(type) {
        return utils.getLabel(sgxhelper.getAccountTypeName(type, $language))
    }

    function isEditable(fieldName) {
        //console.log('isEditable', $profile.type, $profile.tenant, config.tenant, $profile.organization, config.organization)
        // system admin can edit all
        if ($profile.type == 1) {
            if (fieldName == 'uid' && !isNew()) {
                return false
            } else {
                return true
            }
        }
        // managing admin can edit all users from his organization and tenants
        if ($profile.type == 8) {
            if (fieldName == 'uid' && !isNew()) {
                return false
            }
            if ($profile.organization != config.organization) {
                return false
            }
            if (fieldName == 'organization') {
                return false
            }
            return true
        }
        // tenant admin can edit all users from the same tenant
        if ($profile.type == 9) {
            if (fieldName == 'uid' && !isNew()) {
                return false
            }
            if ($profile.tenant != config.tenant) {
                return false
            }
            if (fieldName == 'organization' || fieldName == 'tenant' || fieldName == 'path' || fieldName == 'pathRoot') {
                return false
            }
            return true
        }
        // user can edit selected fields
        if (fieldName == 'name' || fieldName == 'surname' || fieldName == 'email' || fieldName == 'phone' || fieldName == 'phonePrefix'
            || fieldName == 'preferredLanguage'
            || fieldName == 'generalNotificationChannel' || fieldName == 'infoNotificationChannel' || fieldName == 'warningNotificationChannel'
            || fieldName == 'alertNotificationChannel' || fieldName == 'password') {
            return true
        }
        return false
    }
    function isNew() {
        return config.uid == null || config.uid == undefined || config.uid == 'new'
    }

    function getPathRoot() {
        let tmpCtxRoot = $contextRoot
        //console.log('$contextRoot', tmpCtxRoot)
        let result
        if (tmpCtxRoot == null || tmpCtxRoot == undefined) {
            tmpCtxRoot = ''
        } else if (config.path == null || config.path == undefined || config.path == '') {
            result = tmpCtxRoot.length > 0 ? tmpCtxRoot : ''
        } else if (config.path.indexOf('.') > -1) {
            result = config.path.substring(0, config.path.indexOf('.'))
        } else {
            result = config.path
        }
        if (result.endsWith('.')) {
            result = result.substring(0, result.length - 1)
        }
        //console.log('getPathRoot', result)
        return result
    }
    function getPathExt() {
        let result
        if (config.path == null || config.path == undefined || config.path == '') {
            result = ''
        } else if (config.path.indexOf('.') > -1) {
            if (config.path.indexOf('.') == config.path.length - 1) {
                result = ''
            } else {
                result = config.path.substring(config.path.indexOf('.') + 1)
            }
        } else {
            result = ''
        }
        if (result.length > 0 && !result.startsWith('.')) {
            result = '.' + result
        }
        //console.log('getPathExt', result)
        return result
    }

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

    function getDateAsString(d) {
        try {
            return new Date(d).toISOString()
        } catch (e) {
            return ''
        }
    }

    function handleSave(event) {
        config.uid = userLogin
        if (pathExt.length > 0 && !pathExt.startsWith('.')) {
            pathExt = '.' + pathExt
        }
        config.path = pathRoot + pathExt
        //config.pathRoot = ""
        config.tenant = 0
        if ($context != null && $context != undefined && $context > 0) {
            config.tenant = $context
            //config.path = $context.path
            //config.pathRoot = $context.pathRoot
        }
        //console.log('handleSave.passwod', password)
        if ((isNew() && password != null && password.length > 0)
            || isEditable('password') && config.uid != $profile.uid) {
            config.password = password
        } else {
            //console.log('password', password)
            delete config.password
        }
        config.generalNotificationChannel = document.getElementById('input-generalNotificationChannel').value
            + ':' + document.getElementById('input-generalNotificationChannelConfig').value
        config.infoNotificationChannel = document.getElementById('input-infoNotificationChannel').value
            + ':' + document.getElementById('input-infoNotificationChannelConfig').value
        config.warningNotificationChannel = document.getElementById('input-warningNotificationChannel').value
            + ':' + document.getElementById('input-warningNotificationChannelConfig').value
        config.alertNotificationChannel = document.getElementById('input-alertNotificationChannel').value
            + ':' + document.getElementById('input-alertNotificationChannelConfig').value
        config.path = (pathRoot + pathExt).replace(/\//g, '.')
        try {
            config.phone = config.phone.trim()
        } catch (e) { }

        /*errorMessage=validate(config)
        if (errorMessage != "") {
            dialog.showModal()
            console.log("AFTER DIALOG");
            return;
        }*/
        callback(config)
    }
    function handleCancel(event) {
        callback(null)
    }
    /*     function validate(cfg){
            if(cfg.phone.startsWith("+") || cfg.phone.startsWith("0")||cfg.phone.length>9){
                return "Invalid phone number"
            }
            return ""
        } */

    /*     function handlePassword(event) {
            console.log('handlePassword')
            goto('/account/settings/password')
        } */
    function handleRemove(event) {
        alert(utils.getLabel('alert_remove', labels, $language))
    }

    function canAdministrate(user) {
        // system admin can edit all users
        //console.log('canAdministrate', $profile.uid, $profile.type, user.uid)
        if ($profile.uid == user.uid || $profile.type == 1) {
            return true
        }
        // admins can edit users from their organization
        if ($profile.organization != utils.getDefaultOrganizationId()
            && $profile.organization == user.organization) {
            if ($profile.type == 9) {
                // tenant admin can edit all users from the same tree path
                // TODO: check path and compare with user path
                return true
            } else if ($profile.type == 8) {
                // managing admin can edit all users from his organization and tenants
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    function getTypesAllowed() {
        let types = []
        //console.log('$context while adding user', $context)
        if ($profile.type == 8) { // managing admin
            types.push({ type: 0, name: 'standard' }) // standard
            types.push({ type: 4, name: 'free' }) // free
            types.push({ type: 9, name: 'admin' }) // tenant admin
            if ($context == null) {
                types.push({ type: 8, name: 'mgn.admin' }) // managing admin
            }
        } else if ($profile.type == 9) { // tenant admin
            types.push({ type: 0, name: 'standard' }) // standard
            types.push({ type: 4, name: 'free' }) // free
            types.push({ type: 9, name: 'admin' }) // tenant admin
        } else if ($profile.type == 1) { // system admin
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

    const organizationApiUrl = utils.getBackendUrl(location) + '/api/organization/' + config.organization
    let promise = sgxdata.getOrganization(dev, organizationApiUrl, $token);
    const tenantApiUrl = utils.getBackendUrl(location) + '/api/tenant/' + config.tenant
    let promise2 = {}
    if (config.tenant != undefined && config.tenant != 0) {
        promise2 = sgxdata.getTenant(dev, tenantApiUrl, $token);
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