<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    eventually, when released: https://github.com/cuire/svelte-grid-extended
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
{#if !$isAuthenticated}
<div class="alert alert-danger" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
{#if errorMessage!=''}
<div class="alert alert-danger" role="alert">
    {errorMessage}
</div>
{/if}

<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{dashboardConfig.title}</h5>
    <span>
        {#if dashboardConfig.shared}
        <a title="Dashboard access" data-bs-toggle="modal" data-bs-target="#linkModal"
            on:click|preventDefault={showLink}>
            <i class="bi  bi-link-45deg h4 me-2 link-dark"></i>
        </a>
        {/if}
        <a title={utils.getLabel('filter',labels,$language)} data-bs-toggle="modal" data-bs-target="#filterModal"
            on:click|preventDefault={setFilter}>
            {#if isFilterSet(dashboardFilter)}
            <i class="bi bi-funnel-fill h5 me-2 link-dark"></i>
            {:else}
            <i class="bi bi-funnel h5 me-2 link-dark"></i>
            {/if}
        </a>
        <a href="/dashboards/{data.id}/edit" title={utils.getLabel('configure',labels,$language)}><i
                class="bi bi-gear h5 me-2 link-dark"></i></a>
    </span>
</div>
<div class="dashboard-container" id={dashboardId}>
    {#if items.length==0}
    <div class="alert alert-light mx-auto my-auto">{utils.getLabel('empty',labels,$language)}</div>
    {:else}
    <Grid gap={[4,4]} bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize}
        on:mount={handleMount}>
        <div class="dashboard-widget content bg-white border border-primary rounded-1">
            {#if !isRoleOK(index)}
            <div class="alert alert-light mx-auto my-auto">{utils.getLabel('hidden',labels,$language)}</div>
            {:else}
            {#if 'chartjs'===getWidgetType(index)}
            <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else if 'canvas'===getWidgetType(index)}
            <CanvasWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else if 'canvas_placeholder'===getWidgetType(index)}
            <CanvasWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else if 'chart_placeholder'===getWidgetType(index)}
            <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else if 'symbol'===getWidgetType(index)}
            <SymbolWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'text'===getWidgetType(index)}
            <TextWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'image'===getWidgetType(index)}
            <ImageWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'link'===getWidgetType(index)}
            <InternalLink bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'led'===getWidgetType(index)}
            <LedWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'raw'===getWidgetType(index)}
            <RawDataWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'chart'===getWidgetType(index)}
            <ChartWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else if 'groupchart'===getWidgetType(index)}
            {#if 'doughnut'===getWidgetChartType(index)}
            <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else if 'stacked'===getWidgetChartType(index)}
            <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {:else}
            <CanvasWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {/if}
            {:else if 'plan'===getWidgetType(index)}
            <PlanWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
            {:else}
            <CanvasWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
            {/if }
            {/if}<!-- isRoleOK -->
        </div>
    </Grid>
    {/if}
</div>
<!-- Filter modal -->
<div class="modal fade" id="filterModal" tabindex="0" role="dialog" aria-labelledby="filterModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">{utils.getLabel('filter',labels,$language)}</h5>
            </div>
            <div class="modal-body">
                <DashboardFilterForm bind:config={editedFilter} callbackSave={filterFormCallback}
                    callbackCancel={filterFormCallbackCancel} />
            </div>
        </div>
    </div>
</div>
<!-- Link modal -->
<div class="modal fade" id="linkModal" tabindex="0" role="dialog" aria-labelledby="linkModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">{utils.getLabel('link',labels,$language)}</h5>
            </div>
            <div class="modal-body">
                <DashboardLinkForm bind:config={ dashboardLinkConfig } callbackClose={linkFormCallback} />
            </div>
        </div>
    </div>
</div>

