export const widgets = {
    types: [
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
    ],
    chartTypes: [
        'line',
        'bar',
        'scatter'
    ],
    groupchartTypes: [
        'doughnut',
        'stacked'
    ],
    singleValueTypes: [
        'symbol',
        'date',
        'time',
        'stopwatch',
        'led'
    ],
    localTypes: [], // List of locally defined widget types
    communityTypes: [], // List of widgets types delivered by the community
    chartOptions: {
        line: ['dots:', 'plain:', 'area:', 'areaWithDots:'],
        bar: [],
        scatter: [],
        doughnut: [],
        stacked: []
    },
    typeFields: {
        default: ['title', 'type', 'role','config', 'app_id'],
        button: ['dev_id','commandType', 'commandText', 'commandJSON'],
        chart: ['dev_id','channel', 'query', 'format', 'chartType','channel_translated', 'reportSelector'],
        groupchart: ['group','channel','channel_translated','query','format','chartType','reportSelector'],
        date: ['dev_id','channel'],
        devinfo: ['dev_id',],
        image: ['imageUrl'],
        led: ['dev_id','channel', 'range', 'icon', 'project'],
        link: ['dashboardID'],
        map: ['dev_id','channel', 'query','rounding', 'reportSelector'],
        multimap: ['group','channel', 'range', 'query','rounding', 'reportSelector'],
        multitrack: ['group','channel','query','rounding','reportSelector'],
        plan: ['group','channel','range', 'query','channel_translated','reportSelector'],
        raw: [/*'dev_id','group','channel', */'query', 'reportSelector'],
        report: ['dev_id','group','channel','channel_translated','rounding','query', 'reportSelector'],
        text: [],
        stopwatch: ['dev_id','channel','project'],
        time: ['dev_id','channel','project'],
        symbol: ['dev_id','channel','range','unit', 'rounding', 'icon', 'project'],
    },
    chartFields: {
        line: ['timeUnit','cubicInterpolation'],
        stepped: ['timeUnit','cubicInterpolation'],
        bar: ['timeUnit']
    },
    fieldNames: {
        type: {en:'Type', pl:'Typ'},
        title: {en:'Title', pl:'Tytuł'},
        group: {en:'Group ID', pl:'ID grupy'},
        role: {en:'User role', pl:'Rola użytkownika'},
        channel: {en:'Measure names', pl:'Nazwy pomiarów'},
        query: {en:'query (DQL)', pl:'zapytanie (DQL)'},
        format: {en:'format', pl:'format'},
        chartOption: {en:'chart option (depends on the chart type)', pl:'opcja wykresu (zależy od typu wykresu)'},
        cubicInterpolation: {en:'cubic interpolation', pl:'interpolacja sześcienna'},
        image_url: {en:'image URL', pl:'adres URL obrazu'},
        app_id: {en:'application ID', pl:'ID aplikacji'},
        dev_id: {en:'device EUI', pl:'EUI urządzenia'},
        configuration: {en:'widget configuration', pl:'konfiguracja kontrolki'},
        command_type: {en:'command type', pl:'typ polecenia'},
        unit: {en:'unit', pl:'jednostka'},
        rounding: {en:'value rounding', pl:'zaokrąglenie wartości'},
        range: {en:'alert range definition', pl:'definicja zakresu alarmu'},
        icon: {en:'icon name', pl:'nazwa ikony'},
        channel_translated: {en:'translated channel name(s)', pl:'przetłumaczona nazwa kanału'},
        dashboardID: {en:'dashboard ID', pl:'ID pulpitu'}
    },
    fieldHints: {
        type: {en:'widget type', pl:'typ kontrolki'},
        title: {en:'widget title', pl:'tytuł kontrolki'},
        group: {en:'device group ID', pl:'ID grupy urządzeń'},
        role: {en:'user role required to see the widget (all users if empty)', pl:'rola użytkownika wymagana do wyświetlenia kontrolki (wszyscy użytkownicy jeśli puste)'},
        channel: {en:'channel(s) to display', pl:'kanał(y) do wyświetlenia'},
        query: {en:'query (DQL)', pl:'zapytanie (DQL)'},
        format: {en:'format', pl:'format'},
        chartOption: {en:'chart option (depends on the chart type)', pl:'opcja wykresu (zależy od typu wykresu)'},
        cubicInterpolation: {en:'cubic interpolation', pl:'interpolacja sześcienna'},
        image_url: {en:'image URL', pl:'adres URL obrazu'},
        app_id: {en:'application ID', pl:'ID aplikacji'},
        dev_id: {en:'device EUI', pl:'EUI urządzenia'},
        configuration: {en:'widget configuration', pl:'konfiguracja kontrolki'},
        command_type: {en:'command type', pl:'typ polecenia'},
        unit: {en:'unit', pl:'jednostka'},
        rounding: {en:'value rounding', pl:'zaokrąglenie wartości'},
        range: {en:'alert range definition', pl:'definicja zakresu alarmu'},
        icon: {en:'icon name', pl:'nazwa ikony'},
        channel_translated: {en:'translated channel name(s)', pl:'przetłumaczona nazwa kanału'},
        dashboardID: {en:'dashboard ID', pl:'ID pulpitu'}
    },
    isVisible: function (widgetTypeName, fieldName){
        try{
        if(this.typeFields.default.indexOf(fieldName) >= 0){
            return true;
        }else if (this.typeFields[widgetTypeName] && this.typeFields[widgetTypeName].indexOf(fieldName) >= 0){
            return true;
        } else {
            return false;
        }
        } catch (e){
            console.log('Error in isVisible', e)
            return false;
        }
    },
    getFieldName: function (fieldName, lang){
        try{
        if(this.fieldNames[fieldName]){
            return this.fieldNames[fieldName][lang];
        } else {
            return fieldName;
        }
        } catch (e){
            console.log('Error in getFieldName', e)
            return fieldName;
        }
    },
    getTypeNames: function (){
        return {
            'button': {
                en: 'Button',
                pl: 'Przycisk'
            },
            'chart': {
                en: 'Chart',
                pl: 'Wykres'
            },
            'groupchart': {
                en: 'Group chart',
                pl: 'Wykres grupowy'
            },
            'date': {
                en: 'Date',
                pl: 'Data'
            },
            'devinfo': {
                pl: 'Informacje o źródle danych',
                en: 'Data source info'
            },
            'image': {
                en: 'Image',
                pl: 'Obraz'
            },
            'led': {
                en: 'LED',
                pl: 'LED'
            },
            'link': {
                en: 'Link',
                pl: 'Odnośnik'
            },
            'map': {
                en: 'Map',
                pl: 'Mapa'
            },
            'multimap': {
                en: 'Group map',
                pl: 'Mapa grupowa'
            },
            'multitrack': {
                en: 'Group routes',
                pl: 'Trasy grupowe'
            },
            'plan': {
                en: 'Plan',
                pl: 'Plan'
            },
            'raw': {
                en: 'Raw data',
                pl: 'Surowe dane'
            },
            'report': {
                pl: 'Tabela z danymi',
                en: 'Data table'
            },
            'symbol': {
                pl: 'Karta wartości',
                en: 'Value card'
            },
            'stopwatch': {
                en: 'Stopwatch',
                pl: 'Stoper'
            },
            'time': {
                en: 'Time',
                pl: 'Czas'
            },
            'text': {
                en: 'Text',
                pl: 'Tekst'
            },
            'canvas_placeholder': {
                en: 'Canvas placeholder',
                pl: 'Miejsce na rysunek'
            },
            'chart_placeholder': {
                en: 'Chart placeholder',
                pl: 'Miejsce na wykres'
            }
        }
    },
    getConfiguration: function (widgetDefinition){
        let config = {}
        if(widgetDefinition.config){
            try{
                config = JSON.parse(widgetDefinition.config);
            } catch (e){
                console.log('Error in getConfiguration', e)
            }
        }
        return config;
    }
}

export const transformData = async function(config, rawData) {
    let isGroup = (config.group != undefined && config.group != null && config.group != '')
    let jsonData = await rawData;
    console.log('RAW DATA', jsonData)
    
    // data from report server is already in the correct format
    if (jsonData.datasets !== undefined && jsonData.datasets !== null) {
        return jsonData
    } else {
        //console.log('DATA FROM SIGNOMIX-TA-PROVIDER')
    }

    // data from signomix-ta-provider must be transformed
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
    return reportResult
}

export default widgets;