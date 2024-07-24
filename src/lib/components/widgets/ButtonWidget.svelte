<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import Dialog from '$lib/components/Dialog.svelte'
    export let config

    $: title = config.title != undefined ? config.title : 'Command button';

    let dialog

    let status = 0
    let promise

    function decide() {
        dialog.showModal()
    }

    function closeInfo(decision) {
        status = 0
    }

    async function sendCommand(decision) {
        dialog.close()
        if (!decision || status != 0) {
            status = 0
            return
        }
        let apiUrl = utils.getBackendUrl(location) + "/api/core/actuator/" + config.dev_id + '/'
        let command;
        switch (config.commandType) {
            case 'plain':
                //console.log('sendCommand: ', config.commandText);
                command = config.commandText;
                apiUrl += 'plain'
                break;
            case 'hex':
                //console.log('sendCommand: ', config.commandText);
                command = config.commandText;
                apiUrl += 'hex'
                break;
            case 'json':
                //console.log('sendCommand: ', config.commandJSON);
                command = config.commandJSON;
                apiUrl += 'json'
                break;
            default:
                console.log('Unknown command type: ', config.commandType);
                return;
        }

        promise = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': $token
            },
            body: command
        }).then(response => {
            if (response.ok) {
                //console.log('Command sent successfully');
                status = 1
            } else {
                //console.log('Error sending command');
                status = 2
            }
            return 'OK'
        }).catch(error => {
            //console.log('Error sending command: ', error);
            status = 2
            return 'ERROR'
        })



    }

    let labels = {
        'sendQuestion': {
            'pl': "Czy na pewno chcesz wysłać polecenie?",
            'en': "Are you sure you want to send the command?"
        },
        'ok': {
            'pl': "OK",
            'en': "OK"
        },
        'save': {
            'pl': "Wyślij",
            'en': "Send"
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel"
        },
        'commandSent': {
            'pl': "Polecenie zarejestrowane",
            'en': "Command scheduled"
        },
        'commandError': {
            'pl': "Błąd rejestrowania polecenia",
            'en': "Error scheduling command"
        }
    }

</script>
<Dialog bind:dialog callback={sendCommand} title={utils.getLabel('sendQuestion',labels,$language)}
    labels={[utils.getLabel('save',labels,$language), utils.getLabel('cancel',labels,$language)]} color="body">
</Dialog>
{#if status==0}
<div class="container p-0">
    <a href="#" on:click|preventDefault={decide} class="btn btn-danger w-100" role="button"
        aria-disabled="true">{title}</a>
</div>
{:else if status==1}
<div class="container p-0">
    <a href="#" on:click|preventDefault={closeInfo} class="btn btn-success w-100" role="button"
        aria-disabled="true">{utils.getLabel('ok',labels,$language)}</a>
    <p>{utils.getLabel('commandSent',labels,$language)}</p>
</div>
{:else}
<div class="container p-0">
    <a href="#" on:click|preventDefault={closeInfo} class="btn btn-danger w-100" role="button"
        aria-disabled="true">{utils.getLabel('ok',labels,$language)}</a>
    <p>{utils.getLabel('commandError',labels,$language)}</p>
</div>
{/if}