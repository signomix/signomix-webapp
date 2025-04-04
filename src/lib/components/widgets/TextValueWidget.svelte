<script>
    import {
        token,
        profile,
        language,
        isAuthenticated,
    } from "$lib/usersession.js";
    import { utils } from "$lib/utils.js";
    import { widgets } from "$lib/widgets.js";
    import { sgxdata } from "$lib/sgxdata.js";
    import { dql } from "$lib/dql.js";
    import { dev } from "$app/environment";
    import { afterUpdate } from "svelte";

    export let config;
    export let filter;
    export let application;

    let apiUrl;

    let errorMessage = "";
    apiUrl = utils.getBackendUrl(location) + "/api/reports/single";
    let q = {};
    try {
        q = dql.parse(config.query);
    } catch (e) {
        console.log("error parsing query: ", e);
    }
    let config2 = config;
    let notNulls = "notnull";
    let widgetConfig = widgets.getConfiguration(config2);
    if (widgetConfig.nulls != undefined && widgetConfig.nulls != null) {
        notNulls = widgetConfig.nulls ? "" : "notnull";
    }

    config2.query =
        "report DqlTvReport eui " +
        config2.dev_id +
        " channel " +
        config2.channel +
        " last 1 " +
        notNulls;
    if (
        q != undefined &&
        q != null &&
        q.project != undefined &&
        q.project != null &&
        q.project != ""
    ) {
        config2.query = config2.query + " project " + q.project;
    }
    // check access to application config
    if (application != undefined && application != null) {
        console.log("application config: ", application.config);
    } else {
        console.log("unable to get application config");
    }

    //let promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
    let promise = sgxdata.getReportData(
        dev,
        apiUrl,
        config2,
        filter,
        $token,
        transformData,
    );
    let front = true;

    afterUpdate(() => {
        //promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
        promise = sgxdata.getReportData(
            dev,
            apiUrl,
            config2,
            filter,
            $token,
            transformData,
        );
    });

    async function transformData(config, rawData) {
        let jsonData = await rawData;
        return jsonData;
    }
    function switchView() {
        front = !front;
    }

    function getValue(data) {
        if(dataNotAvailable(data)) {
            return "N/A";
        }
        return data.datasets[0].data[0].values[0];
    }
    function getDate(data) {
        if (dataNotAvailable(data,"getDate")) {
            return "N/A";
        }
        let date = new Date(
                        data.datasets[0].data[0].timestamp,
                    ).toLocaleString()
        return date;
    }

    function dataNotAvailable(data) {
        if (data == undefined || data == null) {
            return true;
        }
        if (data.datasets == undefined || data.datasets == null) {
            return true;
        }
        if (data.datasets[0] == undefined || data.datasets[0] == null) {
            return true;
        }
        if (data.datasets[0].data == undefined || data.datasets[0].data == null) {
            return true;
        }
        if (data.datasets[0].data[0] == undefined || data.datasets[0].data[0] == null) {
            return true;
        }
        if (data.datasets[0].data[0].values == undefined || data.datasets[0].data[0].values == null) {
            return true;
        }
        if (data.datasets[0].data[0].values[0] == undefined || data.datasets[0].data[0].values[0] == null) {
            return true;
        }
        return false;
    }
</script>

<div class="p-1 w-100" on:click={switchView}>
    {#if config.title != ""}
        <div class="row text-center">
            <div class="col-12"><span>{config.title}</span></div>
        </div>
    {/if}
    <div class="row text-center">
        <div class="col-12 mt-1">
            {#await promise}
                <div
                    class="spinner-border spinner-border-sm"
                    role="status"
                ></div>
            {:then data}
                {#if front}
                    <span class="h5">
                        {getValue(data)}
                    </span>
                {:else}
                    {getDate(data)}<br />
                    {config.dev_id}
                {/if}
            {:catch error}
                {#if !front}
                    <p style="color: red">{error.message}</p>
                {/if}
            {/await}
        </div>
    </div>
</div>
