<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h5>Konfiguracja pulpitu</h5><a href="/dashboards/{data.id}">Show</a>
</div>
<div class="container border-bottom pb-2">
    <form>
        <div class="row">
            <div class="col-md-1 col-form-label">
                <label for="input-id" class="form-label">ID</label>
            </div>
            <div class="col-md-3">
                <input disabled type="text" class="form-control" id="input-id" bind:value={data.id}>
            </div>
            <div class="col-md-1 col-form-label">
                <label for="input-userid" class="form-label">Owner</label>
            </div>
            <div class="col-md-3">
                <input disabled type="text" class="form-control" id="input-userid" bind:value={data.userID}>
            </div>
            <div class="col-md-4">

                <input type="checkbox" class="form-check-input me-2" id="input-shared" bind:value={data.shared}>
                <label class="form-check-label" for="input-shared">Shared</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-1 col-form-label">
                <label for="input-title" class="form-label">Title</label>
            </div>
            <div class="col-md-11">
                <input type="text" class="form-control" id="input-name" bind:value={data.title}>
            </div>
        </div>
        <div class="row">
            <div class="col-md-1 col-form-label">
                <label for="input-team" class="form-label">Team</label>
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" id="input-team" bind:value={data.team}>
            </div>
            <div class="col-md-2 col-form-label">
                <label for="input-admins" class="form-label">Administrators</label>
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" id="input-admins" bind:value={data.administrators}>
            </div>
        </div>
        <div class="row">
            <div class="col-form-label">
                <button class="btn btn-outline-secondary mt-1" on:click={goBack}>Cancel</button>
                <button class="btn btn-outline-primary me-4 mt-1" on:click={saveDashboard} disabled={modified==false}><i
                        class="bi bi-save me-2"></i> Zapisz knfigurację
                </button>
                <button class="btn btn-outline-primary mt-1 me-4" on:click={addWidget}><i
                        class="bi bi-plus-lg"></i></button>
            </div>
        </div>

    </form>
</div>
<div class="demo-container size">
    <Grid bind:items={data.items} rowHeight={100} let:item {cols} let:index>
        <div class="demo-widget content bg-white border border-primary">
            <WidgetConfig index={index} bind:config={data.widgets} removeCallback={removeItem} setCurrentIndex={(idx)=>
                setCurrentConfigureIndex(idx)}/>
        </div>
    </Grid>
</div>
<!-- Modal -->
<div class="modal fade" id="configModal" tabindex="0" role="dialog" aria-labelledby="configModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                {#if currentConfigureIndex >= 0}
                <WidgetForm bind:index={currentConfigureIndex} bind:config={data.widgets} callback={testCallback} />
                {/if}
            </div>
        </div>
    </div>
</div>

<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { userSession } from '$lib/stores.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'

    import WidgetConfig from '$lib/components/WidgetConfig.svelte';
    import WidgetForm from '$lib/components/WidgetForm.svelte';
    import widgets from '$lib/widgets.js';

    export let data
    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let previousPage = base ;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
	function goBack() {
        console.log('goBack: ', previousPage);
        goto('/');
    }

    let currentConfigureIndex = -1;
    let modified = false;

    const cols = [
        [1500, 10],
        [500, 1],
    ];

    let WIDTH = 1500;
    if (browser) {
        WIDTH = screen.width;
    }
    const COLS = WIDTH > 500 ? 10 : 1;
    console.log("screen width: ", WIDTH, ", cols size: ", COLS);

    const id = () => "_" + Math.random().toString(36).substr(2, 9);

    function saveDashboard() {
        if (browser) {
            if (data.id == 'new') {
                data.id = new Date().getTime();
            }
            window.localStorage.setItem(data.id, JSON.stringify(data));
        }
        modified = false;
    }

    function setCurrentConfigureIndex(idx) {
        currentConfigureIndex = idx;
        console.log('New currentConfigureIndex: ', currentConfigureIndex);
    }

    function testCallback(idx, cfg) {
        console.log('testCallback ', idx, cfg);
    }

    function addWidget() {
        console.log('addWidget');
        modified = true

        data.widgets.push({
            title: data.widgets.length.toString(),
            type: 'text',
            role: '',
            description: 'opis'
        });

        let newItem = {
            id: id(),
            10: gridHelp.item({
                w: 2,
                h: 2,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
            1: gridHelp.item({
                w: 2,
                h: 2,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
        };

        let findOutPosition = gridHelp.findSpace(newItem, data.items, COLS);

        newItem = {
            ...newItem,
            [COLS]: {
                ...newItem[COLS],
                ...findOutPosition,
            },
        };

        data.items = [...data.items, ...[newItem]];

        console.log('widgets_data size ' + data.widgets.length + ' items size ' + data.items.length);
    }

    function removeItem(itemIndex) {
        console.log(itemIndex);

        if (itemIndex > -1) {
            data.items.splice(itemIndex, 1);
            data.widgets.splice(itemIndex, 1);
        }

        data.items = gridHelp.normalize(data.items, COLS);

        console.log('widgets_data size ' + data.widgets.length + ' items size ' + data.items.length);
        modified = true;
    }

</script>
<style>
    .size {
        max-width: 1500px;
        width: 100%;
    }

    .demo-widget {
        height: 100%;
        width: 100%;
        display: flex;

    }

    .demo-container {
        max-width: 1500px;
        width: 100%;
    }
</style>