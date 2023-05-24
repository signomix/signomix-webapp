<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h2>{data.name}</h2>
</div>
<button class="btn btn-outline-primary sig-btn" on:click={addWidget}><i class="bi bi-plus-lg"></i></button>
<button class="btn btn-outline-primary sig-btn" id="button-save" on:click = {saveItems}><i class="bi bi-save"></i> Zapisz </button>
<div class="demo-container size">
    <Grid bind:items={items} rowHeight={100} let:item {cols} let:index>
        <div class="demo-widget content bg-white border border-primary" >
            <WidgetConfig index={index} bind:config={widgets_data} removeCallback={removeItem}
                setCurrentIndex={(idx) => setCurrentIndexRelatedStuff(idx)}/>
        </div>
    </Grid>

</div>
<!-- Modal -->
<div class="modal fade" id="configModal" tabindex="-1" role="dialog" aria-labelledby="configModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="configModalLabel">Konfiguracja</h5>
        <button type="button" class="close btn btn-outline-primary mt-2" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="container my-5">
            <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
        
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Basic</button>
        
                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Extended</button>
        
                <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Description</button>
        
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
              <div class="tab-pane fade show active p-3" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <label for="title">Nazwa:</label>
                    <input class="form-control form-control-sm mt-1" type="text" disabled id="title1" name="title" placeholder="Nazwa"><br>
                    <label for="type">Typ:</label>
                    <select id="input-type" class="form-control form-control-sm">
                        {#each widgets.types as widgetType}
                        <option>{widgetType}</option>
                        {/each}
                      </select>
                      <br><br>
                      <label class="mb-1" for="tytul-kontrolki">Tytuł kontrolki:</label><br>
                      <input class="form-control form-control-sm" type="text" id="input-control-title" name="tytul-kontrolki" placeholder="Tytuł kontrolki">
                      <small class="text-xs">Podaj jeśli ma być inny niż nazwa kontrolki</small>
                      <br>
                      <br>
                      <label  class="mb-1" for="type">Szerokość kontrolki <small>(liczba kolumn)</small></label>
                      <br>
                      <select id="input-control-width" class="form-control form-control-sm" value=2>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                      </select>
              </div>
        
              <div class="tab-pane fade p-3" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <label for="title">Nazwa:</label>
                <input class="form-control form-control-sm mt-1" disabled type="text" id="title2" name="nazwa" placeholder="Wpisz nazwę"><br>
                <label for="title">Rola użytkownika:</label>
                <input class="form-control form-control-sm mt-1" type="text" id="input-role" name="rola" placeholder="Rola">
                <small class="text-xs">Podaj jeśli ma być inny niż nazwa kontrolki</small>
                <br>
              </div>
        
              <div class="tab-pane fade p-3" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                <label for="title">Nazwa:</label>
                <input class="form-control form-control-sm mt-1" disabled type="text" id="title3" name="nazwa" placeholder="Wpisz nazwę"><br>
                <label for="title">Opis:</label>
                <textarea id="input-description" class="form-control mt-1" style="font-size: 14px" rows="5"></textarea>
                <small class="text-xs">Opis kontrolki.Dla kontrolek typu 'ramka informacyjna' pojawi się w ramce.</small>
                <br>
              </div>
              
            </div>
          </div>
  <!-- Tabs content -->
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on:click={saveConfiguration}>Zapisz</button>
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
    let savedItems = [];

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
            let pathname = window.location.pathname;
            console.log("Pathname: ", pathname);
            let savedItemsLocal = window.localStorage.getItem(pathname);
            if (!savedItemsLocal) {
                console.log("No data has been saved in local storage. Deafult init.");
                initializeExampleItems();
            } else {
                let saveItemsJson = JSON.parse(savedItemsLocal);
                items = saveItemsJson.items;
                widgets_data = saveItemsJson.widgets_data;
            }
            
        } else {
            initializeExampleItems();
        }

        saveItems();
    }


    function saveItems() {
        if(browser) {
            let pathname = window.location.pathname;
            console.log("Pathname: ", pathname);
            window.localStorage.setItem(pathname, JSON.stringify({items: items,
                widgets_data: widgets_data}));

            savedItems = items; 
        }
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
        saveItems();
    }

    function setCurrentIndexRelatedStuff(idx) {
        currentConfigureIndex = idx;
        document.getElementById("title1").value = widgets_data[idx].title;
        document.getElementById("title2").value = widgets_data[idx].title;
        document.getElementById("title3").value = widgets_data[idx].title;
        document.getElementById("input-type").value = widgets_data[idx].type;
        document.getElementById("input-control-title").value = widgets_data[idx].controlTitle;
        document.getElementById("input-control-width").value = widgets_data[idx].controlWidth;
        document.getElementById("input-role").value = widgets_data[idx].role;
        document.getElementById("input-description").value = widgets_data[idx].description;
    }


    function initializeExampleItems() {
        widgets_data = [
            { title: '0', type: 'text', controlTitle: 'tytuł kontrolki', controlWidth: 2,
                role: 'rola', description: 'opis' }, 
            { title: '1', type: 'text', controlTitle: 'tytuł kontrolki', controlWidth: 2,
                role: 'rola', description: 'opis' }, 
            { title: '2', type: 'text', controlTitle: 'tytuł kontrolki', controlWidth: 2,
                role: 'rola', description: 'opis' }, 
        ]

        items = [
            {
                id: id(),
                10: gridHelp.item({
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    draggable: true, resizable: true,  
                }),
                1: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, draggable: true, resizable: true, }),
                
            },
            {
                id: id(),
                10: gridHelp.item({
                    x: 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    draggable: true, resizable: true,  
                }),
                1: gridHelp.item({ x: 0, y: 2, w: 2, h: 2, draggable: true, resizable: true, }),
                
            },
            {
                id: id(),
                10: gridHelp.item({
                    x: 0,
                    y: 2,
                    w: 2,
                    h: 2,
                    draggable: true, resizable: true,  
                }),
                1: gridHelp.item({ x: 0, y: 4, w: 2, h: 2, draggable: true, resizable: true, }),
                
            },
        ];

    }

    function onWidgetClick(event) {
        console.log('onWidgetClick', event);
    }

    function addWidget() {
        console.log('addWidget');

        widgets_data.push({ title: widgets_data.length.toString(), type: 'text', controlTitle: 'tytuł kontrolki',
            controlWidth: 2, role: 'rola', description: 'opis' });

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

        console.log('widgets_data size ' + widgets_data.length + ' items size ' + items.length );

        saveItems();
    }

    function removeItem(itemIndex) {
        console.log(itemIndex);

        if (itemIndex > -1) {
            items.splice(itemIndex, 1);
            widgets_data.splice(itemIndex, 1);
        }

        items = gridHelp.normalize(items, COLS);

        console.log('widgets_data size ' + widgets_data.length + ' items size ' + items.length );
        saveItems();
    }
    
    function myFunction() {
        if (browser) {
            let buttonSave = document.getElementById("button-save"); 
            
            if (savedItems == items) {
                buttonSave.disabled = true;
            } else {
                buttonSave.disabled = false;
            }
        }
    };
    
    initialize();
    setInterval(myFunction, 100);
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

    .sig-btn:active {
        background-color: rgb(68, 82, 207);
    }
</style>