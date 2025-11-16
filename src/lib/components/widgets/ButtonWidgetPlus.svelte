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
    import { sgxdata } from '$lib/sgxdata.js';
    import { dev } from '$app/environment';
    import { afterUpdate } from 'svelte';

    export let config;
    export let filter;
    export let euis; // list of EUIs for multi-device command

    let promise0;
    let apiUrl;
    let myConfig = config;
    myConfig.query = "eui " + config.dev_id + " class com.signomix.reports.pre.DeviceConfig"
    let deviceConfig = {};

    afterUpdate(async () => {
        apiUrl = utils.getBackendUrl(location) + '/api/reports/single'
        await sgxdata.getReportData(dev, apiUrl, myConfig, filter, $token).then((data) => {
            console.log("Device config loaded: ", data);
            try {
                deviceConfig = JSON.parse(data.content);
            } catch (e) {
                console.log("Error parsing device config: ", e);
            }
        });
    });

    $: title = config.title != undefined ? config.title : "Command button";

    let dialog;
    //let dialogValue;

    let status = 0;
    let promise;
    let configuration = widgets.getConfiguration(config);

    onMount(async () => {
        //apiUrl = utils.getBackendUrl(location) + '/api/reports/single'
        //await sgxdata.getReportData(dev, apiUrl, myConfig, filter, $token).then((data) => {
        //console.log("Device config loaded: ", data);
        //});
        console.log("ButtonWidgetPlus mounted");
    });

    function decide() {
        //dialogValue.showModal();
        dialog.showModal();
    }

    function closeInfo(decision) {
        status = 0;
    }
    function dummyAction() {
        // do nothing
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
        //TODO: send command to list of devices
        let sendStatus = 0;
        if (euis != undefined && euis != null && euis.length > 0) {
            sendMultiCommand(decision, value);
        } else {
            sendSingleCommand(decision, value);
        }
    }

    async function sendSingleCommand(decision, value) {
        let apiUrl =
            utils.getBackendUrl(location) +
            "/api/core/actuator/" +
            config.dev_id +
            "/";
        let command;
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
                status = 3;
                return;
        }
        // inside command replace all occurences of $value with the actual value
        if (command.includes("${value}")) {
            command = command.replace("${value}", value);
        }
        // replace all occurences of configuration parameters
        if (command.includes("${param") == true) {
            for (let paramId in configuration.parameters) {  // TODO: paramId is object?
                let paramValue = getConfigParameterValue(configuration, paramId, deviceConfig);
                if (paramValue != undefined && paramValue != null) {
                    let placeholder = "${" + paramId + "}";
                    if (command.includes(placeholder)) {
                        command = command.replaceAll(placeholder, paramValue);
                    }
                }
            }
        }
        // handling not completed replace
        if(command.includes("${device.") || command.includes("${param")) {
            console.log("Not all placeholders replaced in command: ", command);
            status = 3;
            return "CONFIG ERROR";
        }
        if (
            configuration.port != undefined &&
            configuration.port != null &&
            isNaN(configuration.port) == false
        ) {
            command = command + "@@@" + configuration.port;
        }
        // prepend command with append/replace flag
        if (configuration.replace != undefined && configuration.replace != null && configuration.replace == true) {
            command = "#" + command;
        } else {
            command = "&" + command;
        }

        promise = await fetch(apiUrl, {
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

    function getConfigParameterValue(buttonConfig, paramId, deviceConfig) {
        console.log("Getting config parameter value for paramId: ", paramId);
        let paramObject = {};
        if (
            buttonConfig != undefined &&
            buttonConfig.parameters != undefined &&
            buttonConfig.parameters != null
        ) {
            paramObject = buttonConfig.parameters[paramId];
            console.log("Found paramObject: ", paramObject);
        }
        if (paramObject == undefined || paramObject == null) {
            paramObject.value = null;
        }
        if (paramObject.value != undefined && paramObject.value != null) {
            //if paramObjectValue is of type string and starts with "deviceConfig."
            if (typeof paramObject.value === "string" && paramObject.value.startsWith("$device.")) {
                // get device config value
                paramObject.value = deviceConfig[paramObject.value.substring(8)];
            }
            console.log("Resolved device config parameter value: ", paramObject.value);
        }
        console.log("Returning parameter value: ", paramObject.value);
        return paramObject.value;
    }

    async function sendMultiCommand(decision, value) {
        let apiUrl =
            utils.getBackendUrl(location) +
            "/api/core/actuators";
        let command = {
            type: config.commandType,
            command: "",
            euis: euis
        };
        switch (config.commandType) {
            case "plain":
                //console.log('sendCommand: ', config.commandText);
                command.command = config.commandText;
                break;
            case "hex":
                //console.log('sendCommand: ', config.commandText);
                command.command = config.commandText;
                break;
            case "json":
                //console.log('sendCommand: ', config.commandJSON);
                command.command = config.commandJSON;
                break;
            default:
                console.log("Unknown command type: ", config.commandType);
                return;
        }
        // inside command replace all occurences of $value with the actual value
        if (command.command.includes("${value}")) {
            command.command = command.command.replace("${value}", value);
        }
        // replace all occurences of configuration parameters
        if (command.includes("${param") == true) {
            for (let paramId in configuration.parameters) {
                let paramValue = getConfigParameterValue(configuration, paramId, deviceConfig);
                if (paramValue != undefined && paramValue != null) {
                    let placeholder = "${" + paramId + "}";
                    if (command.includes(placeholder)) {
                        command = command.replaceAll(placeholder, paramValue);
                    }
                }
            }
        }
                // handling not completed replace
        if(command.includes("${device.") || command.includes("${param")) {
            console.log("Not all placeholders replaced in command: ", command);
            status = 3;
            return "CONFIG ERROR";
        }
        if (
            configuration.port != undefined &&
            configuration.port != null &&
            isNaN(configuration.port) == false
        ) {
            command.command = command.command + "@@@" + configuration.port;
        }
        // prepend command with append/replace flag
        if (configuration.replace != undefined && configuration.replace != null && configuration.replace == true) {
            command.command = "#" + command.command;
        } else {
            command.command = "&" + command.command;
        }

        promise = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authentication: $token,
            },
            body: JSON.stringify(command),
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

    function getBgColor(configuration) {
        if (configuration.bgcolor != undefined && configuration.bgcolor != null) {
            return configuration.bgcolor;
        } else {
            return "body";
        }
    }

    let labels = {
        sendQuestion: {
            pl: "Wybór parametrów polecenia",
            en: "Command parameters selection",
        },
        ok: {
            pl: "OK",
            en: "OK",
        },
        warn: {
            pl: "Problem",
            en: "Warning",
        },
        err: {
            pl: "Błąd",
            en: "Error",
        },
        configError: {
            pl: "Błąd konfiguracji polecenia",
            en: "Command configuration error",
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

<!-- <Dialog
    bind:dialog
    callback={sendCommand}
    title={utils.getLabel("sendQuestion", labels, $language)}
    labels={[
        utils.getLabel("save", labels, $language),
        utils.getLabel("cancel", labels, $language),
    ]}
    color="body"
></Dialog> -->
<DialogValue bind:dialog callback={sendCommand} title={utils.getLabel("sendQuestion", labels, $language)} labels={[
    utils.getLabel("save", labels, $language), utils.getLabel("cancel", labels, $language), ]}
    color={getBgColor(widgets.getConfiguration(config))} configuration={widgets.getConfiguration(config)}>
    {config.description}</DialogValue>
<div class="container p-0">
    {#if isViewMode($viewMode)}
    <span class="btn btn-secondary w-100">{title}</span>
    {:else if status == 0}
    <a href="#" on:click|preventDefault={decide} class="btn btn-danger w-100" role="button"
        aria-disabled="true">{title}</a>
    {:else if status == 1}
    <a href="#" on:click|preventDefault={closeInfo} class="btn btn-success w-100" role="button"
        aria-disabled="true">{utils.getLabel("ok", labels, $language)}</a>
    <p>{utils.getLabel("commandSent", labels, $language)}</p>
    {:else if status == 3}
    <a href="#" on:click|preventDefault={dummyAction} class="btn btn-warning w-100" role="button"
        aria-disabled="true">{utils.getLabel("warn", labels, $language)}</a>
    <p>{utils.getLabel("configError", labels, $language)}</p>
    {:else}
    <a href="#" on:click|preventDefault={closeInfo} class="btn btn-danger w-100" role="button"
        aria-disabled="true">{utils.getLabel("err", labels, $language)}</a>
    <p>{utils.getLabel("commandError", labels, $language)}</p>
    {/if}
</div>