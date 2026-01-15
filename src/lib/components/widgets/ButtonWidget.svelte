<script>
    import {
        token,
        profile,
        language,
        isAuthenticated,
        viewMode,
    } from "$lib/usersession.js";
    import { utils } from "$lib/utils.js";
    import { widgets } from "$lib/widgets.js";
    import { onMount } from "svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import Dialog2 from "$lib/components/Dialog2.svelte";
    import DialogValue from "$lib/components/DialogValue.svelte";
    import { page } from '$app/stores';

    export let config;

    $: title = config.title != undefined ? config.title : "Command button";
    $: euisString = $page.url.searchParams.get('euis');
    //$: euisArray = euisString ? euisString.split(',') : [];

    let dialog;

    let status = 0;
    let promise;
    let configuration = widgets.getConfiguration(config);

    onMount(() => {
        console.log("ButtonWidget mounted");
    });

    function decide() {
        dialog.showModal();
    }

    function closeInfo(decision) {
        status = 0;
    }
    function isViewMode(mode) {
        return "view" == mode;
    }

    async function sendCommand(decision, value) {
        dialog.close();
        if (!decision || status != 0) {
            status = 0;
            return;
        }
        let commandPort = configuration.port;
        let apiUrl =
            utils.getBackendUrl(location) +
            "/api/core/actuator/" +
            config.dev_id +
            "/";
        let apiUrlMulti =
            utils.getBackendUrl(location) +
            "/api/core/actuators/";
        let command;
        let commandObject={
            type: config.commandType,
            command: "",
            euis: euisString
        }
        switch (config.commandType) {
            case "plain":
                //console.log('sendCommand: ', config.commandText);
                command = config.commandText;
                apiUrl += "plain";
                break;
            case "hex":
                //console.log('sendCommand: ', config.commandText);
                command = config.commandText;
                apiUrl += "hex";
                break;
            case "json":
                //console.log('sendCommand: ', config.commandJSON);
                command = config.commandJSON;
                apiUrl += "json";
                break;
            default:
                console.log("Unknown command type: ", config.commandType);
                return;
        }

        if (
            commandPort != undefined &&
            commandPort != null &&
            isNaN(commandPort) == false
        ) {
            command = command + "@@@" + commandPort;
        }

        commandObject.command = command;
        let endpoint;
        if(euisString != undefined && euisString != null && euisString.length > 0){
            endpoint = apiUrlMulti;
            command = JSON.stringify(commandObject);
        } else {
            endpoint = apiUrl;
            command = command;
        }
        promise = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authentication: $token,
            },
            body: command,
        })
            .then((response) => {
                if (response.ok) {
                    //console.log('Command sent successfully');
                    status = 1;
                } else {
                    //console.log('Error sending command');
                    status = 2;
                }
                return "OK";
            })
            .catch((error) => {
                //console.log('Error sending command: ', error);
                status = 2;
                return "ERROR";
            });
    }

    let labels = {
        sendQuestion: {
            pl: "Czy na pewno chcesz wysłać polecenie?",
            en: "Are you sure you want to send the command?",
        },
        ok: {
            pl: "OK",
            en: "OK",
        },
        save: {
            pl: "Wyślij",
            en: "Send",
        },
        cancel: {
            pl: "Anuluj",
            en: "Cancel",
        },
        commandSent: {
            pl: "Polecenie zarejestrowane",
            en: "Command scheduled",
        },
        commandError: {
            pl: "Błąd rejestrowania polecenia",
            en: "Error scheduling command",
        },
    };
</script>

<Dialog
    bind:dialog
    callback={sendCommand}
    title={utils.getLabel("sendQuestion", labels, $language)}
    labels={[
        utils.getLabel("save", labels, $language),
        utils.getLabel("cancel", labels, $language),
    ]}
    color="body"
></Dialog>
<!-- <DialogValue
    bind:dialog
    callback={sendCommand}
    title={utils.getLabel("sendQuestion", labels, $language)}
    labels={[
        utils.getLabel("save", labels, $language),
        utils.getLabel("cancel", labels, $language),
    ]}
    color="body"
    minimum=0
    maximum=10
    step=1
></DialogValue> -->
<div class="container p-0">
    {#if isViewMode($viewMode)}
        <span class="btn btn-secondary w-100">{title}</span>
    {:else if status == 0}
        <a
            href="#"
            on:click|preventDefault={decide}
            class="btn btn-danger w-100"
            role="button"
            aria-disabled="true">{title}</a
        >
    {:else if status == 1}
        <a
            href="#"
            on:click|preventDefault={closeInfo}
            class="btn btn-success w-100"
            role="button"
            aria-disabled="true">{utils.getLabel("ok", labels, $language)}</a
        >
        <p>{utils.getLabel("commandSent", labels, $language)}</p>
    {:else}
        <a
            href="#"
            on:click|preventDefault={closeInfo}
            class="btn btn-danger w-100"
            role="button"
            aria-disabled="true">{utils.getLabel("ok", labels, $language)}</a
        >
        <p>{utils.getLabel("commandError", labels, $language)}</p>
    {/if}
</div>
