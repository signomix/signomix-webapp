<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    //import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';
    import { widgets } from '$lib/widgets.js';

    export let config
    export let filter

    let errorMessage = '';
    let apiUrl
    let parentHeight = 0;
    let channelNamesTranslated = []

    //console.log('ReportWidget config', config)
    let promise
    if (config.query != undefined && config.query != null && (config.query.toLowerCase().includes('class') || config.query.toLowerCase().includes('report'))) {
        apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
        promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData);
    } else {
        if (isGroup()) {
            apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
            promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transformData);
        } else {
            apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
            promise = sgxdata.getData(dev, apiUrl, config, filter, $token, transformData);
        }
    }
    if (config.channel_translated != undefined && config.channel_translated != null && config.channel_translated != '') {
        channelNamesTranslated = config.channel_translated.split(',')
    }

    afterUpdate(() => {
        if (config.query != undefined && config.query != null && (config.query.toLowerCase().includes('class') || config.query.toLowerCase().includes('report'))) {
            apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
            promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData);
        } else {
            if (isGroup()) {
                apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
                promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transformData);
            } else {
                apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
                promise = sgxdata.getData(dev, apiUrl, config, filter, $token, transformData);
            }
        }
    });

    let front = true;

    function switchView() {
        //front = !front;
    }

    function isGroup() {
        if (config.group != undefined && config.group != null && config.group != '') {
            return true
        } else {
            return false
        }
    }

    function isGroupQuery(reportResult) {
        try {
            console.log('isGroupQuery', reportResult.queries.default.source)
            if (reportResult.queries.default.source.includes(' group ')) {
                return true
            }
            if (reportResult.queries != undefined
                && reportResult.queries.default != undefined
                && reportResult.queries.default.group != undefined
                && reportResult.queries.default.group != null
                && reportResult.queries.default.group != '') {
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log('isGroupQuery error', e)
        }
    }

    function getReportType(reportResult) {
        let type = '';
        try {
            if (reportResult.queries.default.source.includes(' group ')) {
                type = 'group'
            } else if (reportResult.queries.default.source.includes(' eui ')) {
                type = 'device'
            }
        } catch (e) {
            console.log('error', e)
        }
        return type
    }

    function getDate(reportResult) {
        let date = '';
        try {
            if (config.group != undefined && config.group != null && config.group != '') {
                date = new Date(reportResult.datasets[0].data[0].timestamp).toLocaleString()
            } else {
                date = new Date(reportResult.datasets[0].data[0].timestamp).toLocaleString()
            }
        } catch (e) {
            console.log('error', e)
        }
        return date
    }

    function getDeviceName(reportResult, eui){
        let name = eui
        try {
            if (reportResult.configs != undefined && reportResult.configs[eui] != undefined && reportResult.configs[eui].name != undefined && reportResult.configs[eui].name != null && reportResult.configs[eui].name != '') {
                name = reportResult.configs[eui].name
            }
        } catch (e) {
            console.log('error', e)
        }
        return name
    }

    async function transformData(config, rawData) {
        let isGroup = (config.group != undefined && config.group != null && config.group != '')
        let jsonData = await rawData;
        console.log('RAW DATA', jsonData)
        //let isGroupQuery = isGroupQuery(jsonData)

        // data from report server is already in the correct format
        if (jsonData.datasets !== undefined && jsonData.datasets !== null) {
            console.log('DATA FROM REPORT SERVER')
            //console.log('GROUP REPORT', isGroupQuery)
            return jsonData
        } else {
            console.log('DATA FROM SIGNOMIX-TA-PROVIDER')
        }

        // data from signomix-ta-provider must be transformed
        console.log('STANDARD DATA')
        console.log('GROUP REPORT', isGroup)
        let reportResult = {
            'status': 200,
            'title': '',
            'description': '',
            'content': '',
            'contentType': 'application/json',
            'id': -1,
            'created': '',
            'datasets': [],
            'headers': [],
            'queries': {
                'default': {
                    'group': '',
                    'className': ''
                }
            },
            configs: {}
        }
        if(jsonData.length==0){
            reportResult.errorMessage = 'No data available'
            return reportResult
        }
        if (!isGroup) {
            reportResult.datasets.push({
                'size': jsonData[0].length,
                'name': 'dataset0',
                'eui': jsonData[0][0].deviceEUI,
                'data': []
            })
            reportResult.headers.push({
                'columns': [],
                'name': 'dataset0'
            })
            try {
                for (let i = 0; i < jsonData[0].length; i++) {
                    reportResult.headers[0].columns.push(jsonData[0][i].name)
                }
            } catch (e) {
                console.log('error', e)
            }
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets[0].data.push({
                    'timestamp': jsonData[i][0].timestamp,
                    'values': []
                })
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[0].data[i].values.push(jsonData[i][j].value)
                }
            }
        } else {
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets.push({
                    'size': jsonData[i][0].length,
                    'name': 'dataset' + i,
                    'eui': jsonData[i][0][0].deviceEUI,
                    'data': []
                })
                reportResult.headers.push({
                    'columns': [],
                    'name': 'dataset' + i
                })
                for (let j = 0; j < jsonData[i][0].length; j++) {
                    reportResult.headers[i].columns.push(jsonData[i][0][j].name)
                }
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[i].data.push({
                        'timestamp': jsonData[i][j][0].timestamp,
                        'values': []
                    })
                    for (let k = 0; k < jsonData[i][j].length; k++) {
                        reportResult.datasets[i].data[j].values.push(jsonData[i][j][k].value)
                    }
                }
            }
        }
        //console.log('REPORT RESULT', reportResult)
        return reportResult
    }

    function isEuiVisible() {
        let cfg=widgets.getConfiguration(config)
        if (cfg.showEui != undefined && cfg.showEui != null && cfg.showEui == false) {
            return false
        } else {
            return true
        }
    }
    function isDateVisible() {
        let cfg=widgets.getConfiguration(config)
        if (cfg.showDate != undefined && cfg.showDate != null && cfg.showDate == false) {
            return false
        } else {
            return true
        }
    }

    function isColumnsVisible() {
        let cfg=widgets.getConfiguration(config)
        if (cfg.showColumns != undefined && cfg.showColumns != null && cfg.showColumns == false) {
            return false
        } else {
            return true
        }
    }

    let labels = {
        'date': {
            'pl': "data",
            'en': "date"
        },
        'eui': {
            'pl': "ID",
            'en': "ID"
        },
    }

