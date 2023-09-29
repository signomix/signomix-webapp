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
        'donut',
        'stacked'
    ],
    localTypes: [], // List of locally defined widget types
    communityTypes: [], // List of widgets types delivered by the community
    chartOptions: {
        line: ['dots:', 'plain:', 'area:', 'areaWithDots:'],
        bar: [],
        scatter: [],
        donut: [],
        stacked: []
    },
    typeFields: {
        default: ['title', 'type', 'role','config', 'app_id'],
        button: ['dev_id','channel', 'commandType'],
        chart: ['dev_id','channel', 'query', 'format', 'chartType','channel_translated'],
        groupchart: ['group','channel','channel_translated','query','format','chartType'],
        date: ['dev_id','channel', 'query'],
        devinfo: ['dev_id',],
        image: ['imageUrl'],
        led: ['dev_id','channel', 'range'],
        link: ['dashboardID'],
        map: ['dev_id','channel', 'query'],
        multimap: ['group','channel'],
        multitrack: ['group','channel','query'],
        plan: ['group','channel','range'],
        raw: ['dev_id','group','channel', 'query'],
        report: ['group','channel','channel_translated'],
        text: [],
        stopwatch: ['dev_id','channel', 'query'],
        time: ['dev_id','channel', 'query'],
        symbol: ['dev_id','channel','channel_translated','range','unit', 'rounding', 'icon'],
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
        if(this.typeFields.default.indexOf(fieldName) >= 0){
            return true;
        }else if (this.typeFields[widgetTypeName] && this.typeFields[widgetTypeName].indexOf(fieldName) >= 0){
            return true;
        } else {
            return false;
        }
    },
    getFieldName: function (fieldName, lang){
        if(this.fieldNames[fieldName]){
            return this.fieldNames[fieldName][lang];
        } else {
            return fieldName;
        }
    }
}

export default widgets;