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
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{dashboardConfig.title}</h5>
    <span>
        <!--         {#if !isViewMode($viewMode)} -->
        <a title={utils.getLabel('refresh',labels,$language)} on:click={forceRefresh}><i
                class="bi bi-arrow-clockwise h5 me-2 link-dark"></i></a>
        <!--         {/if} -->
        {#if isMobile}
        <i class="bi bi-phone-fill h5 me-2 link-dark" on:click="{switchMobile}"></i>
        {:else}
        <i class="bi bi-phone h5 me-2 link-dark" on:click="{switchMobile}"></i>
        {/if}
        {#if isViewMode($viewMode)}
        <div class="badge rounded-pill text-bg-light h5 me-2">{secondsLeft}</div>
        {:else}
        {#if dashboardConfig.shared}
        <a title="Dashboard access" data-bs-toggle="modal" data-bs-target="#linkModal"
            on:click|preventDefault={showLink}>
            <i class="bi  bi-link-45deg h4 me-2 link-dark"></i>
        </a>
        {/if}
        {#if !utils.isUserRole($profile, 'limited', false)}
        <a title={utils.getLabel('filter',labels,$language)} data-bs-toggle="modal" data-bs-target="#filterModal"
            on:click|preventDefault={setFilter}>
            {#if isFilterSet(dashboardFilter)}
            <i class="bi bi-funnel-fill h5 me-2 link-dark"></i>
            {:else}
            <i class="bi bi-funnel h5 me-2 link-dark"></i>
            {/if}
        </a>
        {#if (utils.isObjectAdmin($profile, data.userID, $defaultOrganizationId, dashboardConfig.administrators,
        dashboardConfig.team) && !utils.isUserRole($profile, 'limited', false))}
        <a href="/dashboards/{data.id}/edit" title={utils.getLabel('configure',labels,$language)}><i
                class="bi bi-gear h5 me-2 link-dark"></i></a>
        {/if}
        {/if}
        {/if}
    </span>
</div>
<div class="dashboard-container" id={dashboardId}>
    {#if items.length==0}
    <div class="alert alert-light mx-auto my-auto">{utils.getLabel('empty',labels,$language)}</div>
    {:else if $mobileClient}
    <!-- Mobile Client -->
    <div class="container">
    <div class="row">
    <div class="{numberOfGridCols}">
    {#each widgets as widget, index}
    {#if getMobileWidgetHeight(widget)>0}
    <div class="row mb-1" style="height: {getMobileWidgetHeight(widget)}px;">
        <div class="col-12 {getBorderClass(index)}">
            {#if !isRoleOK(index)}
            <div class="alert alert-light mx-auto my-auto">{utils.getLabel('hidden',labels,$language)}</div>
            {:else}
            <!-- WIDGETS START -->
            {#if 'button'===getWidgetType(index)}
                    <ButtonWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'buttonplus'===getWidgetType(index)}
                    <ButtonWidgetPlus bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'chart'===getWidgetType(index)}
                    <ChartWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'chartjs'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'canvas'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'canvas_placeholder'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'chart_placeholder'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'symbol'===getWidgetType(index)}
                    <SymbolWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                        bind:application={dashboardApp} />
                    {:else if 'date'===getWidgetType(index)}
                    <DateWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                        bind:application={dashboardApp} />
                    {:else if 'textvalue'===getWidgetType(index)}
                    <TextValueWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                            bind:application={dashboardApp} />
                    {:else if 'text'===getWidgetType(index)}
                    <TextWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'devinfo'===getWidgetType(index)}
                    <InfoWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'image'===getWidgetType(index)}
                    <ImageWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'link'===getWidgetType(index)}
                    <InternalLinkWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'led'===getWidgetType(index)}
                    <LedWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'raw'===getWidgetType(index)}
                    <RawDataWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'plan'===getWidgetType(index)}
                    <PlanWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'report'===getWidgetType(index)}
                    <ReportWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'map'===getWidgetType(index)}
                    <MapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multimap'===getWidgetType(index)}
                    <GroupMapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multitrack'===getWidgetType(index)}
                    <TracksWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'groupchart'===getWidgetType(index)}
                    {#if 'doughnut'===getWidgetChartType(index)}
                    <DoughnutWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'stacked'===getWidgetChartType(index)}
                    <StackedBarWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if}
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if }
            <!-- WIDGETS END -->
            {/if}
        </div>
    </div>
    {/if}
    {/each}
    </div>
    {#if isMobile}
    <div class="col-1 bg-secondary bg-opacity-25">M</div>
    {/if}
    </div>
    </div>
    <!-- Mobile Client END -->
    {:else}
    <!-- Desktop Client -->
    <div class="row h-100">
        <div class="{numberOfGridCols} d-block">
            <Grid gap={[1,1]} bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize}
                on:mount={handleMount}>
                {#if isVisibleOnDesktop(index)}
                <div class={getBorderClass(index)}>
                    {#if !isRoleOK(index)}
                    <div class="alert alert-light mx-auto my-auto">{utils.getLabel('hidden',labels,$language)}</div>
                    {:else}
                    {#if 'button'===getWidgetType(index)}
                    <ButtonWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'buttonplus'===getWidgetType(index)}
                    <ButtonWidgetPlus bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'chart'===getWidgetType(index)}
                    <ChartWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'chartjs'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'canvas'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'canvas_placeholder'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'chart_placeholder'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'symbol'===getWidgetType(index)}
                    <SymbolWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                        bind:application={dashboardApp} />
                    {:else if 'date'===getWidgetType(index)}
                    <DateWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                        bind:application={dashboardApp} />
                    {:else if 'textvalue'===getWidgetType(index)}
                    <TextValueWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter}
                            bind:application={dashboardApp} />
                    {:else if 'text'===getWidgetType(index)}
                    <TextWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'devinfo'===getWidgetType(index)}
                    <InfoWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'image'===getWidgetType(index)}
                    <ImageWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'link'===getWidgetType(index)}
                    <InternalLinkWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'led'===getWidgetType(index)}
                    <LedWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'raw'===getWidgetType(index)}
                    <RawDataWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'plan'===getWidgetType(index)}
                    <PlanWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'report'===getWidgetType(index)}
                    <ReportWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'map'===getWidgetType(index)}
                    <MapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multimap'===getWidgetType(index)}
                    <GroupMapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multitrack'===getWidgetType(index)}
                    <TracksWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'groupchart'===getWidgetType(index)}
                    {#if 'doughnut'===getWidgetChartType(index)}
                    <DoughnutWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'stacked'===getWidgetChartType(index)}
                    <StackedBarWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if}
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if }
                    {/if}<!-- isRoleOK -->
                </div>
                {/if}<!-- isVisibleOnDesktop -->
            </Grid>
        </div>
        {#if isMobile}
        <div class="col-1 d-block bg-secondary bg-opacity-25"></div>
        {/if}
    </div>
    <!-- Desktop Client END -->
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
    import { onMount, onDestroy } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto, afterNavigate, beforeNavigate/*, afterUpdate , tick */ } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import { token, profile, language, isAuthenticated, viewMode, mobileClient } from '$lib/usersession.js';
    import { defaultOrganizationId } from '$lib/stores.js';

    import DashboardFilterForm from '$lib/components/DashboardFilterForm.svelte';
    import DashboardLinkForm from '$lib/components/DashboardLinkForm.svelte';
    import CanvasWidgetExample from '$lib/components/widgets/CanvasWidgetExample.svelte';
    import ChartjsWidgetExample from '$lib/components/widgets/ChartjsWidgetExample.svelte';
    import SymbolWidget from '$lib/components/widgets/SymbolWidget.svelte';
    import TextWidget from '$lib/components/widgets/TextWidget.svelte';
    import InfoWidget from '$lib/components/widgets/InfoWidget.svelte';
    import ImageWidget from '$lib/components/widgets/ImageWidget.svelte';
    import LedWidget from '$lib/components/widgets/LedWidget.svelte';
    import InternalLinkWidget from '$lib/components/widgets/InternalLinkWidget.svelte';
    import RawDataWidget from '$lib/components/widgets/RawDataWidget.svelte';
    import ChartWidget from '$lib/components/widgets/ChartWidget.svelte';
    import PlanWidget from '$lib/components/widgets/PlanWidget.svelte';
    import DoughnutWidget from '$lib/components/widgets/DoughnutWidget.svelte';
    import StackedBarWidget from '$lib/components/widgets/StackedBarWidget.svelte';
    import ReportWidget from '$lib/components/widgets/ReportWidget.svelte';
    import MapWidget from '$lib/components/widgets/MapWidget.svelte';
    import GroupMapWidget from '$lib/components/widgets/GroupMapWidget.svelte';
    import TracksWidget from '$lib/components/widgets/TracksWidget.svelte';
    import ButtonWidget from '$lib/components/widgets/ButtonWidget.svelte';
    import ButtonWidgetPlus from '$lib/components/widgets/ButtonWidgetPlus.svelte';
    import TextValueWidget from '$lib/components/widgets/TextValueWidget.svelte';
    import DateWidget from '$lib/components/widgets/DateWidget.svelte';

    export let data

    let errorMessage = ''
    let dashboardId = 'dashboard' + 0 //TODO
    let numberOfCols = 1

    let { item } = gridHelp;

    let editable = false; // set to true to enable editing

    let dashboardConfig = {}
    let items = []
    let widgets = []

    let dashboardFilter = { from: '', to: '' }
    let editedFilter = { from: '', to: '' }
    let dashboardLinkConfig = { link: '', code: '' }
    let applications = []
    let apps = {}
    let dashboardAppName = 'system' // default application for dashboard
    let dashboardApp = {}

    let isMobile = false
    let numberOfGridCols
    $: if (isMobile) {
        numberOfGridCols = 'col-11'
    } else {
        numberOfGridCols = 'col-12'
    }

    // Documentation of cols
    // https://github.com/vaheqelyan/svelte-grid/issues/140
    let cols = {}

    /*     const defaultInterval = 60
        let secondsToRefresh = getRefreshInterval() / 1000
        $: secondsLeft = secondsToRefresh */

    let getBorderClass = function (idx) {
        try {
            if (dashboardConfig.widgets[idx].type == 'link' 
            || dashboardConfig.widgets[idx].type == 'button'
            || dashboardConfig.widgets[idx].type == 'buttonplus') {
                return 'dashboard-widget content bg-white display'
            } else {
                return 'dashboard-widget content bg-white display h-100 border border-primary rounded-1'
            }
        } catch (e) {
            return ''
        }
    }

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
                //console.log('chartType', dashboardConfig.widgets[idx].chartType)
                return dashboardConfig.widgets[idx].chartType
            } else {
                return 'unknown'
            }
        } catch (e) {
            return 'unknown'
        }
    }

    let isVisibleOnDesktop = function (idx) {
        //console.log('isVisibleOnDesktop', widget)
        if (dashboardConfig.widgets[idx].mobile_size != undefined && dashboardConfig.widgets[idx].mobile_size != null 
            && isNaN(dashboardConfig.widgets[idx].mobile_size) == false
            && dashboardConfig.widgets[idx].mobile_size < 0
        ) {
            return false
        } else {
            return true
        }
    }

    let getMobileWidgetHeight = function (widget) {
        //console.log('getMobileWidgetHeight', widget)
        let basicHeight = 100 // default height in px
        if (widget.mobile_size != undefined && widget.mobile_size != null 
            && isNaN(widget.mobile_size) == false && widget.mobile_size >= 0
            && widget.mobile_size < 3
        ) {
            return widget.mobile_size * basicHeight
        } else {
            return basicHeight
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
        let widgetRoles = []
        try {
            widgetRoles = dashboardConfig.widgets[index].role.split(',')
        } catch (e) {
            //console.log(e)
        }
        //console.log('userRoles', userRoles)
        //console.log('widgetRoles', widgetRoles)
        // remove empty roles
        widgetRoles = widgetRoles.filter(function (entry) { return entry.trim() != ''; });
        if (widgetRoles.length == 0) {
            return true
        }
        for (let role of widgetRoles) {
            if (userRoles.includes(role)) {
                return true
            }
        }
        return false
    }

    function getApplications() {
        var result = []
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                result = JSON.parse(this.responseText);
                console.log('getApplications', result)
            }
        };
        xhttp.open("GET", utils.getBackendUrl(location) + "/api/core/application?offset=0&limit=1000", false);
        xhttp.setRequestHeader('Authentication', $token);
        xhttp.send();
        for (let i = 0; i < result.length; i++) {
            apps[result[i].name] = result[i]
            if (result[i].name == 'system' && result[i].organization == $profile.organization) {
                dashboardAppName = result[i].name // set default application for dashboard
                dashboardApp = result[i]
            }
        }
