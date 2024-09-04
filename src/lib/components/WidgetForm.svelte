<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    <div class="container">
        {#if config[index]!=undefined && config[index]!=null}
        <form>
            <nav>
                <div class="nav nav-underline" id="nav-tab">
                    {#if activeTabs.basic}
                    <a class="nav-link {selectedTab==='basic'?'active':''}" type="button"
                        on:click={selectBasic}>{utils.getLabel('basic',labels,$language)}</a>
                    {/if}
                    {#if activeTabs.extended}
                    <a class="nav-link {selectedTab==='extended'?'active':''}" type="button"
                        on:click={selectExtended}>{utils.getLabel('details',labels,$language)}</a>
                    {/if}
                    {#if activeTabs.chart}
                    <a class="nav-link {selectedTab==='chart'?'active':''}" type="button" on:click={selectChart}>{utils.getLabel('chart_opt',labels,$language)}</a>
                    {/if}
                    {#if activeTabs.config}
                    <a class="nav-link {selectedTab==='config'?'active':''}" type="button"
                        on:click={selectConfig}>{utils.getLabel('config',labels,$language)}</a>
                    {/if}
                    {#if activeTabs.desc}
                    <a class="nav-link {selectedTab==='desc'?'active':''}" type="button"
                        on:click={selectDesc}>{utils.getLabel('description',labels,$language)}</a>
                    {/if}
                </div>
            </nav>
            {#if selectedTab === 'basic'}
            <div class="p-1 mt-2">
                <div class="mb-2">
                    <label for="title" class="form-label">{widgets.getFieldName('title',$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="title" bind:value={config[index].title}>
                </div>
                <div class="mb-2">
                    <label for="type">{utils.getLabel('type',labels,$language)}</label>
                    <select id="type" class="form-select form-select-sm" bind:value={config[index].type}>
                        {#each widgets.types as widgetType}
                        <option selected={widgetType==selectedType} value={widgetType}>
                            {utils.getLabel(widgetType,widgets.getTypeNames(),$language)}</option>
                        {/each}
                        {#each widgets.localTypes as widgetType}
                        <option selected={widgetType==selectedType} value={widgetType}>{widgetType}</option>
                        {/each}
                        {#each widgets.communityTypes as widgetType}
                        <option selected={widgetType==selectedType} value={widgetType}>{widgetType}</option>
                        {/each}
                    </select>
                    <!-- <label class="form-label">{utils.getLabel(getSelectedTypeDescCode(selectedType),labels,$language)}</label> -->
                </div>

                {#if widgets.isVisible(selectedType, 'dev_id') || widgets.isVisible(selectedType, 'group') || widgets.isVisible(selectedType, 'reportSelector')}
                <div class="mb-2">
                    <label for="data_source">{utils.getLabel('data_source',labels,$language)}</label>
                    <div id="data_source">
                    {#if singleDeviceMode==1}
                    <input class="form-check-input" type="radio" name="gr" id="groupRadio1" value="1"
                        on:click={setSingleDevice} checked>
                    {:else}
                    <input class="form-check-input" type="radio" name="gr" id="groupRadio1" value="1"
                        on:click={setSingleDevice}>
                    {/if}
                    <label class="form-check-label" for="groupRadio1">
                        {utils.getLabel('single_device',labels,$language)}
                    </label>
                    {#if singleDeviceMode==0}
                    <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio2" value="0"
                        on:click={setGroup} checked>
                    {:else}
                    <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio2" value="0"
                        on:click={setGroup}>
                    {/if}
                    <label class="form-check-label" for="gropuRadio2">
                        {utils.getLabel('group_of_devices',labels,$language)}
                    </label>
                    {#if singleDeviceMode==2}
                    <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio3" value="2"
                        on:click={setReport} checked>
                    {:else}
                    <input class="form-check-input ms-2" type="radio" name="gr" id="groupRadio3" value="2"
                        on:click={setReport}>
                    {/if}
                    <label class="form-check-label" for="gropuRadio3">
                        {utils.getLabel('report',labels,$language)}
                    </label>
                    </div>
                </div>
                {/if}
                {#if singleDeviceMode==1 && widgets.isVisible(selectedType, 'dev_id')}
                <div class="input-group mb-2">
                    <label for="dev_id" class="form-label me-2">{utils.getLabel('eui',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="dev_id"
                        bind:value={config[index].dev_id}>
                    <button type="button" class="btn btn-outline-secondary" on:click={()=> (showDeviceSelectorModal =
                        true)}>...</button>
                </div>
                {/if}
                {#if singleDeviceMode==0 && widgets.isVisible(selectedType, 'group')}
                <div class="input-group mb-2">
                    <label for="group" class="form-label me-2">{utils.getLabel('group',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="group" bind:value={config[index].group}>
                    <button type="button" class="btn btn-outline-secondary" on:click={()=> (showGroupSelectorModal =
                        true)}>...</button>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'imageUrl')}
                <div class="mb-2">
                    <label for="imageUrl" class="form-channels">{utils.getLabel('image_url',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="imageUrl"
                        bind:value={config[index].imageUrl}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'dashboardID')}
                <div class="mb-2">
                    <label for="dashboardID" class="form-channels">{utils.getLabel('dashboard_eui',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="dashboardID"
                        bind:value={config[index].dashboardID}>
                </div>
                {/if}
            </div>
            {/if}
            {#if selectedTab === 'extended'}
            <div class="p-1 mt-2">
                {#if widgets.isVisible(selectedType, 'channel') && singleDeviceMode!=2}
                <div class="mb-2">
                    <label for="channel" class="form-channels">{utils.getLabel('measurements',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="channel"
                        bind:value={config[index].channel}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'channel_translated') && singleDeviceMode!=2}
                <div class="mb-2">
                    <label for="channel_translated" class="form-channels">{utils.getLabel('names_on_widget',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="channel_translated"
                        bind:value={config[index].channel_translated}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'query')}
                {#if singleDeviceMode==2}
                <div class="mb-2">
                    <label for="query" class="form-label">{utils.getLabel('data_range',labels,$language)}</label>
                    <textarea class="form-control form-control-sm" id="query" bind:value={config[index].query}
                    rows="3" cols="50"></textarea>
                </div>
                {:else}
                <div class="mb-2">
                    <label for="query" class="form-label">{utils.getLabel('data_range',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="query" bind:value={config[index].query}>
                </div>
                {/if}
                {/if}
                {#if widgets.isVisible(selectedType, 'rounding')}
                <div class="mb-2">
                    <label for="rounding" class="form-channels">{utils.getLabel('rounding',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="rounding"
                        bind:value={config[index].rounding}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'unit')}
                <div class="mb-2">
                    <label for="unit" class="form-label">{utils.getLabel('unit',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="unit"
                        bind:value={config[index].unitName}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'range')}
                <div class="mb-2">
                    <label for="range" class="form-label">{utils.getLabel('alert_rule',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="range" bind:value={config[index].range}>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'icon')}
                <div class="mb-2">
                    <label for="icon" class="form-channels">{utils.getLabel('icons',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="icon" bind:value={config[index].icon}>
                    <small class="text-xs">User defined icons (optional) - separate with a colon</small>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'commandType')}
                <div class="p-1 mt-2">
                    <label for="commandType">{utils.getLabel('command_type',labels,$language)}</label>
                    <select id="commandType" class="form-select form-select-sm" bind:value={config[index].commandType}>
                        <option selected={'plain'==config[index].commandType} value="plain">PLAIN</option>
                        <option selected={'hex'==config[index].commandType} value="hex">HEX</option>
                        <option selected={'json'==config[index].commandType} value="json">JSON</option>
                    </select>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'commandText') && config[index].commandType!='json'}
                <div class="mb-2">
                    <label for="commandText" class="form-channels">{utils.getLabel('commandText',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="commandText" bind:value={config[index].commandText}>
                    <small class="text-xs">Text to send as command</small>
                </div>
                {/if}
                {#if widgets.isVisible(selectedType, 'commandJSON') && config[index].commandType=='json'}
                <label for="commandJSON">{utils.getLabel('commandJSON',labels,$language)}</label>
                <textarea id="commandJSON" class="form-control mt-1" style="font-size: 14px" rows="5"
                    bind:value={config[index].commandJSON}></textarea>
                <small class="text-xs">JSON to send as command</small>
                {/if}
                {#if widgets.isVisible(selectedType, 'role')}
                <div class="mb-2">
                    <label for="role" class="form-label">{utils.getLabel('role',labels,$language)}</label>
                    <input type="text" class="form-control form-control-sm" id="role" bind:value={config[index].role}>
                </div>
                {/if}

            </div>
            {/if}
            <!-- chart options -->
            {#if selectedTab === 'chart'}
            <div class="p-1 mt-2">
                <label for="chart_type">{utils.getLabel('chart_type',labels,$language)}</label>
                <select id="chart_type" class="form-select form-select-sm" bind:value={config[index].chartType}>
                    {#if selectedType=='chart'}
                    {#each widgets.chartTypes as chartType}
                    <option selected={chartType==config[index].chartType} value={chartType}>{chartType}</option>
                    {/each}
                    {/if}
                    {#if selectedType=='groupchart'}
                    {#each widgets.groupchartTypes as chartType}
                    <option selected={chartType==config[index].chartType} value={chartType}>{chartType}</option>
                    {/each}
                    {/if}
                </select>
            </div>
            {#if config[index].chartType=='line'}
            <!--
            <div class="p-1 mt-2">
                <label for="chart_option">Wersja</label>
                <select id="chart_option" class="form-select form-select-sm" bind:value={config[index].chartOption}>
                    {#each widgets.chartOptions[config[index].chart_type] as chartOption}
                    <option selected={chartOption==config[index].chart_option} value={chartOption}>{chartOption}
                    </option>
                    {/each}
                </select>
            </div>
            -->
            <div class="p-1 mt-2">
                <div class="form-check form-switch form-check-inline">
                    <label class="form-check-label me-1" for="chart-markers">{utils.getLabel('markers',labels,$language)}</label>
                    <input type="checkbox" class="form-check-input" id="chart-markers"
                        bind:checked={config[index].chartMarkers}>
                </div>
                <div class="form-check form-switch form-check-inline">
                    <label class="form-check-label me-1" for="chart-area">{utils.getLabel('area',labels,$language)}</label>
                    <input type="checkbox" class="form-check-input" id="chart-area"
                        bind:checked={config[index].chartArea}>
                </div>
            </div>
            <!-- <div class="p-1 mt-2 form-check form-switch">
                                <label class="form-check-label me-1" for="cubic">Cubic interpolation</label>
                <input type="checkbox" class="form-check-input form-control-sm" id="cubic" bind:checked={config[index].cubicInterpolation}>
                    <select id="cubic" class="form-select form-select-sm" bind:value={config[index].cubicInterpolation}>
                    <option selected={true==config[index].cubicInterpolation} value="true">true</option>
                    <option selected={false==config[index].cubicInterpolation} value="false">false</option>
                </select> 
            </div>
            -->
            {/if}
            <div class="p-1 mt-2">
                <label for="format">{utils.getLabel('data_characteristic',labels,$language)}</label>
                <select id="format" class="form-select form-select-sm" bind:value={config[index].format}>
                    <option selected={'standard'==config[index].format} value='standard'>standard</option>
                    <option selected={'timeseries'==config[index].format} value='timeseries'>timeseries</option>
                </select>
            </div>
            <div class="p-1 mt-2">
                <label for="format">{utils.getLabel('time_on_x',labels,$language)}</label>
                <select id="format" class="form-select form-select-sm" bind:value={config[index].timeUnit}>
                    <option value="" selected={config[index].timeUnit=='' || config[index].timeUnit==undefined}>
                        {utils.getLabel('auto_setting',labels,$language)}</option>
                    <option value="quarter" selected={config[index].timeUnit=='quarter' }>{utils.getLabel('quarters',labels,$language)}</option>
                    <option value="week" selected={config[index].timeUnit=='week' }>{utils.getLabel('weeks',labels,$language)}</option>
                    <option value="day" selected={config[index].timeUnit=='day' }>{utils.getLabel('days',labels,$language)}</option>
                    <option value="hour" selected={config[index].timeUnit=='hour' }>{utils.getLabel('hours',labels,$language)}</option>
                    <option value="minute" selected={config[index].timeUnit=='minute' }>{utils.getLabel('minutes',labels,$language)}</option>
                </select>
            </div>
            <div class="p-1 mt-2">
                <div class="form-check form-switch form-check-inline">
                    <label class="form-check-label me-1" for="chart-axis-options">{utils.getLabel('axis_options',labels,$language)}</label>
                    <input type="checkbox" class="form-check-input" id="chart-axis-options"
                        bind:checked={config[index].axisOptions}>
                </div>
            </div>
            {#if config[index].axisOptions}
            <div class="p-1 mt-2">
                <div class="form-check form-switch form-check-inline">
                    <label class="form-check-label me-1" for="chart-y-axis-autoscale">{utils.getLabel('y_axis_autoscale',labels,$language)}</label>
                    <input type="checkbox" class="form-check-input" id="chart-y-axis-autoscale"
                        bind:checked={config[index].yAxisAutoScale}>
                </div>
            </div>
            {/if}
            {/if}
            <!-- widget instance configuration -->
            {#if selectedTab === 'config'}
            {#if widgets.isVisible(selectedType, 'app_id') && $profile.organization!=$defaultOrganizationId}
            <div class="mb-2">
                <label for="app_id" class="form-label">{utils.getLabel('application_id',labels,$language)}</label>
                <input type="text" class="form-control form-control-sm" id="app_id" bind:value={config[index].app_id}>
            </div>
            {/if}
            <div class="p-1 mt-2">
                <label for="config">{utils.getLabel('configuration',labels,$language)}</label>
                <textarea id="config" class="form-control mt-1" style="font-size: 14px" rows="5"
                    bind:value={config[index].config}></textarea>
                <small class="text-xs">Optional widget configuration (JSON)</small>
                <br>
            </div>
            {/if}
            <!-- widget description -->
            {#if selectedTab === 'desc'}
            <div class="p-1 mt-2">
                <label for="description">{utils.getLabel('widget_description',labels,$language)}</label>
                <textarea id="description" class="form-control mt-1" style="font-size: 14px" rows="5"
                    bind:value={config[index].description}></textarea>
                <small class="text-xs">Dla kontrolek typu 'ramka informacyjna' pojawi się w ramce.</small>
                <br>
            </div>
            {/if}
            <div class="mt-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{utils.getLabel('cancel',labels,$language)}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on:click={handleClick}>
                    {utils.getLabel('save',labels,$language)}
                </button>
            </div>
        </form>
        {:else}
        <div class="alert alert-danger" role="alert">
            Brak konfiguracji
        </div>
        <div class="mt-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{utils.getLabel('cancel',labels,$language)}</button>
        </div>
        {/if}
    </div>

</div>

<DeviceSelector bind:showDeviceSelectorModal callback={setDevice}></DeviceSelector>
<GroupSelector bind:showGroupSelectorModal callback={selectGroup}></GroupSelector>

<script>
    import widgets from '$lib/widgets.js';
    import sgxdata from '$lib/sgxdata.js';
    import { utils } from '$lib/utils.js';
    import { profile, token, language, isAuthenticated } from '$lib/usersession.js';
    import { defaultOrganizationId } from '$lib/stores.js';
    import { onMount } from 'svelte';
    import DeviceSelector from '$lib/components/DeviceSelector.svelte';
    import GroupSelector from '$lib/components/GroupSelector.svelte';
    export let index
    export let config
    export let callback

    let selectedTab = 'basic'
    // singleDeviceMode: 0 - group, 1 - single device, 2 - report
    let reportType = false
    let singleDeviceMode = 0
    let showDeviceSelectorModal = false;
    let showGroupSelectorModal = false;
    let myDevices = []
    let activeTabs = {
        basic: true,
        extended: true,
        desc: true,
        chart: false,
        config: true
    }

    $: selectedType = config[index].type


    /* $: if (config[index].type == 'groupchart' || config[index].type == 'multimap' || config[index].type == 'plan' || config[index].type == 'report') {
        singleDeviceMode = 0
    } else {
        singleDeviceMode = 1
    } */

    /*types: [
        'button',
        'chart',
        'groupchart',
        'date',
        'devinfo',
        'image',
        'led',
        'link',
        'map',
        'multimap',
        'multitrack',
        'plan',
        'raw',
        'report',
        'symbol',
        'stopwatch',
        'time',
        'text',
        'canvas_placeholder',
        'chart_placeholder'
    ]*/

    $: switch (config[index].type) {
        case 'groupchart':
        case 'chart':
            activeTabs.extended = true
            activeTabs.chart = true
            activeTabs.config = true
            break;
        case 'multimap':
        case 'multitrack':
        case 'map':
            activeTabs.extended = true
            activeTabs.chart = false
            activeTabs.config = true
            break;
        case 'plan':
            activeTabs.extended = true
            activeTabs.chart = false
            activeTabs.config = true
            break;
        case 'report':
            activeTabs.extended = true
            activeTabs.chart = false
            activeTabs.config = true
            break;
        case 'text':
        case 'canvas_placeholder':
        case 'chart_placeholder':
            activeTabs.extended = false
            activeTabs.chart = false
            activeTabs.config = false
            break;
        //case 'button':
        //case 'date':
        //case 'devinfo':
        //case 'image':
        //case 'led':
        //case 'link':
        //case 'raw':
        //case 'symbol':
        //case 'stopwatch':
        //case 'time':
        //    break;
        default:
            activeTabs.extended = true
            activeTabs.chart = false
            activeTabs.config = true
            break;
    }



    onMount(() => {
        config[index].type = config[index].type || 'text'
        try{
            reportType=config[index].query.toLowerCase().includes('class') || config[index].query.toLowerCase().includes('report')
        }catch(e){
            //reportType=false
        }
        if(config[index].query!=undefined && config[index].query!=null && reportType){
            singleDeviceMode = 2
        }else if (config[index].dev_id != undefined && config[index].dev_id != null && config[index].dev_id != '') {
            singleDeviceMode = 1
        } else if (config[index].group != undefined && config[index].group != null && config[index].group != '') {
            singleDeviceMode = 0
        } else {
            if (config[index].type == 'groupchart' || config[index].type == 'multimap' || config[index].type == 'plan' || config[index].type == 'report') {
                singleDeviceMode = 0
            } else {
                singleDeviceMode = 1
            }
        }
        //console.log('singleDeviceMode', singleDeviceMode)
        //console.log('config', config[index])
    });

    function setDevice(selectedDevice) {
        //console.log('selectedDevice', selectedDevice)
        config[index].dev_id = selectedDevice
    }

    function selectGroup(selectedGroup) {
        //console.log('selectedGroup', selectedGroup)
        config[index].group = selectedGroup
    }

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
    function setGroup() {
        config[index].dev_id = ''
        singleDeviceMode = 0

    }
    function setSingleDevice() {
        config[index].group = ''
        singleDeviceMode = 1
    }
    function setReport() {
        config[index].dev_id = ''
        config[index].group = ''
        singleDeviceMode = 2

    }

    function getSelectedTypeDescCode(type){
        switch (type) {
            case 'button':
                return 'button_desc'
            case 'chart':
                return 'chart_desc'
            case 'groupchart':
                return 'groupchart_desc'
            case 'date':
                return 'date_desc'
            case 'devinfo':
                return 'devinfo_desc'
            case 'image':
                return 'image_desc'
            case 'led':
                return 'led_desc'
            case 'link':
                return 'link_desc'
            case 'map':
                return 'map_desc'
            case 'multimap':
                return 'multimap_desc'
            case 'multitrack':
                return 'multitrack_desc'
            case 'plan':
                return 'plan_desc'
            case 'raw':
                return 'raw_desc'
            case 'report':
                return 'report_desc'
            case 'symbol':
                return 'symbol_desc'
            case 'stopwatch':
                return 'stopwatch_desc'
            case 'time':
                return 'time_desc'
            case 'text':
                return 'text_desc'
            case 'canvas_placeholder':
                return 'canvas_placeholder_desc'
            case 'chart_placeholder':
                return 'chart_placeholder_desc'
            default:
                return 'text_desc'
        }
    }

    let labels = {
        'cancel': {
            'en': 'Cancel',
            'pl': 'Anuluj',
        },
        'save': {
            'en': 'Save',
            'pl': 'Zapisz',
        },
        'application_id': {
            'en': 'Application ID',
            'pl': 'ID Aplikacji',
        },
        'configuration': {
            'en': 'Configuration',
            'pl': 'Konfiguracja',
        },
        'description': {
            'en': 'Description',
            'pl': 'Opis',
        },
        'basic': {
            'en': 'Basic',
            'pl': 'Podstawowe',
        },
        'config': {
            'en': 'Configuration',
            'pl': 'Konfiguracja',
        },
        'details': {
            'en': 'Details',
            'pl': 'Szczegóły',
        },
        'chart_opt': {
            'en': 'Chart options',
            'pl': 'Opcje wykresu',
        },
        'type': {
            'en': 'Type',
            'pl': 'Typ',
        },
        'data_source': {
            'en': 'Data source',
            'pl': 'Źródło danych',
        },
        'single_device': {
            'en': 'Single device',
            'pl': 'Pojedyncze urządzenie',
        },
        'group_of_devices': {
            'en': 'Group of devices',
            'pl': 'Grupa urządzeń',
        },
        'report': {
            'en': 'Report',
            'pl': 'Raport',
        },
        'eui': {
            'en': 'EUI',
            'pl': 'EUI',
        },
        'group': {
            'en': 'Group',
            'pl': 'Grupa',
        },
        'image_url': {
            'en': 'Image URL',
            'pl': 'Adres obrazka',
        },
        'dashboard_eui': {
            'en': 'Dashboard EUI',
            'pl': 'EUI Dashboardu',
        },
        'widget_description': {
            'en': 'Widget description',
            'pl': 'Opis widżetu',
        },
        'measurements': {
            'en': 'Measurement names',
            'pl': 'Nazwy pomiarów',
        },
        'names_on_widget': {
            'en': 'Names on widget',
            'pl': 'Nazwy na kontrolce',
        },
        'data_range': {
            'en': 'Data range (DQL)',
            'pl': 'Zakres danych (DQL)',
        },
        'rounding': {
            'pl': 'Zaokrąglenie wartości',
            'en': 'Rounding',
        },
        'unit': {
            'pl': 'Nazwa jednostki miary',
            'en': 'Unit name',
        },
        'alert_rule': {
            'en': 'Alert rule',
            'pl': 'Reguła alarmu',
        },
        'icons': {
            'pl': 'Ikony',
            'en': 'Icons',
        },
        'command_type': {
            'pl': 'Typ komendy',
            'en': 'Command type',
        },
        'role': {
            'pl': 'Rola użytkownika',
            'en': 'User role',
        },
        'chart_type': {
            'pl': 'Typ wykresu',
            'en': 'Chart type',
        },
        'data_characteristic': {
            'pl': 'Charakterystyka danych',
            'en': 'Data characteristic',
        },
        'time_on_x': {
            'pl': 'Czas na osi X',
            'en': 'Time on X axis',
        },
        'auto_setting': {
            'pl': 'Automatyczne ustawienie',
            'en': 'Auto setting',
        },
        'quarters': {
            'pl': 'Kwartały',
            'en': 'Quarters',
        },
        'weeks': {
            'pl': 'Tygodnie',
            'en': 'Weeks',
        },
        'days': {
            'pl': 'Dni',
            'en': 'Days',
        },
        'hours': {
            'pl': 'Godziny',
            'en': 'Hours',
        },
        'minutes': {
            'pl': 'Minuty',
            'en': 'Minutes',
        },
        'markers': {
            'pl': 'Pokazuj znaczniki na wykresie',
            'en': 'Show markers on chart',
        },
        'area': {
            'pl': 'Zaznacz obszar na wykresie',
            'en': 'Fill area on chart',
        },
        'axis_options': {
            'pl': 'Opcje osi',
            'en': 'Axis options',
        },
        'y_axis_autoscale': {
            'pl': 'Automatyczne skalowanie osi Y',
            'en': 'Y axis autoscale',
        },
    }
</script>