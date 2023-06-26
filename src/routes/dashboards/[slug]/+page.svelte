<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    eventually, when released: https://github.com/cuire/svelte-grid-extended
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{dashboardConfig.title}</h5><a href="/dashboards/{data.id}/edit">Configure</a>
</div>
<div class="dashboard-container" id={dashboardId} >
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize} on:mount={handleMount}>
        <div class="dashboard-widget content bg-white border border-primary rounded-1">
            {#if 'chartjs'===getWidgetType(index)}
            <ChartjsWidget index={index} bind:config={items} />
            {:else if 'canvas'===getWidgetType(index)}
            <CanvasWidget index={index} bind:config={items} />
            {:else if 'canvas_placeholder'===getWidgetType(index)}
            <CanvasWidget index={index} bind:config={items} />
            {:else if 'chart_placeholder'===getWidgetType(index)}
            <ChartjsWidget index={index} bind:config={items} />
            {:else if 'symbol'===getWidgetType(index)}
            <SymbolWidget bind:config={dashboardConfig.widgets[index]} />
            {:else if 'text'===getWidgetType(index)}
            <TextWidget bind:config={dashboardConfig.widgets[index]} />
            {:else}
            <CanvasWidget index={index} bind:config={items} />
            {/if }
        </div>
    </Grid>
</div>
<script>
    import { onMount } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';

    import CanvasWidget from '$lib/components/widgets/CanvasWidget.svelte';
    import ChartjsWidget from '$lib/components/widgets/ChartjsWidget.svelte';
    import SymbolWidget from '$lib/components/widgets/SymbolWidget.svelte';
    import TextWidget from '$lib/components/widgets/TextWidget.svelte';

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
    let dashboardConfig={}
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

    let show = function () {
        dashboardConfig = data
        blockChanges(dashboardConfig)
        console.log('dashboardConfig ', dashboardConfig)
        items = dashboardConfig.items
        cols = [
            [800, 10],
            [500, 1],
        ];
    }

    onMount(() => {
        //parentDiv = document.getElementById(dashboardId)
        //console.log(dashboardId, ' ', parentDiv.offsetWidth);
        //console.log('window.innerWidth ', window.innerWidth);
        show()
    });

    const blockChanges=function(config){
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