/*         if(apps[dashboardAppName]!=undefined && apps[dashboardAppName]!=null){
            dashboardApp = apps[dashboardAppName]
            console.log('dashboardApp',dashboardApp)
        }else{
            console.log('unable to get application ',dashboardAppName)
        } */
        return result
    }

    let getRefreshInterval = function () {
        let interval = 60  //300 // default refresh interval in seconds
        if ($viewMode == 'view') {
            return interval * 1000 // in ms
        }
        try {
            if (applications.length == 0) {
                applications = getApplications()
            }
            let refIntervalConfigured = false
            // check if dashboard has refresh interval configured
            if(dashboardApp.config!=undefined && dashboardApp.config!=null){
                let tmpIntv = dashboardApp.config.refreshInterval
                if (tmpIntv != null && tmpIntv != undefined && tmpIntv > 0) {
                    interval = tmpIntv
                    refIntervalConfigured = true
                }
            }
            // check if system application has refresh interval configured
            if (!refIntervalConfigured && apps['system'] != undefined) {
                try {
                    let tmpIntv = apps['system'].config.refreshInterval
                    if (tmpIntv != null && tmpIntv != undefined && tmpIntv > 0) {
                        interval = tmpIntv
                    }
                } catch (e) {
                    console.log('Error while reading application "system" config',e)
                }
            }
        } catch (e) {
            console.log(e)
        }
        //console.log('getRefreshInterval result:', interval)
        return interval * 1000 // in ms
    }

    //const defaultInterval = 60
    let secondsToRefresh = getRefreshInterval() / 1000
    $: secondsLeft = secondsToRefresh



    let show = function () {
        dashboardConfig = data
        setLinkConfig(dashboardConfig)
        blockChanges(dashboardConfig)

        items = dashboardConfig.items
        widgets = dashboardConfig.widgets
        //sort widgets by widget.mobile_position (if widget.mobile_position is not defined, set it to 100)
        widgets.forEach((widget, index) => {
            if (widget.mobile_position == undefined || widget.mobile_position == null) {
                widget.mobile_position = 100
            }
        });
        widgets.sort((a, b) => a.mobile_position - b.mobile_position);
        cols = [
            [800, 10],
            [500, 1],
        ];
    }

