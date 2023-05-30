<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
    <h4>{data.name}</h4>
</div>
<div class="container border-bottom pb-2">
    <button class="btn btn-outline-primary" on:click={addWidget}><i class="bi bi-plus-lg"></i></button>
    <button class="btn btn-outline-primary" on:click={saveItems} disabled={modified==false}><i class="bi bi-save"></i> Zapisz
    </button>
</div>
<div class="demo-container size">
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index>
        <div class="demo-widget content bg-white border border-primary">
            <WidgetConfig index={index} bind:config={widgets_data} removeCallback={removeItem} setCurrentIndex={(idx)=>
                setCurrentIndexRelatedStuff(idx)}/>
        </div>
    </Grid>
</div>
<!-- Modal -->
<div class="modal fade" id="configModal" tabindex="0" role="dialog" aria-labelledby="configModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <WidgetForm bind:index={currentConfigureIndex} bind:config={widgets_data} callback={testCallback}/>
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
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';

    import WidgetConfig from '$lib/components/WidgetConfig.svelte';
    import WidgetForm from '$lib/components/WidgetForm.svelte';
    import widgets from '$lib/widgets.js';

    export let data
    let errorMessage = ''

    let session;
    userSession.subscribe(value => {
        session = value;
    });

    let currentConfigureIndex = 0;
    let items = [];
    let widgets_data = [];
    let modified=false;

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

    function initialize() {
        if (browser) {
            let savedItemsLocal = window.localStorage.getItem(data.id);
            if (!savedItemsLocal) {
                console.log("No data ",data.id," has been saved in local storage.");
            } else {
                let saveItemsJson = JSON.parse(savedItemsLocal);
                items = saveItemsJson.items;
                widgets_data = saveItemsJson.widgets_data;
            }

        }
    }


    function saveItems() {
        if (browser && data.id != 'new') {
            window.localStorage.setItem(data.id, JSON.stringify({
                items: items,
                widgets_data: widgets_data
            }));
        }
        modified=false;
    }

    function saveConfiguration() {
        console.log("Save current index: ", currentConfigureIndex);

        var input = document.getElementById("input-type");
        var value = input.value;
        widgets_data[currentConfigureIndex].type = value;

        input = document.getElementById("input-control-title");
        value = input.value;
        widgets_data[currentConfigureIndex].controlTitle = value;

        input = document.getElementById("input-control-width");
        value = input.value;
        widgets_data[currentConfigureIndex].controlWidth = value;
        items[currentConfigureIndex][10].w = value;
        items[currentConfigureIndex][1].w = value;

        input = document.getElementById("input-role");
        value = input.value;
        widgets_data[currentConfigureIndex].role = value;

        input = document.getElementById("input-description");
        value = input.value;
        widgets_data[currentConfigureIndex].description = value;

        items = gridHelp.adjust(items, COLS);
    }

    function setCurrentIndexRelatedStuff(idx) {
        currentConfigureIndex = idx;
        /*
        document.getElementById("title1").value = widgets_data[idx].title;
        document.getElementById("title2").value = widgets_data[idx].title;
        document.getElementById("title3").value = widgets_data[idx].title;
        document.getElementById("input-type").value = widgets_data[idx].type;
        document.getElementById("input-control-title").value = widgets_data[idx].controlTitle;
        document.getElementById("input-control-width").value = widgets_data[idx].controlWidth;
        document.getElementById("input-role").value = widgets_data[idx].role;
        document.getElementById("input-description").value = widgets_data[idx].description; */
    }

    function onWidgetClick(event) {
        console.log('onWidgetClick', event);
    }

    function testCallback(idx, cfg){
        console.log('testCallback ', idx, cfg);
    }

    function addWidget() {
        console.log('addWidget');
        modified=true

        widgets_data.push({
            title: widgets_data.length.toString(), type: 'text', controlTitle: 'tytuł kontrolki',
            controlWidth: 2, role: 'rola', description: 'opis'
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

        let findOutPosition = gridHelp.findSpace(newItem, items, COLS);

        newItem = {
            ...newItem,
            [COLS]: {
                ...newItem[COLS],
                ...findOutPosition,
            },
        };

        items = [...items, ...[newItem]];

        console.log('widgets_data size ' + widgets_data.length + ' items size ' + items.length);

        //saveItems();
    }

    function removeItem(itemIndex) {
        console.log(itemIndex);

        if (itemIndex > -1) {
            items.splice(itemIndex, 1);
            widgets_data.splice(itemIndex, 1);
        }

        items = gridHelp.normalize(items, COLS);

        console.log('widgets_data size ' + widgets_data.length + ' items size ' + items.length);
        modified=true;
    }

    initialize();
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