<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    eventually, when released: https://github.com/cuire/svelte-grid-extended
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h2>{dashboardConfig.title}</h2><a href="/dashboards/{data.id}/edit">Configure</a>
</div>
<div class="dashboard-container" id={dashboardId} >
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize} on:mount={handleMount}>
        <div class="dashboard-widget content bg-white border border-primary">
            {#if 'chartjs'===getWidgetType(index)}
            <ChartjsWidget index={index} bind:config={items} bind:cols={numberOfCols} />
            {:else if 'canvas'===getWidgetType(index)}
            <CanvasWidget index={index} bind:config={items} bind:cols={numberOfCols} />
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

    export let data
    let errorMessage = ''
    let dashboardId = 'dashboard' + 0 //TODO
    let parentDiv
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
            return items[idx][numberOfCols].widget.type
        } catch (e) {
            return 'unknown'
        }
    }
    let show = function () {
        // dashboardConfig = data
        dashboardConfig={
            id:0,
            title: 'Dashboard 1',
            items:[]
        }
        dashboardConfig.items = [
            {
                id: 0,
                10: item({
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    draggable: editable, resizable: editable,
                    widget: { type: 'canvas', title: 'Tytuł 1' }
                }),
                1: item({
                    x: 0, y: 0, w: 1, h: 2, draggable: editable, resizable: editable,
                    widget: { type: 'chartjs', title: 'Tytuł 1' }
                }),
            },
            {
                id: 1,
                10: item({
                    x: 2,
                    y: 0,
                    w: 3,
                    h: 2,
                    draggable: editable, resizable: editable,
                    widget: { type: 'canvas', title: 'Tytuł 2' }
                }),
                1: item({
                    x: 0, y: 2, w: 1, h: 2, draggable: editable, resizable: editable,
                    widget: { type: 'canvas', title: 'Tytuł 2' }
                }),
            },
            {
                id: 2,
                10: item({
                    x: 0,
                    y: 2,
                    w: 5,
                    h: 2,
                    draggable: editable, resizable: editable,
                    widget: { type: 'chartjs', title: 'Tytuł 3' }
                }),
                1: item({
                    x: 0, y: 4, w: 1, h: 2, draggable: editable, resizable: editable,
                    widget: { type: 'canvas', title: 'Tytuł 3' }
                }),
            },
        ];
        items = dashboardConfig.items
        cols = [
            [800, 10],
            [500, 1],
        ];
    }

    onMount(() => {
        parentDiv = document.getElementById(dashboardId)
        console.log(dashboardId, ' ', parentDiv.offsetWidth);
        console.log('window.innerWidth ', window.innerWidth);
        show()
    });

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