</script>

<div class="p-1 w-100" on:click={switchView} bind:clientHeight={parentHeight}>
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-left">
        <div class="col-12 mt-1">
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then reportresult}
            {#if !front}
            {#if reportresult!=undefined && reportresult.status==200 }
            {#if isGroup()}
            {#if getReportType(reportresult)=='group'}
            //{getDate(reportresult)}
            {:else}
            {getDate(reportresult)} {config.group}
            {/if}
            {:else}
            {getDate(reportresult)} {config.dev_id}
            {/if}
            {/if}
            {:else}
            
            <div style="height: {parentHeight-32}px; overflow-y: scroll;">
                {#if reportresult!=undefined && reportresult.status==200 && (reportresult.errorMessage==undefined || reportresult.errorMessage==null || reportresult.errorMessage=='')}
                {#if isGroup() || isGroupQuery(reportresult)}
                {#if getReportType(reportresult)=='group'}
                <!-- DqlReport GROUP -->
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary fs-6">
                        {#if isEuiVisible()}
                        <th scope="col">{utils.getLabel('eui', labels, $language)}</th>
                        {/if}
                        {#if isDateVisible()}
                        <th scope="col">{utils.getLabel('date', labels, $language)}</th>
                        {/if}
                        {#if isColumnsVisible()}
                        {#if channelNamesTranslated.length>0}
                        {#each channelNamesTranslated as item}
                        <th scope="col">{item}</th>
                        {/each}
                        {:else}
                        {#each reportresult.headers[0].columns as column}
                        <th scope="col">{column}</th>
                        {/each}
                        {/if}
                        {/if}
                    </thead>

                    <tbody>
                        {#each reportresult.datasets as dataset}
                        <tr>
                            {#if isEuiVisible()}
                            <td><a href='/dashboards/{dataset.eui}'>{getDeviceName(reportresult,dataset.eui)}</a></td>
                            {/if}
                            {#if isDateVisible()}
                            <td>{new Date(dataset.data[0].timestamp).toLocaleString()}</td>
                            {/if}
                            {#if isColumnsVisible()}
                            {#each dataset.data[0].values as value,i}
                            {#if reportresult.headers[0].columns[i]=='name'}
                            <td><a href='/dashboards/{dataset.eui}'>{value}</a></td>
                            {:else}
                            <td>{utils.recalculate(value, config.rounding)}</td>
                            {/if}
                            {/each}
                            {/if}
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {:else}
                <!-- Report GROUP -->
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary fs-6">
                        <th scope="col">{utils.getLabel('name', labels, $language)}</th>
                        <th scope="col">{utils.getLabel('date', labels, $language)}</th>
                        {#if channelNamesTranslated.length>0}
                        {#each channelNamesTranslated as item}
                        <th scope="col">{item}</th>
                        {/each}
                        {:else}
                        {#each reportresult.headers[0].columns as column}
                        <th scope="col">{column}</th>
                        {/each}
                        {/if}
                    </thead>
                    <tbody>
                        {#each reportresult.datasets as dataset}
                        {#each dataset.data as row}
                        <tr>
                            <td><a href='/dashboards/{dataset.eui}'>{getDeviceName(reportresult,dataset.eui)}</a></td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            {#each row.values as value}
                            <td>{utils.recalculate(value, config.rounding)}</td>
                            {/each}
                        </tr>
                        {/each}
                        {/each}
                    </tbody>
                </table>
                {/if}
                {:else}
                <!-- Report DEVICE -->
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary">
                        <th scope="col">{utils.getLabel('date', labels, $language)}</th>
                        {#if channelNamesTranslated.length>0}
                        {#each channelNamesTranslated as channel}
                        <th scope="col">{channel}</th>
                        {/each}
                        {:else}
                        {#each reportresult.headers[0].columns as column}
                        <th scope="col">{column}</th>
                        {/each}
                        {/if}
                    </thead>
                    <tbody>
                        {#each reportresult.datasets[0].data as row}
                        <tr>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            {#each row.values as value}
                            <td>{utils.recalculate(value, config.rounding)}</td>
                            {/each}
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {/if}
                {:else}
                <p><b>Status {reportresult.status}</b> {reportresult.errorMessage}</p>
                {/if}
            </div>
            {/if}
            {:catch error}
            {#if !front}
            <p style="color: red">{error.message}</p>
            {/if}
            {/await}
        </div>
    </div>
</div>