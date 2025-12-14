// Copyright (C) Grzegorz Skorupa 2018.
// Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).

export const sgxhelper = {
    getAlertLevel: function (definition, value, tstamp) {
        // Calculates alert level
        // 
        // @param {String} definition 
        // @param {Number} v is value to check against definition
        // @param {Number} maximum time interval from the last measurement 
        // @returns {Number} 3==notResponding, 2==alert, 1==warning, otherwise 0 or -1 when definition not provided
        //
        // definition "{alertCondition}[:{warningConditon}][@variableName][#maxDelay]
        // condition: [variableName]{comparator}{value}[[variableName]{comparator}{value}]
        // comparator is one of: > <
        // 
        // example 1: "x<-10>40:x<0>30"
        // example 2: "<-10>40:<0>30"
        // example 3: "<-10>40:<0>30@measureName"
        // example 3: "<-10>40:<0>30@measureName#maxDelay"
        // example 4: "x<-10>40:x<0>30:2m"
        if (definition == '' || definition == undefined) {
            return -1
        }
        //remove whitespaces and measure name
        let delay = 0;
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
        let alertRule = this.getAlertRule(alertDef);
        let warningRule = this.getAlertRule(warningDef);
        let notRespondingRule = this.getNotRespondingRule(notRespondingDef);
        if (this.isNotResponding(notRespondingRule, tstamp)) {
            return 3;
        }
        if (this.isRuleMet(alertRule, value)) {
            return 2;
        }
        if (this.isRuleMet(warningRule, value)) {
            return 1;
        }
        return 0;
    },
    getMarkerColor: function(point, calcAlert, rangeName, range) {
        let result = 'green'
        if (!calcAlert) {
            return result
        }
        for (var i = 0; i < point.length; i++) {
            if(point[i]==undefined || point[i]==null) {
                continue
            }
            if (point[i].name == rangeName) {
                switch (this.getAlertLevel(range, point[i].value, point[i]['timestamp'])) {
                    case 1:
                        result = 'yellow'
                        break
                    case 2:
                        result = 'red'
                        break
                    case 3:
                        result = 'grey'
                        break
                }
            }
        }
        return result
    },
    isNotResponding: function (rule, tstamp) {
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
        }
        // OR
        if (!isNaN(rule.value2)) {
            if (rule.comparator2 == 1 && value < rule.value2) {
                return true;
            }
            if (rule.comparator2 == 2 && value > rule.value2) {
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
            if (chr == ">" || chr == "<") {
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
                    rule.comparator1 = chr == "<" ? 1 : 2;
                } else {
                    rule.comparator2 = chr == "<" ? 1 : 2;
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
    getMeasureType: function (name) {
        if (name.indexOf('temperatur') > -1) {
            return 1;
        }
        if (name.indexOf('humidity') > -1 || name.indexOf('moisture') > -1) {
            return 2;
        }
        if (name.indexOf('pressure') > -1) {
            return 3;
        }
        if (name.indexOf('times') > -1 || name.indexOf('count') > -1) {
            return 12;
        }
        if (name.indexOf('duration') > -1) {
            return 13;
        }
        if (name.indexOf('date') > -1 || name.indexOf('time') > -1) {
            return 4;
        }
        if (name.indexOf('speed') > -1 || name.indexOf('velocity') > -1) {
            return 5;
        }
        if (name.indexOf('distance') > -1 || name.indexOf('length') > -1 || name.indexOf('width') > -1) {
            return 6;
        }
        if (name.indexOf('luminance') > -1 || name.indexOf('lux') > -1 || name.indexOf('light') > -1) {
            return 7;
        }
        if (name.indexOf('bat') > -1 || name.indexOf('voltage') > -1 || name.indexOf('battery') > -1) {
            return 8;
        }
        if (name.indexOf('latitude') > -1) {
            return 9;
        }
        if (name.indexOf('longitude') > -1) {
            return 10;
        }
        if (name.indexOf('altitude') > -1) {
            return 11;
        }
        if (name.indexOf('height') > -1) {
            return 14;
        }
        if (name.indexOf('pollution') > -1 || name.indexOf('pm') > -1) {
            return 15;
        }
        if (name.indexOf('wind') > -1) {
            return 16;
        }
        if (name.indexOf('rain') > -1) {
            return 17;
        }
        if (name.indexOf('water') > -1 || name.indexOf('leak') > -1) {
            return 18;
        }
        if (name.indexOf('door') > -1) {
            return 19;
        }
        return 0;
    },
    getDateFormatted: function (d) {

        var dt = '' + d.getFullYear()

        var tmp = d.getMonth() + 1
        dt = dt.concat('-', (tmp > 9 ? '' + tmp : '0' + tmp))

        tmp = d.getDate()
        dt = dt.concat('-', (tmp > 9 ? '' + tmp : '0' + tmp))

        tmp = d.getHours()
        dt = dt.concat(' ', (tmp > 9 ? '' + tmp : '0' + tmp))

        tmp = d.getMinutes()
        dt = dt.concat(':', (tmp > 9 ? '' + tmp : '0' + tmp))

        tmp = d.getSeconds()
        dt = dt.concat(':', (tmp > 9 ? '' + tmp : '0' + tmp))

        return dt
    },
    getStopwatchFormatted: function (h, m, s) {

        var dt = ''
        dt = dt.concat('', (h > 9 ? '' + h : '0' + h))
        dt = dt.concat(':', (m > 9 ? '' + m : '0' + m))
        dt = dt.concat(':', (s > 9 ? '' + s : '0' + s))
        return dt
    },
    getRounded(value, rounding) {
        try {
            if (!rounding || rounding === '') return value;
            var n = 1;
            n = value;
            return n.toFixed(parseInt(rounding))
        } catch (err) {
            return value;
        }
    },
    isNotEmpty: function (stringValue) {
        if (typeof stringValue === 'string') {
            return stringValue.length > 0
        } else {
            return false
        }
    },
    getChartUnit: function (firstTimestamp, lastTimeStamp, unit) {
        if (unit != null && unit != undefined && unit != '') {
            return unit
        }
        var dist = (lastTimeStamp - firstTimestamp) / 1000 //distance in seconds
        var _1year = 31536000
        var _1month = 2592000
        var _1week = 604800
        var _1day = 86400
        var _1hour = 3600

        //console.log('dist:'+dist)
        if (dist > _1year * 2) {
            return 'year'
        }
        if (dist > _1month * 6) {
            return 'quarter'
        }
        if (dist > _1month * 2) {
            return 'month'
        }
        if (dist > _1week * 2) {
            return 'week'
        }
        if (dist > _1day * 2) {
            return 'day'
        }
        if (dist > _1hour * 2) {
            return 'hour'
        }
        if (dist > 120) {
            return 'minute'
        }
    },
    getAccountTypeName: function (type, language) {
        switch (language) {
            case 'en':
                switch (type) {
                    case 0:
                        return 'standard'
                    case 1:
                        return 'sys.admin'
                    case 2:
                        return 'application' //not used
                    case 3:
                        return 'demo'
                    case 4:
                        return 'free'
                    case 5:
                        return 'primary'
                    case 6:
                        return 'readonly'
                    case 7:
                        return 'extended'
                    case 8:
                        return 'mng.admin' //administrator managing tenants
                    case 9:
                        return 'administrator' //tenant admin
                    case 10:
                        return 'anonymous'
                    case 100:
                        return 'subscriber'
                    case 1000:
                        return 'any'
                    default:
                        return 'misconfigured'
                }
                break
            case 'pl':
                switch (type) {
                    case 0:
                        return 'standard'
                    case 1:
                        return 'administrator systemu'
                    case 2:
                        return 'aplikacja' //not used
                    case 3:
                        return 'demo'
                    case 4:
                        return 'darmowe'
                    case 5:
                        return 'primary'
                    case 6:
                        return 'tylko odczyt'
                    case 7:
                        return 'rozszerzone'
                    case 8:
                        return 'administrator zarz.' //administrator managing tenants
                    case 9:
                        return 'administrator' //tenant admin
                    case 10:
                        return 'anonimowy'
                    case 100:
                        return 'subskrybent'
                    case 1000:
                        return 'any'
                    default:
                        return 'błędnie skonfigurowane'
                }
                break
            default:
        }
    },
    hasObjectAccess: function(profile, writeAccess, defaultOrganizationId, accessedObject, objectType) {
        if (accessedObject === null) {
            console.error("Accessed object is null");
            return false;
        }
        if (profile.type === 1) {
            return true;
        }
        let owner = null;
        let team = null;
        let admins = null;
        let organizationId = 0;
        let tenantId = 0;
        let isPublic = false;
        let path = "";
    
        switch(objectType) {
            case 'Dashboard':
                team = accessedObject.team;
                admins = accessedObject.administrators;
                owner = accessedObject.userID;
                organizationId = accessedObject.organizationId;
                isPublic = accessedObject.isShared;
                break;
            case 'Device':
                team = accessedObject.team;
                admins = accessedObject.administrators;
                owner = accessedObject.userID;
                organizationId = accessedObject.organizationId;
                isPublic = (accessedObject.team===null || accessedObject.team === undefined)? false:accessedObject.team.includes(",public,");
                path = accessedObject.path;
                break;
            case 'DeviceGroup':
                team = accessedObject.team;
                admins = accessedObject.administrators;
                owner = accessedObject.userID;
                organizationId = accessedObject.organization;
                isPublic = (accessedObject.team===null || accessedObject.team === undefined)? false:accessedObject.team.includes(",public,");
                break;
            case 'SentinelConfig':
                team = accessedObject.team;
                admins = accessedObject.administrators;
                owner = accessedObject.userId;
                organizationId = accessedObject.organizationId;
                isPublic = (accessedObject.team===null || accessedObject.team === undefined)? false:accessedObject.team.includes(",public,");
                break;
            default:
                console.error("Unknown object type: " + objectType);
                return false;
        }
    
        //console.info(`hasObjectAccess: ${user.uid} ${owner} ${team} ${admins} ${organizationId} ${tenantId} ${isPublic} ${path} ${writeAccess} ${user.path}`);
    
        if (owner === profile.uid) {
            return true;
        }
        if (profile.uid.toLowerCase() === "public") {
            return isPublic;
        }
        if (profile.organization === defaultOrganizationId) {
            if (admins!==null && admins!==undefined && admins.includes("," + profile.uid + ",")) {
                return true;
            }
            if (!writeAccess) {
                if (team!==null && team!==undefined && team.includes("," + profile.uid + ",")) {
                    return true;
                }
            }
        } else {
            if (profile.tenant < 1) {
                if (!writeAccess) {
                    if (profile.organization === organizationId) {
                        return true;
                    }
                } else {
                    if (profile.organization === organizationId && profile.type === 8) {
                        return true;
                    }
                }
            } else {
                if (profile.organization !== organizationId) {
                    return false;
                }
                let readAccess = false;
                let parentPath;
                let withChildren = false;
                if (profile.path.endsWith(".ALL") || profile.path.endsWith(".*")) {
                    parentPath = profile.path.substring(0, profile.path.lastIndexOf("."));
                    withChildren = true;
                } else {
                    parentPath = profile.path;
                }
                if (path.toLowerCase() === parentPath) {
                    readAccess = true;
                } else if (withChildren) {
                    readAccess = path.startsWith(parentPath + ".");
                }
                if (writeAccess) {
                    return readAccess && profile.type === 9;
                } else {
                    return readAccess;
                }
            }
        }
        return false;
    },
    getAccessType: function (profile, route, defaultOrganizationId){
        // Returns access type for the given profile and route
        // @param {Object} profile - user profile
        // @param {String} route - route
        // @returns {String} - access type string build from characters:
        // 'r' - can read, 'u' - can update, 'c' - can create, 'd' - can delete
        // if (profile === null || profile === undefined || route === null || route === undefined) {
        //     return null;
        // }
        if (profile === null || profile === undefined || route === null || route === undefined) {
            return '';
        }

        switch(route) {
            case 'dashboard':
                if (profile.type === 1) {
                    return 'rucd';
                }
                if (profile.type === 8 || profile.type === 9) {
                    return 'rucd';
                }
                if (profile.type === 0 || profile.type === 4 || profile.type === 5 || profile.type === 6 || profile.type === 7) {
                    return 'r';
                }
                if (profile.organization === defaultOrganizationId) {
                    return 'r';
                }
                return '';
            case 'device':
            case 'devicegroup':
            case 'sentinelconfig':
                if (profile.type === 1) {
                    return 'rucd';
                }
                if (profile.type === 8 || profile.type === 9) {
                    return 'rucd';
                }
                if (profile.type === 0 || profile.type === 4 || profile.type === 5 || profile.type === 6 || profile.type === 7) {
                    return 'r';
                }
                if (profile.organization === defaultOrganizationId) {
                    return 'r';
                }
                if (profile.tenant < 1) {
                    // tenant admin or sys admin
                    if (profile.organization === defaultOrganizationId) {
                        return 'r';
                    }
                }
            default:
                return 'r';
            }

        //
        return '';
    }
}