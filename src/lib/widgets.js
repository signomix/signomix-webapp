export const widgets = {
    types: [
        'button',
        'chart',
        'date',
        'devinfo',
        'image',
        'led',
        'map',
        'multimap',
        'multitrack',
        'plan',
        'raw',
        'report',
        'sticker',
        'stopwatch',
        'time',
        'text',
        'canvas_placeholder',
        'chart_placeholder'
    ],
    localTypes: [], // List of locally defined widget types
    communityTypes: [], // List of widgets types delivered by the community
    chartOptions: {
        line: {
            dots: 'show dots',
            plain: 'line only',
            area: 'area below',
            areaWithDots: 'area with dots'
        },
        stepped: {
            dots: 'show dots',
            plain: 'line only',
            area: 'area below',
            areaWithDots: 'area with dots'
        },
        bar: {
        }
    },
    typeFields: {
        default: ['title', 'type', 'role','configuration', 'app_id', 'dev_id'],
        button: ['eui','channel', 'data_type', 'command_type'],
        chart: ['eui','channel', 'query', 'format', 'chartType'],
        date: ['eui','channel', 'query'],
        devinfo: ['eui',],
        image: ['image_url'],
        led: ['eui','channel', 'rule'],
        map: ['eui','channel', 'query'],
        multimap: ['group','channel'],
        multitrack: ['group','channel'],
        plan: ['group','channel','rule'],
        raw: ['eui','channel', 'query'],
        report: ['group','channel','channel_translated'],
        text: [],
        stopwatch: ['eui','channel', 'query'],
        time: ['eui','channel', 'query'],
        sticker: ['eui','channel','channel_translated','rule','unit', 'rounding', 'icon'],
    },
    chartFields: {
        line: ['cubicInterpolation'],
        stepped: ['cubicInterpolation'],
        bar: []
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
        data_type: {en:'data type', pl:'typ danych'},
        command_type: {en:'command type', pl:'typ polecenia'},
        unit: {en:'unit', pl:'jednostka'},
        rounding: {en:'value rounding', pl:'zaokrąglenie wartości'},
        range: {en:'alert range definition', pl:'definicja zakresu alarmu'},
        icon: {en:'icon name', pl:'nazwa ikony'},
        channel_translated: {en:'translated channel name(s)', pl:'przetłumaczona nazwa kanału'}
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
        data_type: {en:'data type', pl:'typ danych'},
        command_type: {en:'command type', pl:'typ polecenia'},
        unit: {en:'unit', pl:'jednostka'},
        rounding: {en:'value rounding', pl:'zaokrąglenie wartości'},
        range: {en:'alert range definition', pl:'definicja zakresu alarmu'},
        icon: {en:'icon name', pl:'nazwa ikony'},
        channel_translated: {en:'translated channel name(s)', pl:'przetłumaczona nazwa kanału'}
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