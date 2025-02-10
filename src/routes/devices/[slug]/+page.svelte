<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { utils } from "$lib/utils.js";
    import { goto } from "$app/navigation";
    import {
        token,
        profile,
        language,
        isAuthenticated,
    } from "$lib/usersession.js";
    import { defaultOrganizationId } from "$lib/stores.js";
    import DeviceForm from "$lib/components/DeviceForm.svelte";
    import { sgxhelper } from "$lib/sgxhelper.js";

    export let data;
    let errorMessage = "";

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log("redirect to login");
            goto("/login");
        }
    });

    function saveSettings(config) {}

    let labels = {
        configure: {
            en: "Configure",
            pl: "Konfiguruj",
        },
        download: {
            en: "Download data",
            pl: "Pobierz dane",
        },
        removeData: {
            en: "Remove data",
            pl: "Usuń dane",
        },
        upload: {
            en: "Upload data",
            pl: "Wgraj dane",
        },
    };
</script>

<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom"
><div>
    <h5>{data.name}</h5>
</div>
<div>
    <!--{#if (utils.isObjectAdmin($profile, data.userID, $defaultOrganizationId))}-->
    {#if sgxhelper.hasObjectAccess($profile, true, 1, data, "Device")}
        <a href="/devices/{data.eui}/upload"
            ><i
                class="bi bi-upload h5 me-2 link-dark"
                title={utils.getLabel("upload", labels, $language)}
            ></i></a
        >
    {/if}
    <a
        href="/devices/{data.eui}/download"
        title={utils.getLabel("download", labels, $language)}
        ><i class="bi bi-cloud-download h5 me-2 link-dark"></i></a
    >
    {#if sgxhelper.hasObjectAccess($profile, true, 1, data, "Device")}
        <a
            href="/devices/{data.eui}/edit"
            title={utils.getLabel("configure", labels, $language)}
            ><i class="bi bi-gear h5 me-2 link-dark"></i></a
        >
    {/if}
    <a
        href="/devices/{data.eui}/removedata"
        title={utils.getLabel("removeData", labels, $language)}
        ><i class="bi bi-database-x me-2 h5 link-dark"></i></a
    >
    </div>
</div>
{#await data then data}
    {#if data !== undefined}
        <DeviceForm config={data} callback={saveSettings} readonly={true} />
    {/if}
{/await}
