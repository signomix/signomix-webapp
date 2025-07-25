export const widgets = {
    types: [
        'button',
        'buttonplus',
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
        'textvalue',
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
        'textvalue',
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
        default: ['title', 'type', 'role', 'config', 'app_id'],
        button: ['dev_id', 'commandType', 'commandText', 'commandJSON'],
        buttonplus: ['dev_id', 'commandType', 'commandText', 'commandJSON'],
        chart: ['dev_id', 'channel', 'query', 'format', 'chartType', 'channel_translated', 'reportSelector'],
        groupchart: ['group', 'channel', 'channel_translated', 'query', 'format', 'chartType', 'reportSelector'],
        date: ['dev_id', 'channel'],
        devinfo: ['dev_id',],
        image: ['imageUrl'],
        led: ['dev_id', 'channel', 'range', 'icon', 'project'],
        link: ['dashboardID'],
        map: ['dev_id', 'channel', 'query', 'rounding', 'reportSelector'],
        multimap: ['group', 'channel', 'range', 'query', 'rounding', 'reportSelector'],
        multitrack: ['group', 'channel', 'query', 'rounding', 'reportSelector'],
        plan: ['group', 'channel', 'range', 'query', 'channel_translated', 'reportSelector'],
        raw: [/*'dev_id','group','channel', */'query', 'reportSelector'],
        report: ['dev_id', 'group', 'channel', 'channel_translated', 'rounding', 'query', 'reportSelector'],
        text: [],
        stopwatch: ['dev_id', 'channel', 'project'],
        time: ['dev_id', 'channel', 'project'],
        symbol: ['dev_id', 'reportSelector', 'query', 'channel', 'range', 'unit', 'rounding', 'icon', 'project'],
        textvalue: ['dev_id', 'channel', 'project'],
    },
    chartFields: {
        line: ['timeUnit', 'cubicInterpolation'],
        stepped: ['timeUnit', 'cubicInterpolation'],
        bar: ['timeUnit']
    },
    fieldNames: {
        type: { en: 'Type', pl: 'Typ' },
        title: { en: 'Title', pl: 'Tytuł' },
        group: { en: 'Group ID', pl: 'ID grupy' },
        role: { en: 'User role', pl: 'Rola użytkownika' },
        channel: { en: 'Measure names', pl: 'Nazwy pomiarów' },
        query: { en: 'query (DQL)', pl: 'zapytanie (DQL)' },
        format: { en: 'format', pl: 'format' },
        chartOption: { en: 'chart option (depends on the chart type)', pl: 'opcja wykresu (zależy od typu wykresu)' },
        cubicInterpolation: { en: 'cubic interpolation', pl: 'interpolacja sześcienna' },
        image_url: { en: 'image URL', pl: 'adres URL obrazu' },
        app_id: { en: 'application ID', pl: 'ID aplikacji' },
        dev_id: { en: 'device EUI', pl: 'EUI urządzenia' },
        configuration: { en: 'widget configuration', pl: 'konfiguracja kontrolki' },
        command_type: { en: 'command type', pl: 'typ polecenia' },
        unit: { en: 'unit', pl: 'jednostka' },
        rounding: { en: 'value rounding', pl: 'zaokrąglenie wartości' },
        range: { en: 'alert range definition', pl: 'definicja zakresu alarmu' },
        icon: { en: 'icon name', pl: 'nazwa ikony' },
        channel_translated: { en: 'translated channel name(s)', pl: 'przetłumaczona nazwa kanału' },
        dashboardID: { en: 'dashboard ID', pl: 'ID pulpitu' }
    },
    fieldHints: {
        type: { en: 'widget type', pl: 'typ kontrolki' },
        title: { en: 'widget title', pl: 'tytuł kontrolki' },
        group: { en: 'device group ID', pl: 'ID grupy urządzeń' },
        role: { en: 'user role required to see the widget (all users if empty)', pl: 'rola użytkownika wymagana do wyświetlenia kontrolki (wszyscy użytkownicy jeśli puste)' },
        channel: { en: 'channel(s) to display', pl: 'kanał(y) do wyświetlenia' },
        query: { en: 'query (DQL)', pl: 'zapytanie (DQL)' },
        format: { en: 'format', pl: 'format' },
        chartOption: { en: 'chart option (depends on the chart type)', pl: 'opcja wykresu (zależy od typu wykresu)' },
        cubicInterpolation: { en: 'cubic interpolation', pl: 'interpolacja sześcienna' },
        image_url: { en: 'image URL', pl: 'adres URL obrazu' },
        app_id: { en: 'application ID', pl: 'ID aplikacji' },
        dev_id: { en: 'device EUI', pl: 'EUI urządzenia' },
        configuration: { en: 'widget configuration', pl: 'konfiguracja kontrolki' },
        command_type: { en: 'command type', pl: 'typ polecenia' },
        unit: { en: 'unit', pl: 'jednostka' },
        rounding: { en: 'value rounding', pl: 'zaokrąglenie wartości' },
        range: { en: 'alert range definition', pl: 'definicja zakresu alarmu' },
        icon: { en: 'icon name', pl: 'nazwa ikony' },
        channel_translated: { en: 'translated channel name(s)', pl: 'przetłumaczona nazwa kanału' },
        dashboardID: { en: 'dashboard ID', pl: 'ID pulpitu' }
    },
    isVisible: function (widgetTypeName, fieldName) {
        try {
            if (this.typeFields.default.indexOf(fieldName) >= 0) {
                return true;
            } else if (this.typeFields[widgetTypeName] && this.typeFields[widgetTypeName].indexOf(fieldName) >= 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('Error in isVisible', e)
            return false;
        }
    },
    getFieldName: function (fieldName, lang) {
        try {
            if (this.fieldNames[fieldName]) {
                return this.fieldNames[fieldName][lang];
            } else {
                return fieldName;
            }
        } catch (e) {
            console.log('Error in getFieldName', e)
            return fieldName;
        }
    },
    getTypeNames: function () {
        return {
            'button': {
                en: 'Button',
                pl: 'Przycisk'
            },
            'buttonplus': {
                en: 'Button Plus',
                pl: 'Przycisk Plus'
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
            'textvalue': {
                en: 'Text value',
                pl: 'Wartość tekstowa'
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
    getConfiguration: function (widgetDefinition) {
        let config = {}
        if (widgetDefinition.config) {
            try {
                config = JSON.parse(widgetDefinition.config);
            } catch (e) {
                console.log('Error in getConfiguration', e)
            }
        }
        return config;
    },
    isConfigDefined: function (widgetDefinition) {
        return widgetDefinition.config != undefined && widgetDefinition.config != null && widgetDefinition.config != '';
    },
    getDefaultIconName: function (definition, query) {
        //console.log('getDefaultIconName', definition)
        let iconName = 'bi-clipboard2-pulse';
        let channel = '';
        if (definition == undefined || definition == null) {
            return iconName;
        }
        if (definition.channel != undefined && definition.channel != null && definition.channel != '') {
            channel = definition.channel.toLowerCase();
        } else {
            if (query != undefined && query != null && query != '' && query.channel != undefined && query.channel != null && query.channel != '') {
                channel = query.channel.toLowerCase();
            } else {
                return iconName;
            }
        }
        let nameMap = {
            'temperature': 'bi-thermometer-half',
            'humidity': 'bi-droplet-half',
            'moisture': 'bi-droplet-half',
            'pressure': 'bi-speedometer',
            'wind': 'bi-wind',
            'rain': 'bi-cloud-hail',
            'pollution': 'bi-cloud-haze2',
            'pm10': 'bi-cloud-haze2',
            'pm25': 'bi-cloud-haze2',
            'luminance': 'bi-sun',
            'light': 'bi-sun',
            'lux': 'bi-sun',
            'brightness': 'bi-sun',
            'latitude': 'bi-geo-fill',
            'longitude': 'bi-geo-fill',
            'altitude': 'bi-geo-alt-fill',
            'battery': 'bi-battery-half',
            'voltage': 'bi-battery-half',
            'power': 'bi-battery-half',
            'current': 'bi-lightning-charge',
            'amperage': 'bi-lightning-charge',
            'energy': 'bi-lightning',
            'speed': 'bi-speedometer-2',
            'velocity': 'bi-speedometer-2',
            'status': 'bi-heart-pulse'
        };
        for (let key in nameMap) {
            if (channel.indexOf(key) >= 0) {
                iconName = nameMap[key];
                break;
            }
        }
        return iconName;
    },
    getIconName: function (definition, value, timestamp, query) {
        // Returns icon name based on the definition and value
        //
        // @param {Object} definition - widget definition
        // @param {Number} value - value to check against the definition
        // @param {Number} timestamp - timestamp of the value update
        // @param {Object} query - query object containing channel information
        // @returns {String} icon name
        //
        // The icon set used to select the icon is taken from the following sources:
        // 1. widget definition icon field
        // 2. widget configuration icon field
        // 3. default icon based on the channel name
        {
            let emptyConfig = true;
            let level = this.getAlertLevel(definition.range, value, timestamp);
            //let icons = ['bi-emoji-smile-fill', 'bi-emoji-neutral-fill', 'bi-emoji-frown-fill', 'bi-emoji-expressionless-fill']
            let icons = ['', '', '', '', '']

            // Ad 3. default icon is selected based on the channel name
            let defaultIcon = this.getDefaultIconName(definition, query)
            for (let i = 0; i < icons.length; i++) {
                icons[i] = defaultIcon
            }
            // Ad 2. icons can be defined in the widget definition configuration
            let config = this.getConfiguration(definition)
            //console.log('CONFIG', config)
            if (config.icon != undefined && config.icon != null && Array.isArray(config.icon)) {
                for (let i = 0; i < config.icon.length; i++) {
                    icons[i] = config.icon[i]
                }
                // fill the rest of the icons with the first icon
                for (let i = config.icon.length; i < icons.length; i++) {
                    icons[i] = icons[0]
                }
                emptyConfig = false;
            }
            // Ad. 1 in the widget definition icon field
            if (emptyConfig && definition.icon != undefined && definition.icon != null && definition.icon != '') {
                let optIcons = definition.icon.split(this.getSeparatorChar(definition.icon))
                for (let i = 0; i < optIcons.length; i++) {
                    icons[i] = optIcons[i]
                }
                for (let i = optIcons.length; i < icons.length; i++) {
                    icons[i] = icons[0]
                }
            }
            if (level >= 0 && level < icons.length) {
                return icons[level]
            } else {
                return icons[4]
            }
        }
    },
    getAlertRule: function (definition) {
        let rule = {
            varName: null,
            comparator1: 0,
            value1: NaN,
            comparator2: 0,
            value2: NaN
        }
        if (definition.length == 0) {
            return rule;
        }
        let chr;
        let element = "";
        let elementNumber = 0;
        for (let i = 0; i < definition.length; i++) {
            chr = definition.charAt(i);
            if (chr == ">" || chr == "<" || chr == "=") {
                if (element != "" && rule.varName == null) {
                    rule.varName = element;
                    element = "";
                } else if (element == "" && rule.varName == null) {
                    rule.varName = "x";
                } else if (element != "" && Number.isNaN(rule.value1)) {
                    rule.value1 = Number(element);
                    element = "";
                } else if (element != "" && Number.isNaN(rule.value2)) {
                    rule.value2 = Number(element);
                    element = "";
                }
                if (rule.comparator1 == 0) {
                    switch (chr) {
                        case ">":
                            rule.comparator1 = 1;
                            break;
                        case "<":
                            rule.comparator1 = 2;
                            break;
                        case "=":
                            rule.comparator1 = 3;
                            break;
                        default:
                            rule.comparator1 = 4; // error
                            break;
                    }
                } else {
                    switch (chr) {
                        case ">":
                            rule.comparator2 = 1;
                            break;
                        case "<":
                            rule.comparator2 = 2;
                            break;
                        case "=":
                            rule.comparator2 = 3;
                            break;
                        default:
                            rule.comparator2 = 4; // error
                            break;
                    }
                }
            } else {
                element = element + chr;
            }
        }
        if (element.length > 0) {
            if (Number.isNaN(rule.value1)) {
                rule.value1 = Number(element);
            } else if (Number.isNaN(rule.value2)) {
                rule.value2 = Number(element);
            }
        }
        return rule;
    },
    isNotResponding: function (rule, tstamp) {
        if (tstamp == undefined || tstamp == null || tstamp == 0) {
            return true;
        }
        let currentTime = Date.now()
        return (Date.now() - tstamp) > rule.value1
    },
    isRuleMet: function (rule, value) {
        if (!isNaN(rule.value1)) {
            if (rule.comparator1 == 1 && value < rule.value1) {
                return true;
            }
            if (rule.comparator1 == 2 && value > rule.value1) {
                return true;
            }
            if (rule.comparator1 == 3 && value == rule.value1) {
                return true;
            }
        }
        // OR
        if (!isNaN(rule.value2)) {
            if (rule.comparator2 == 1 && value < rule.value2) {
                return true;
            }
            if (rule.comparator2 == 2 && value > rule.value2) {
                return true;
            }
            if (rule.comparator2 == 3 && value == rule.value2) {
                return true;
            }
        }
        return false;
    },
    getNotRespondingRule: function (definition) {
        let rule = {
            varName: null,
            comparator1: 0,
            value1: NaN,
            comparator2: 0,
            value2: NaN
        }
        let defStr = definition.trim()
        let timeUnit = defStr.charAt(definition.length - 1)
        let multiplier = 1
        if (timeUnit === 'm') {
            multiplier = 60
        } else if (timeUnit === 's') {
            multiplier = 1
        } else {
            return rule
        }
        try {
            // value1 holds delay in milliseconds
            rule.value1 = 1000 * multiplier * defStr.substring(0, defStr.length - 2)
        } catch (err) { }
        return rule
    },
    getAlertLevel: function (definition, value, tstamp) {
        // Calculates alert level
        // 
        // @param {String} definition 
        // @param {Number} v is value to check against definition
        // @param {Number} timestamp of the value update 
        // @returns {Number} 3==notResponding, 2==alert, 1==warning, otherwise 0 or -1 when definition not provided
        //
        // definition "{alertCondition}[:{warningConditon}][@variableName][#maxDelay]
        // condition: [variableName]{comparator}{value}[[variableName]{comparator}{value}]
        // variableName is optional, one character, default is 'x'
        // comparator is one of: '>','<','='
        // 
        // example 1: "x<-10>40:x<0>30"
        // example 2: "<-10>40:<0>30"
        // example 3: "<-10>40:<0>30@temperature"
        // example 3: "<-10>40:<0>30@humidity#30s"
        // example 4: "x<-10>40:x<0>30:#120m"
        // example 5: "x=2:x=1"
        //console.log('getAlertLevel, definition', definition)
        if (definition == '' || definition == undefined) {
            return -1
        }
        //remove whitespaces and measure name
        let delay = 0;
        // Usuń wszystkie spacje i znaki niedrukowalne
        let def = definition.replace(/\s+/g, '');
        if (def.indexOf("#") > 0) {
            delay = parseInt(def.substring(definition.indexOf("#") + 1))
            if (isNaN(delay)) { delay = 0 }
        }
        if (def.indexOf("@") > 0) {
            def = def.substring(0, definition.indexOf("@"))
        }
        if (def.length == 0) return 0;

        if (delay > 0) {
            if (tstamp + delay < Date.now()) {
                return 3;
            }
        }

        let defs = def.split(":");
        let alertDef = defs[0];
        let warningDef = "";
        let notRespondingDef = "";
        if (defs.length > 1) {
            warningDef = defs[1];
        }
        if (defs.length > 2) {
            notRespondingDef = defs[2];
        }
        let notRespondingRule = this.getNotRespondingRule(notRespondingDef);
        if (this.isNotResponding(notRespondingRule, tstamp)) {
            return 3;
        }
        if (this.checkRule(value, alertDef) == -1 && this.checkRule(value, warningDef) == -1) {
            return 3;
        }
        if (this.checkRule(value, alertDef) == 1) {
            return 2;
        }
        if (this.checkRule(value, warningDef) == 1) {
            return 1;
        }
        return 0;
    },
    checkRule: function (value, rule) {
        // Usuń pierwszą literę, jeśli reguła zaczyna się od litery
        if (/^[a-zA-Z]/.test(rule)) {
            rule = rule.substring(1);
        }

        const match = rule.match(/^([<>=!]=?|==)\s*(-?\d+(\.\d+)?)$/);
        if (!match) return -1;
        const operator = match[1];
        const number = parseFloat(match[2]);
        let result = false;
        switch (operator) {
            case '<': result = value < number; break;
            case '<=': result = value <= number; break;
            case '>': result = value > number; break;
            case '>=': result = value >= number; break;
            case '=':
            case '==': result = value == number; break;
            case '!=': result = value != number; break;
            default: return -1;
        }
        return result ? 1 : 0;
    },
    getSeparatorChar: function (definition) {
        // Returns separator character used in the definition
        // If no separator is found, returns ','
        if (definition == undefined || definition == null || definition == '') {
            return ',';
        }
        if (definition.indexOf(';') >= 0) {
            return ';';
        } else {
            return ',';
        }
    }
}

export const transformData = async function (config, rawData) {
    let isGroup = (config.group != undefined && config.group != null && config.group != '')
    let jsonData = await rawData;
    //console.log('RAW DATA', jsonData)

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
    if (jsonData.length == 0) {
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