{/if}
<script>
    import { onMount } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

    import DashboardFilterForm from '$lib/components/DashboardFilterForm.svelte';
    import DashboardLinkForm from '$lib/components/DashboardLinkForm.svelte';
    import CanvasWidgetExample from '$lib/components/widgets/CanvasWidgetExample.svelte';
    import ChartjsWidgetExample from '$lib/components/widgets/ChartjsWidgetExample.svelte';
    import SymbolWidget from '$lib/components/widgets/SymbolWidget.svelte';
    import TextWidget from '$lib/components/widgets/TextWidget.svelte';
    import ImageWidget from '$lib/components/widgets/ImageWidget.svelte';
    import LedWidget from '$lib/components/widgets/LedWidget.svelte';
    import InternalLink from '$lib/components/widgets/InternalLink.svelte';
    import RawDataWidget from '$lib/components/widgets/RawDataWidget.svelte';
    import ChartWidget from '$lib/components/widgets/ChartWidget.svelte';
    import PlanWidget from '$lib/components/widgets/PlanWidget.svelte';

    export let data


    let errorMessage = ''
    let dashboardId = 'dashboard' + 0 //TODO
    let numberOfCols = 1

    let { item } = gridHelp;

    let editable = false; // set to true to enable editing

    let dashboardConfig = {}
    let items = []

    let dashboardFilter = { from: '', to: '' }
    let editedFilter = { from: '', to: '' }
    let dashboardLinkConfig = { link: '', code: '' }
    let applications = [
        {
            id: 0,
            organization: 0,
            version: 0,
            name: "system",
            configuration: "{\"refreshInterval\":7}",
        }
    ]


    // Documentation of cols
    // https://github.com/vaheqelyan/svelte-grid/issues/140
    let cols = {}

    let getWidgetType = function (idx) {
        try {
            return dashboardConfig.widgets[idx].type
        } catch (e) {
            return 'unknown'
        }
    }
    let getWidgetChartType = function (idx) {
        try {
            if ('chart' === dashboardConfig.widgets[idx].type || 'groupchart' === dashboardConfig.widgets[idx].type) {
                console.log('chartType', dashboardConfig.widgets[idx].chartType)
                return dashboardConfig.widgets[idx].chartType
            } else {
                return 'unknown'
            }
        } catch (e) {
            return 'unknown'
        }
    }

    // check if user has role to see widget
    let isRoleOK = function (index) {
        let userRoles = []
        try {
            userRoles = $profile.role.split(',')
        } catch (e) {
            //console.log(e)
        }
        let widgetRoles =[]
        try{
            widgetRoles = dashboardConfig.widgets[index].role.split(',')
        }catch(e){
            //console.log(e)
        }
        console.log('userRoles', userRoles)
        console.log('widgetRoles', widgetRoles)
        // remove empty roles
        widgetRoles = widgetRoles.filter(function(entry) { return entry.trim() != ''; });
        if(widgetRoles.length==0){
            return true
        }
        for (let role of widgetRoles) {
            if (userRoles.includes(role)) {
                return true
            }
        }
        return false
    }

    let getRefreshInterval = function () {
        const defaultInterval = 300
        let interval = dev ? 10 : defaultInterval
        try {
            for (let i = 0; i < applications.length; i++) {
                if (applications[i].name === "system") {
                    let config = JSON.parse(applications[i].configuration)
                    let tmpIntv = config.refreshInterval
                    if (tmpIntv != null && tmpIntv != undefined && tmpIntv > 0) {
                        interval = tmpIntv
                    }
                    break
                }
            }
        } catch (e) {
            console.log(e)
        }
        return interval * 1000 // in ms
    }

    let getApplications = function () {
        const headers = new Headers()
        let method = 'GET'
        let url = utils.getBackendUrl(location) + "/api/core/application?offset=0&limit=1000"
        headers.set('Authentication', $token);
        let apps = fetch(url, { headers: headers }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                return response.json()
            } else if (response.status == 401 || response.status == 403 || response.status == 404) {
                token.set(null)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.getMessage
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + utils.getLabel('fetcherror_message', labels, $language)
            }
            console.log(error)
        });
        return apps
    }

    let show = function () {
        dashboardConfig = data
        blockChanges(dashboardConfig)
        mergeConfigs()
        console.log('dashboardConfig ', dashboardConfig)
        console.log('SHOW dashboard ' + dashboardConfig.id)
        //console.log('dashboardConfig ', dashboardConfig)
        items = dashboardConfig.items
        cols = [
            [800, 10],
            [500, 1],
        ];
    }

    let findApplication = function (id) {
        console.log('findApplication', applications)
        for (let i = 0; i < applications.length; i++) {
            if (applications[i].id == id) {
                return applications[i]
            }
        }
        return null
    }

    let mergeConfigs = function () {
        // it doesn't work because of fetch in getApplications
        /*         for(let i=0;i<dashboardConfig.widgets.length;i++){
                    let widget=dashboardConfig.widgets[i]
                    let app = findApplication(widget.app_id);
                    if(app==null){
                        continue
                    }
                    console.log('app', app)
                    let appCfg = JSON.parse(app.configuration)
                    let cfg=JSON.parse(widget.config)
                    let combined = Object.assign({}, cfg, appCfg);
                    dashboardConfig.widgets[i].config=JSON.stringify(...combined)
                } */
    }

    let interval
    afterNavigate(({ from, to }) => {
        console.log('afterNavigate', from, to);
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        } else {
            console.log('settings', data);
        }
        if (!dev) {
            applications = getApplications()
        }
        clearInterval(interval);
        interval = setInterval(() => {
            invalidateAll()
            show()
        }, getRefreshInterval());
        show()
    })
    beforeNavigate(({ from, to }) => {
        console.log('beforeNavigate', from, to);
        clearInterval(interval);
    })
    onMount(() => {
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
    let showLink = function (event) {
        // do nothing
    }

    function filterFormCallback(cfg) {
        dashboardFilter.from = cfg.from
        dashboardFilter.to = cfg.to
        editedFilter = { from: '', to: '' }
    }
    function filterFormCallbackCancel() {
        editedFilter = { from: '', to: '' }
    }
    let isFilterSet = function (filter) {
        return filter.from != '' || filter.to != ''
    }
    function linkFormCallback() {
        // do nothing
    }

    let labels = {
        'filter': {
            'pl': "Filtr danych pulpitu",
            'en': "Dashboard data filter"
        },
        'configure': {
            'pl': "Konfiguracja pulpitu",
            'en': "Dashboard configuration"
        },
        'link': {
            'pl': "Link do pulpitu",
            'en': "Dashboard link"
        },
        'denied': {
            'pl': "Nie jesteś zalogowany lub nie masz uprawnień do oglądania tej strony.",
            'en': "You are not logged in or you do not have permission to view this page."
        },
        'fetcherror': {
            'pl': "Błąd pobierania danych: ",
            'en': "Fetch error: "
        },
        'fetcherror_message': {
            'pl': " Możliwa przyczyna: sertyfikaty self signed nie są obsługiwane.",
            'en': " Possible cause: self signed certificates are not supported."
        },
        'empty': {
            'pl': "Pulpit nie zawiera żadnych zdefiniowanych kontrolek.",
            'en': "Dashboard does not contain any widgets."
        },
        'hidden': {
            'pl': "ukryte (brak uprawnień)",
            'en': "hidden (no permissions)"
        },
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