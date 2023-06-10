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
                        on:click={selectExtended}>Details</a>
                    {/if}
                    {#if config[index].type=='chart'}
                    <a class="nav-link {selectedTab==='chart'?'active':''}" type="button" on:click={selectChart}>Chart
                        opt.</a>
                    {/if}
                    <a class="nav-link {selectedTab==='config'?'active':''}" type="button"
                        on:click={selectConfig}>Config</a>
                    <a class="nav-link {selectedTab==='desc'?'active':''}" type="button"
                        on:click={selectDesc}>Description</a>
                </div>
            </nav>
            {#if selectedTab === 'basic'}
            <div class="p-1 mt-2">
                <div class="mb-2">
                    <label for="title" class="form-label">{widgets.getFieldName('title',session.language)}</label>
                    <input type="text" class="form-control form-control-sm" id="title"
                        bind:value={config[index].title}>
                </div>
                <div class="mb-2">
                    <label for="type">Type</label>
                    <select id="type" class="form-control form-control-sm" bind:value={config[index].type}>
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
                    <input type="text" class="form-control form-control-sm" id="eui"
                        bind:value={config[index].dev_id}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'group')}
                <div class="mb-2">
                    <label for="group" class="form-label">Group</label>
                    <input type="text" class="form-control form-control-sm" id="group"
                        bind:value={config[index].group}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'imageUrl')}
                <div class="mb-2">
                    <label for="imageUrl" class="form-channels">Image URL</label>
                    <input type="text" class="form-control form-control-sm" id="imageUrl"
                        bind:value={config[index].imageUrl}>
                </div>
                {/if}
            </div>
            {/if}
            {#if selectedTab === 'extended'}
            <div class="p-1 mt-2">
                {#if widgets.isVisible(config[index].type, 'channel')}
                <div class="mb-2">
                    <label for="channel" class="form-channels">Data name(s)</label>
                    <input type="text" class="form-control form-control-sm" id="channel"
                        bind:value={config[index].channel}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'channel_translated')}
                <div class="mb-2">
                    <label for="channel_translated" class="form-channels">Names on widget</label>
                    <input type="text" class="form-control form-control-sm" id="channel_translated"
                        bind:value={config[index].channel_translated}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'query')}
                <div class="mb-2">
                    <label for="query" class="form-label">Data range</label>
                    <input type="text" class="form-control form-control-sm" id="query"
                        bind:value={config[index].query}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'rounding')}
                <div class="mb-2">
                    <label for="rounding" class="form-channels">Value rounding</label>
                    <input type="text" class="form-control form-control-sm" id="rounding"
                        bind:value={config[index].rounding}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'unit')}
                <div class="mb-2">
                    <label for="unit" class="form-label">Unit</label>
                    <input type="text" class="form-control form-control-sm" id="unit"
                        bind:value={config[index].unitName}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'range')}
                <div class="mb-2">
                    <label for="range" class="form-label">Alert rule</label>
                    <input type="text" class="form-control form-control-sm" id="range"
                        bind:value={config[index].range}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'icon')}
                <div class="mb-2">
                    <label for="icon" class="form-channels">Icon</label>
                    <input type="text" class="form-control form-control-sm" id="icon"
                        bind:value={config[index].icon}>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'commandType')}
                <div class="p-1 mt-2">
                    <label for="commandType">Command type</label>
                    <select id="commandType" class="form-control form-control-sm" bind:value={config[index].commandType}>
                        <option selected={'plain'==config[index].commandType} value="plain">PLAIN</option>
                        <option selected={'hex'==config[index].commandType} value="hex">HEX</option>
                        <option selected={'json'==config[index].commandType} value="json">JSON</option>
                    </select>
                </div>
                {/if}
                {#if widgets.isVisible(config[index].type, 'role')}
                <div class="mb-2">
                    <label for="role" class="form-label">Role</label>
                    <input type="text" class="form-control form-control-sm" id="role"
                        bind:value={config[index].role}>
                </div>
                {/if}

            </div>
            {/if}
            {#if selectedTab === 'chart' && config[index].type=='chart'}
            <div class="p-1 mt-2">
                <label for="chart_type">Typ wykresu</label>
                <select id="chart_type" class="form-control form-control-sm" bind:value={config[index].chartType}>
                    {#each widgets.chartTypes as chartType}
                    <option selected={chartType==config[index].chartType} value={chartType}>{chartType}</option>
                    {/each}
                </select>
            </div>
            {#if config[index].chartType=='line' || config[index].chartType=='stepped'}
            <div class="p-1 mt-2">
                <label for="chart_option">Wersja</label>
                <select id="chart_option" class="form-control form-control-sm" bind:value={config[index].chartOption}>
                    {#each widgets.chartOptions[config[index].chart_type] as chartOption}
                    <option selected={chartOption==config[index].chart_option} value={chartOption}>{chartOption}
                    </option>
                    {/each}
                </select>
            </div>
            <div class="p-1 mt-2">
                <label for="cubic">Cubic interpolation</label>
                <select id="cubic" class="form-control form-control-sm" bind:value={config[index].cubicInterpolation}>
                    <option selected={true==config[index].cubicInterpolation} value="true">true</option>
                    <option selected={false==config[index].cubicInterpolation} value="false">false</option>
                </select>
            </div>
            {/if}
            <div class="p-1 mt-2">
                <label for="format">Data character</label>
                <select id="format" class="form-control form-control-sm" bind:value={config[index].format}>
                    <option selected={'standard'==config[index].format} value='standard'>standard</option>
                    <option selected={'timeseries'==config[index].format} value='standard'>timeseries</option>
                </select>
            </div>
            {/if}
            {#if selectedTab === 'config'}
            {#if widgets.isVisible(config[index].type, 'app_id')}
                <div class="mb-2">
                    <label for="app_id" class="form-label">Application ID</label>
                    <input type="text" class="form-control form-control-sm" id="app_id"
                        bind:value={config[index].app_id}>
                </div>
            {/if}
            <div class="p-1 mt-2">
                <label for="config">Configuration</label>
                <textarea id="config" class="form-control mt-1" style="font-size: 14px" rows="5"
                    bind:value={config[index].config}></textarea>
                <small class="text-xs">Optional widget configuration (JSON)</small>
                <br>
            </div>
            {/if}
            {#if selectedTab === 'desc'}
            <div class="p-1 mt-2">
                <label for="description">Opis kontrolki</label>
                <textarea id="description" class="form-control mt-1" style="font-size: 14px" rows="5"
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

    let selectedTab = 'basic'
    function handleClick(event) {
        //console.log('clicked widget index', index, 'config', config[index])
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
    function selectConfig() {
        selectedTab = 'config'
    }
</script>