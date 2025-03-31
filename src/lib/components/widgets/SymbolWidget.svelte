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
    //import { sgxhelper } from "$lib/sgxhelper.js";
    import { dql } from "$lib/dql.js";
    import { dev } from "$app/environment";
    import { onMount } from "svelte";
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
        "report DqlReport eui " +
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
    function recalculate(data) {
        if (dataNotAvailable(data,"recalculate")) {
            return "N/A";
        }
        let value = data.datasets[0].data[0].values[0]
        try {
            return Number.parseFloat(value).toFixed(config.rounding);
        } catch (e) {
            return value;
        }
    }
    function switchView() {
        front = !front;
    }

    function getWidgetBackgroundColor() {
        if (
            config.config != undefined &&
            config.config != null &&
            config.config != ""
        ) {
            try {
                let cfg = JSON.parse(config.config);
                if (cfg.backgroundColor != undefined) {
                    return cfg.backgroundColor;
                }
            } catch (e) {
                console.log("error parsing config: ", e);
                return "initial";
            }
        }
        return "initial";
    }

    function dataNotAvailable(data, name) {
        if (data == undefined || data == null) {
            console.log("not available 1")
            return true;
        }
        if (data.datasets == undefined || data.datasets == null) {
            console.log("not available 2 in "+name)
            return true;
        }
        if (data.datasets[0] == undefined || data.datasets[0] == null) {
            console.log("not available 3")
            return true;
        }
        if (data.datasets[0].data == undefined || data.datasets[0].data == null) {
            console.log("not available 4")
            return true;
        }
        if (data.datasets[0].data[0] == undefined || data.datasets[0].data[0] == null) {
            console.log("not available 5")
            return true;
        }
        if (data.datasets[0].data[0].values == undefined || data.datasets[0].data[0].values == null) {
            console.log("not available 6")
            return true;
        }
        if (data.datasets[0].data[0].values[0] == undefined || data.datasets[0].data[0].values[0] == null) {
            console.log("not available 7")
            return true;
        }
        return false;
    }
    function getColor(data) {
        if(dataNotAvailable(data,"getColor")) {
            return "text-muted";
        }
        let timestamp=data.datasets[0].data[0].timestamp
        let level = widgets.getAlertLevel(
            config.range,
            recalculate(data),
            timestamp,
        );
        if (
            config.config != undefined &&
            config.config != null &&
            config.config != ""
        ) {
            try {
                let cfg = JSON.parse(config.config);
                if (
                    cfg.colors != undefined &&
                    cfg.colors != null &&
                    cfg.colors.length == 5
                ) {
                    return cfg.colors[level];
                }
            } catch (e) {
                console.log("error parsing config: ", e);
                return "text-success";
            }
        }
        switch (level) {
            case 0:
                return "text-success";
            case 1:
                return "text-warning";
            case 2:
                return "text-danger";
            case 3:
                return "text-muted";
            default:
                return "text-body";
        }
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
    function getIconName2(data) {
        if (dataNotAvailable(data,"getIconName2")) {
            return "bi-clipboard2-pulse";
        }
        return widgets.getIconName(config,data.datasets[0].data[0].values[0],data.datasets[0].data[0].timestamp)
    }
    /* function getIconName() {
        if (
            config.icon == null ||
            config.icon == "" ||
            config.icon == undefined
        ) {
            let cname = config.channel.toLowerCase();
            switch (cname) {
                case "temperature":
                    return "bi-thermometer-half";
                case "humidity":
                case "moisture":
                    return "bi-droplet-half";
                case "pressure":
                    return "bi-speedometer";
                case "wind":
                    return "bi-wind";
                case "rain":
                    return "bi-cloud-hail";
                case "pollution":
                case "pm10":
                case "pm25":
                    return "bi-cloud-haze2";
                case "luminance":
                case "light":
                case "lux":
                case "brightness":
                    return "bi-sun";
                default:
                    return "bi-clipboard2-pulse";
            }
        } else {
            return config.icon;
        }
    } */
</script>

<div class="p-1 w-100" on:click={switchView} style="background-color: {getWidgetBackgroundColor()};">
    <!-- {#if config.icon != null && config.icon != ""}
        <div class="row text-center">
            <div class="col-12">
                <i
                    class="bi {getIconName2(data)} me-2 {getColor(data)}"
                ></i>
            </div>
        </div>
    {/if} -->
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
                    <span class="h4">
                        <i
                            class="bi 
                            {getIconName2(data)} me-2 
                            {getColor(data)}"
                        ></i>
                        {recalculate(data)}{@html config.unitName != undefined
                            ? config.unitName
                            : ""}
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
