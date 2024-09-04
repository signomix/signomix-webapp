<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    //import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

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
            if (config.channel_translated != undefined && config.channel_translated != null && config.channel_translated != '') {
                channelNamesTranslated = config.channel_translated.split(',')
            }
        }
    });

    let front = true;

    function switchView() {
        front = !front;
    }

    function isGroup() {
        if (config.group != undefined && config.group != null && config.group != '') {
            return true
        } else {
            return false
        }
    }

    function isGroupQuery(reportResult) {
        if (reportResult.queries != undefined
            && reportResult.queries.default != undefined
            && reportResult.queries.default.group != undefined
            && reportResult.queries.default.group != null
            && reportResult.queries.default.group != '') {
            return true
        } else {
            return false
        }
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

    async function transformData(config, rawData) {
        let isGroup = (config.group != undefined && config.group != null && config.group != '')
        let jsonData = await rawData;
        if (jsonData.datasets !== undefined && jsonData.datasets !== null) {
            console.log('DATA FROM REPORT SERVER')
            console.log('GROUP REPORT', isGroupQuery(jsonData))
            return jsonData
        }
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
            }
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
        console.log('REPORT RESULT', reportResult)
        return reportResult
    }

    let labels = {
        'date': {
            'pl': "data",
            'en': "date"
        }
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
            {getDate(reportresult)} {config.group}
            {:else}
            {getDate(reportresult)} {config.dev_id}
            {/if}
            {/if}
            {:else}
            <div style="height: {parentHeight-32}px; overflow-y: scroll;">
                {#if reportresult!=undefined && reportresult.status==200 }
                {#if isGroup()}
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary fs-6">
                        <th scope="col">EUI</th>
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
                            <td>{dataset.eui}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                            {#each row.values as value}
                            <td>{utils.recalculate(value, config.rounding)}</td>
                            {/each}
                        </tr>
                        {/each}
                        {/each}
                    </tbody>
                </table>
                {:else}
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
                <p><b>Error {reportresult.status}</b> {reportresult.errorMessage}</p>
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