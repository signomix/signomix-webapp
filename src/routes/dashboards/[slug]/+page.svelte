<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    eventually, when released: https://github.com/cuire/svelte-grid-extended
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{dashboardConfig.title}</h5>
    <span>
        <a title="Filter" data-bs-toggle="modal" data-bs-target="#filterModal" 
           on:click|preventDefault={setFilter}>
            {#if isFilterSet(dashboardFilter)}
            <i class="bi bi-funnel-fill h5 me-2 link-dark" ></i>
            {:else}
            <i class="bi bi-funnel h5 me-2 link-dark" ></i>        
            {/if}
        </a>
        <a href="/dashboards/{data.id}/edit" title="Configure"><i class="bi bi-gear h5 me-2 link-dark"></i></a>
    </span>
</div>
<div class="dashboard-container" id={dashboardId}>
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize} on:mount={handleMount}>
        <div class="dashboard-widget content bg-white border border-primary rounded-1">
            {#if 'chartjs'===getWidgetType(index)}
            <ChartjsWidgetExample index={index} bind:config={items}  bind:filter={dashboardFilter}/>
            {:else if 'canvas'===getWidgetType(index)}
            <CanvasWidgetExample index={index} bind:config={items}  bind:filter={dashboardFilter}/> pe-2
            {:else if 'canvas_placeholder'===getWidgetType(index)}
            <CanvasWidgetExample index={index} bind:config={items}  bind:filter={dashboardFilter}/>
            {:else if 'chart_placeholder'===getWidgetType(index)}
            <ChartjsWidgetExample index={index} bind:config={items}  bind:filter={dashboardFilter}/>
            {:else if 'symbol'===getWidgetType(index)}
            <SymbolWidget bind:config={dashboardConfig.widgets[index]}  bind:filter={dashboardFilter}/>
            {:else if 'text'===getWidgetType(index)}
            <TextWidget bind:config={dashboardConfig.widgets[index]}  bind:filter={dashboardFilter}/>
            {:else if 'led'===getWidgetType(index)}
            <LedWidget bind:config={dashboardConfig.widgets[index]}  bind:filter={dashboardFilter}/>
            {:else if 'raw'===getWidgetType(index)}
            <RawDataWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}/>
            {:else if 'chart'===getWidgetType(index)}
            <ChartWidget bind:config={dashboardConfig.widgets[index]}  bind:filter={dashboardFilter}/>
            {:else}
            <CanvasWidgetExample index={index} bind:config={items}  bind:filter={dashboardFilter}/>
            {/if }
        </div>
    </Grid>
</div>
<!-- Modal -->
<div class="modal fade" id="filterModal" tabindex="0" role="dialog" aria-labelledby="filterModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">Filtr danych pulpitu</h5>
<!--                 <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button> -->
            </div>
            <div class="modal-body">
                <DashboardFilterForm bind:config={editedFilter} callbackSave={filterFormCallback} callbackCancel={filterFormCallbackCancel} />
            </div>
        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';
    import { invalidateAll } from '$app/navigation';

    import DashboardFilterForm from '$lib/components/DashboardFilterForm.svelte';
    import CanvasWidgetExample from '$lib/components/widgets/CanvasWidgetExample.svelte';
    import ChartjsWidgetExample from '$lib/components/widgets/ChartjsWidgetExample.svelte';
    import SymbolWidget from '$lib/components/widgets/SymbolWidget.svelte';
    import TextWidget from '$lib/components/widgets/TextWidget.svelte';
    import LedWidget from '$lib/components/widgets/LedWidget.svelte';
    import RawDataWidget from '$lib/components/widgets/RawDataWidget.svelte';
    import ChartWidget from '$lib/components/widgets/ChartWidget.svelte';

    export let data
    let errorMessage = ''
    let dashboardId = 'dashboard' + 0 //TODO
    //let parentDiv
    let numberOfCols = 1
    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let { item } = gridHelp;

    let editable = false; // set to true to enable editing
    let dashboardConfig = {}
    let dashboardFilter = {from:'', to:''}
    let editedFilter = {from:'', to:''}
    //let filterVisible=false

    let items = []
    // Documentation of cols
    // https://github.com/vaheqelyan/svelte-grid/issues/140
    let cols

    let getWidgetType = function (idx) {
        try {
            return dashboardConfig.widgets[idx].type
        } catch (e) {
            return 'unknown'
        }
    }
    let getWidgetChartType = function (idx) {
        try {
            if ('chart' === dashboardConfig.widgets[idx].type) {
                return dashboardConfig.widgets[idx].chartType
            } else {
                return 'unknown'
            }
        } catch (e) {
            return 'unknown'
        }
    }

    let getRefreshInterval = function () {
        let interval = dev ? 10000 : 60000
        let applications = [
            {
                id: 0,
                organization: 0,
                version: 0,
                name: "dashboards",
                configuration: "{\"refreshInterval\":7000,\"theme\":\"dark\"}",
            }
        ]
        if (!dev) {
            applications = getApplications()
        }

        try {
            for (let i = 0; i < applications.length; i++) {
                if (applications[i].name === "default") {
                    let config = JSON.parse(applications[i].configuration)
                    interval = config.refreshInterval
                    break
                }
            }
        } catch (e) {
            console.log( e)
        }
        //console.log('refresh interval: ', interval)
        return interval
    }

    let getApplications = function () {
        const headers = new Headers()
        let method = 'GET'
        let url = utils.getBackendUrl(location) + "/api/application/"
        headers.set('Authentication', session.token);
        let apps = fetch(
            url,
            { method: method, mode: 'cors', headers: headers }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                return response.json()
            } else if (response.status == 401 || response.status == 403 || response.status == 404) {
                utils.setAuthorized(session, false)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
            }
            console.log(error)
        });
        return apps
    }

    let show = function () {
        dashboardConfig = data
        blockChanges(dashboardConfig)
        //console.log('SHOW dashboard')
        //console.log('dashboardConfig ', dashboardConfig)
        items = dashboardConfig.items
        cols = [
            [800, 10],
            [500, 1],
        ];
    }

    onMount(() => {
        const interval = setInterval(() => {
            invalidateAll()
            show()
        }, getRefreshInterval());
        show()
        return () => { clearInterval(interval); }
    });

    const blockChanges = function (config) {
        //set draggable and resizable to false
        config.items.forEach(function (item) {
            item[1].draggable = false
            item[1].resizable = false
            item[10].draggable = false
            item[10].resizable = false
        })
    }
    const handleResize = (event) => {
        numberOfCols = event.detail.cols
    }

    const handleMount = (event) => {
        numberOfCols = event.detail.cols
    }

    let setFilter = function (event) {
        editedFilter.from = dashboardFilter.from
        editedFilter.to = dashboardFilter.to
    }

    function filterFormCallback(cfg) {
        dashboardFilter.from = cfg.from
        dashboardFilter.to = cfg.to
        editedFilter = {from:'', to:''}
    }
    function filterFormCallbackCancel() {
        editedFilter = {from:'', to:''}
    }
    let isFilterSet=function(filter) {
        return filter.from != '' || filter.to != ''
    }

</script>
<style>
    .dashboard-widget {
        height: 100%;
        width: 100%;
        display: flex;
    }

    .dashboard-container {
        max-width: 1500px;
        width: 100%;
    }
</style>