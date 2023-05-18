<!--
    see: https://svelte-grid.vercel.app/examples/responsive
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h2>{data.name}</h2><a href="/dashboards/{data.id}/edit">Configure</a>
</div>
<div class="demo-container size">
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index>
        <div class="demo-widget content">
            <h5>widget {index}</h5>
        </div>
    </Grid>
</div>
<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';

    export let data
    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    
    const { item } = gridHelp;
    const id = () => "_" + Math.random().toString(36).substr(2, 9);

    let editable = true; // set to true to enable editing

    let items = [
        {
            id: id(),
            10: item({
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                draggable: editable, resizable: editable,
            }),
            6: item({ x: 0, w: 2, h: 2, y: 0, draggable: editable, resizable: editable, }),
            1: item({ x: 0, y: 0, w: 1, h: 2, draggable: editable, resizable: editable, }),
        },
        {
            id: id(),
            10: item({
                x: 2,
                y: 0,
                w: 3,
                h: 2,
            }),
            6: item({ x: 2, w: 1, h: 2, y: 0 }),
            1: item({ x: 0, y: 2, w: 1, h: 2 }),
        },

        {
            id: id(),
            10: item({
                x: 0,
                y: 2,
                w: 5,
                h: 2,
            }),
            6: item({ x: 0, w: 3, h: 2, y: 2 }),
            1: item({ x: 0, y: 4, w: 1, h: 2 }),
        },
    ];

    const cols = [
        [1500, 10],
        [1024, 6],
        [500, 1],
    ];
</script>
<style>
    .size {
        max-width: 1500px;
        width: 100%;
    }

    .demo-widget {
        background: #f1f1f1;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .demo-container {
        max-width: 1500px;
        width: 100%;
    }
</style>