/*     let findApplication = function (id) {
        //console.log('findApplication', applications)
        for (let i = 0; i < applications.length; i++) {
            if (applications[i].id == id) {
                return applications[i]
            }
        }
        return null
    } */

    let interval
    afterNavigate(({ from, to }) => {
        //console.log('afterNavigate', from, to);
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
        if ($viewMode != 'view') {
            clearInterval(interval);
            interval = setInterval(() => {
                invalidateAll()
                show()
            }, getRefreshInterval());
        }
        show()
    })
    beforeNavigate(({ from, to }) => {
        clearInterval(interval);
    })
// Zmienna przechowująca aktualną szerokość okna przeglądarki.
    // Inicjalizujemy ją jako null, ponieważ `window` nie jest dostępne podczas renderowania po stronie serwera (SSR).
    let screenWidth = null;

    // Funkcja, która będzie wywoływana przy każdej zmianie rozmiaru okna.
    function handleScreenResize() {
        screenWidth = window.innerWidth;
        console.log('handleScreenResize screenWidth', screenWidth)
    }

    onMount(() => {
        if ($viewMode == 'view') {
            console.log('onMount viewMode', $viewMode)
            const interval2 = setInterval(() => {
                secondsToRefresh = secondsToRefresh - 1
                if (secondsToRefresh == 0) {
                    refreshView()
                }
            }, 1000);
            return () => {
                clearInterval(interval2);
            };
        } else {
            console.log('onMount viewMode', $viewMode)
        }
        // Ustawiamy początkową szerokość okna.
        handleScreenResize();

        // Dodajemy "nasłuchiwacz" (event listener), który będzie wywoływał `handleScreenResize`
        // za każdym razem, gdy rozmiar okna się zmieni.
        window.addEventListener('resize', handleScreenResize);

        // `onDestroy` (lub funkcja zwrotna w onMount) uruchamia się, gdy komponent jest niszczony.
        // Jest to kluczowe, aby usunąć listener i uniknąć wycieków pamięci.
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        };
    });
    // Reaktywna deklaracja (`$:`). Ten blok kodu uruchomi się ponownie za każdym razem,
    // gdy wartość `screenWidth` ulegnie zmianie.
    // Używamy progu 768px (breakpoint `md` w Bootstrap) do rozróżnienia smartfona od desktopa.
    $: deviceType = screenWidth < 768 ? 'smartfon' : 'desktop';

    function forceRefresh() {
        if ($viewMode == 'view') {
            alert(utils.getLabel('refresh_unavailable', labels, $language))
        } else {
            refreshView()
        }
    }

    function refreshView() {
        if ($viewMode == 'view') {
            secondsToRefresh = getRefreshInterval() / 1000
            console.log('secondsToRefresh', secondsToRefresh)
        } else {
            console.log('refreshView viewMode', $viewMode)
        }
        invalidateAll()
        show()
    }


    const setLinkConfig = function (config) {
        if (config != null && config != undefined && config.shared) {
            dashboardLinkConfig.link = 'https://view.signomix.com/' + config.sharedToken
            dashboardLinkConfig.code = '<IFRAME \nsrc="https://view.signomix.com/'
                + config.sharedToken
                + '" \nwidth="600" \nheight="450">\n</IFRAME>'
        } else {
            dashboardLinkConfig.link = ''
            dashboardLinkConfig.code = ''
        }
    }
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
        //editedFilter.from = utils.getLocalDateFormat(dashboardFilter.from)
        //editedFilter.to = utils.getLocalDateFormat(dashboardFilter.to)
    }
    let showLink = function (event) {
        // do nothing
    }

    function filterFormCallback(cfg) {
        dashboardFilter.from = utils.getDateApiISOFormat(cfg.from)
        dashboardFilter.to = utils.getDateApiISOFormat(cfg.to)
        editedFilter = { from: cfg.from, to: cfg.to }
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

    function isViewMode(actualMode) {
        return actualMode == 'view'
    }

    /*     const touchScrollAllow = async () => {
        await tick()
        for(let elm of document.querySelectorAll('.svlt-grid-item'))
            elm.style.touchAction = 'auto'
    } */

    /*     afterUpdate(()=>{
            touchScrollAllow()
        }) */

    let labels = {
        'refresh': {
            'pl': "Odśwież",
            'en': "Refresh"
        },
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
        'refresh_unavailable': {
            'pl': "Odświeżanie nie jest dostępne anonimowego podglądu. Zaloguj się aby uzyskać dostęp do tej funkcji.",
            'en': "Refresh is not available for anonymous view. Log in to access this feature."
        }
    }

    let switchMobile = function () {
        isMobile = !isMobile
        refreshView()
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