<script>
    import { sgxhelper } from "$lib/sgxhelper.js";
    import { sgxdata } from "$lib/sgxdata.js";
    import { utils } from "$lib/utils.js";
    import {
        profile,
        token,
        language,
        isAuthenticated,
    } from "$lib/usersession.js";
    import { dev } from "$app/environment";

    export let config;
    export let callback;
    export let readonly;

    let configuration;

    try {
        // For better readability in the textarea
        configuration = JSON.stringify(
            JSON.parse(config.configuration),
            null,
            2
        );
    } catch (e) {
        console.error("Error parsing configuration:", e);
        configuration = "{}"; // Reset to empty object if parsing fails
    }

    console.log("config", config);

    function handleSave(event) {
        configuration = configuration.trim()
        try {
            JSON.parse(configuration);
        } catch (e) {
            configuration = "{}"; // Reset to empty object if parsing fails
        }
        config.configuration = configuration;
        callback(config);
    }
    function handleCancel(event) {
        callback(null);
    }

    // const apiUrl = utils.getBackendUrl(location) + '/api/organization/'+$profile.organization
    // let promise = sgxdata.getOrganization(dev,apiUrl,$token);

    let labels = {
        id: {
            en: "ID",
            pl: "ID",
        },
        name: {
            en: "Name",
            pl: "Nazwa",
        },
        code: {
            en: "Code",
            pl: "Kod",
        },
        vat: {
            en: "Tax No.",
            pl: "NIP",
        },
        description: {
            en: "Description",
            pl: "Opis",
        },
        configuration: {
            en: "Configuration",
            pl: "Konfiguracja",
        },
        locked: {
            en: "Locked",
            pl: "Zablokowana",
        },
    };
</script>

<form>
    <div class="row">
        <div class="col-md-3">
            <label for="input-id" class="form-label">{utils.getLabel("id", labels, $language)}</label>
            <input disabled type="text" class="form-control" id="input-id" bind:value={config.id} />
        </div>
        <div class="col-md-3">
            <label for="input-code" class="form-label">{utils.getLabel("code", labels, $language)}</label>
            <input type="text" class="form-control" id="input-code" bind:value={config.code} disabled={readonly} />
        </div>
        <div class="col-md-3">
            <label for="input-vat" class="form-label">{utils.getLabel("vat", labels, $language)}</label>
            <input type="text" class="form-control" id="input-vat" bind:value={config.vat} disabled={readonly} />
        </div>
        <div class="col-md-3">
            <div class="form-check">
                <label for="input-locked" class="form-label">{utils.getLabel("locked", labels, $language)}</label>
                <input class="form-check-input" type="checkbox" id="input-locked" bind:checked={config.locked}
                    disabled={readonly} />
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <label for="input-name" class="form-label">{utils.getLabel("name", labels, $language)}</label>
            <input type="text" class="form-control" id="input-name" bind:value={config.name} disabled={readonly} />
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <label for="input-description" class="form-label">{utils.getLabel("description", labels, $language)}</label>
            <textarea rows="2" class="form-control" id="input-description" bind:value={config.description}
                style="white-space: pre-wrap;" disabled={readonly}></textarea>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <label for="input-config" class="form-label">{utils.getLabel("configuration", labels, $language)}</label>
            <textarea class="form-control mb-1" id="input-config" rows="4" bind:value={configuration}
                style="white-space: pre-wrap;" disabled={readonly} />
        </div>
    </div>
    {#if !readonly}
    <div class="row">
        <div class="col-form-label">
            <a href="/settings" class="btn btn-outline-secondary mt-1" on:click={handleCancel}>{utils.getLabel("cancel",
                labels, $language)}</a>
            <button class="btn btn-outline-primary me-4 mt-1" on:click={handleSave}>{utils.getLabel("save", labels,
                $language)}</button>
        </div>
    </div>
    {/if}
</form>