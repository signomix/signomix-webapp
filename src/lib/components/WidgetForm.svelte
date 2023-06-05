<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    <div class="container">
        <form>
            <nav>
                <div class="nav nav-underline" id="nav-tab">
                    <a class="nav-link {selectedTab==='basic'?'active':''}" type="button"
                        on:click={selectBasic}>Basic</a>
                    <a class="nav-link {selectedTab==='extended'?'active':''}" type="button"
                        on:click={selectExtended}>Extended</a>
                    {#if config[index].type=='line_chart'}
                    <a class="nav-link {selectedTab==='chart'?'active':''}" type="button"
                        on:click={selectChart}>Chart opt.</a>
                    {/if}
                    <a class="nav-link {selectedTab==='desc'?'active':''}" type="button"
                        on:click={selectDesc}>Description</a>
                </div>
            </nav>
            {#if selectedTab === 'basic'}
            <div class="p-1 mt-2">
                <div class="mb-2">
                    <label for="input-title" class="form-label">Title {index}</label>
                    <input type="text" class="form-control form-control-sm" id="input-title"
                        placeholder="Widget's title" bind:value={config[index].title}>
                </div>
                <div class="mb-2">
                    <label for="type">Type</label>
                    <select id="input-type" class="form-control form-control-sm" >
                        {#each widgets.types as widgetType}
                        <option selected={widgetType==config[index].type} value={widgetType}>{widgetType}</option>
                        {/each}
                    </select>
                </div>
                <div class="mb-2">
                    <label for="input-eui" class="form-label">EUI</label>
                    <input type="text" class="form-control form-control-sm" id="input-eui"
                        placeholder="EUI of the device" bind:value={config[index].eui}>
                </div>
            </div>
            {/if}
            {#if selectedTab === 'extended'}
            <div class="p-1 mt-2">
                <div class="mb-2">
                    <label for="input-channels" class="form-channels">Data name(s)</label>
                    <input type="text" class="form-control form-control-sm" id="input-channels"
                        placeholder="Measurement names" bind:value={config[index].channels}>
                </div>
                <div class="mb-2">
                    <label for="input-tchannels" class="form-channels">Names on widget</label>
                    <input type="text" class="form-control form-control-sm" id="input-tchannels"
                        placeholder="Measurement names presented" bind:value={config[index].channels}>
                </div>
                <div class="mb-2">
                    <label for="input-role" class="form-label">User role</label>
                    <input type="text" class="form-control form-control-sm" id="input-role"
                        placeholder="User's role" bind:value={config[index].role}>
                </div>
                <div class="mb-2">
                    <label for="input-rule" class="form-label">Alert rule</label>
                    <input type="text" class="form-control form-control-sm" id="input-rule"
                        placeholder="Alert conditions" bind:value={config[index].rule}>
                </div>

            </div>
            {/if}
            {#if selectedTab === 'desc'}
            <div class="p-1 mt-2">
                <label for="title">Opis kontrolki</label>
                <textarea id="input-description" class="form-control mt-1" style="font-size: 14px" rows="5"></textarea>
                <small class="text-xs">Dla kontrolek typu 'ramka informacyjna' pojawi się w ramce.</small>
                <br>
            </div>
            {/if}
            <div class="mt-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on:click={handleClick}>
                    Zapisz
                </button>
            </div>
        </form>
    </div>

</div>
<script>
    import widgets from '$lib/widgets.js';
    export let index
    export let config
    export let callback

    //let widget = config[index]

    let selectedTab = 'basic'
    //console.log(config[index])
    function handleClick(event) {
        console.log('clicked widget index', index, 'config', config[index])
        callback(index, config[index])
    }
    function selectBasic() {
        selectedTab = 'basic'
    }
    function selectExtended() {
        selectedTab = 'extended'
    }
    function selectDesc() {
        selectedTab = 'desc'
    }
    function selectChart() {
        selectedTab = 'chart'
    }
</script>