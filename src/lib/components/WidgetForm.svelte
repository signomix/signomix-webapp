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
                    {#if config[index].type!='text'}
                    <a class="nav-link {selectedTab==='extended'?'active':''}" type="button"
                        on:click={selectExtended}>Extended</a>
                    {/if}
                    {#if config[index].type=='line_chart'}
                    <a class="nav-link {selectedTab==='chart'?'active':''}" type="button" on:click={selectChart}>Chart
                        opt.</a>
                    {/if}
                    <a class="nav-link {selectedTab==='desc'?'active':''}" type="button"
                        on:click={selectDesc}>Description</a>
                </div>
            </nav>
            {#if selectedTab === 'basic'}
            <div class="p-1 mt-2">
                <div class="mb-2">
                    <label for="input-title" class="form-label">{widgets.getFieldName('title',session.language)}</label>
                    <input type="text" class="form-control form-control-sm" id="input-title"
                        placeholder="Widget's title" bind:value={config[index].title}>
                </div>
                <div class="mb-2">
                    <label for="type">Type</label>
                    <select id="input-type" class="form-control form-control-sm" bind:value={config[index].type}>
                        {#each widgets.types as widgetType}
                        <option selected={widgetType==config[index].type} value={widgetType}>{widgetType}</option>
                        {/each}
                        {#each widgets.localTypes as widgetType}
                        <option selected={widgetType==config[index].type} value={widgetType}>{widgetType}</option>
                        {/each}
                        {#each widgets.communityTypes as widgetType}
                        <option selected={widgetType==config[index].type} value={widgetType}>{widgetType}</option>
                        {/each}
                    </select>
                    <label class="form-label">Type {config[index].type} description</label>
                </div>
                {#if widgets.isVisible(config[index].type, 'eui')}
                <div class="mb-2">
                    <label for="eui" class="form-label">EUI</label>
                    <input type="text" class="form-control form-control-sm" id="eui" placeholder="EUI of the device"
                        bind:value={config[index].eui}>
                </div>
                {/if}

            </div>
            {/if}
            {#if selectedTab === 'extended'}
            <div class="p-1 mt-2">
                {#if widgets.isVisible(config[index].type, 'channel')}
                <div class="mb-2">
                    <label for="input-channels" class="form-channels">Data name(s)</label>
                    <input type="text" class="form-control form-control-sm" id="input-channels"
                        placeholder="Measurement names" bind:value={config[index].channels}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'channel_translated')}
                <div class="mb-2">
                    <label for="input-tchannels" class="form-channels">Names on widget</label>
                    <input type="text" class="form-control form-control-sm" id="input-tchannels"
                        placeholder="Measurement names presented" bind:value={config[index].channels}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'query')}
                <div class="mb-2">
                    <label for="query" class="form-label">Data range</label>
                    <input type="text" class="form-control form-control-sm" id="query"
                        placeholder="DQL" bind:value={config[index].query}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'unit')}
                <div class="mb-2">
                    <label for="unit" class="form-label">Unit</label>
                    <input type="text" class="form-control form-control-sm" id="unit" placeholder="Unit name"
                        bind:value={config[index].unit}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'rule')}
                <div class="mb-2">
                    <label for="rule" class="form-label">Alert rule</label>
                    <input type="text" class="form-control form-control-sm" id="rule" placeholder="Alert conditions"
                        bind:value={config[index].rule}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'role')}
                <div class="mb-2">
                    <label for="role" class="form-label">Role</label>
                    <input type="text" class="form-control form-control-sm" id="role" placeholder="User role (optional)"
                        bind:value={config[index].role}>
                </div>
                {/if}

            </div>
            {/if}
            {#if selectedTab === 'desc'}
            <div class="p-1 mt-2">
                <label for="title">Opis kontrolki</label>
                <textarea id="input-description" class="form-control mt-1" style="font-size: 14px" rows="5"
                    bind:value={config[index].decription}></textarea>
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
    import { userSession } from '$lib/stores.js';
    export let index
    export let config
    export let callback

    let session;
    userSession.subscribe(value => {
        session = value;
    });
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