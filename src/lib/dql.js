export const dql = {

    applyFilter: function (query, filter) {
        var result = this.sweepSpaces(query)
        if (filter.from.length > 0) {
            result = this.replaceDQL(result, 'from', filter.from)
        }
        if (filter.to.length > 0) {
            result = this.replaceDQL(result, 'to', filter.to)
        }
        //if(filter.project.length>0){
        //    result=replaceDQL(result,'project',filter.project)
        //}
        return result
    },
    replaceDQL: function (query, key, value) {
        var a = ''
        var b = ''
        var q2
        var idx1 = query.indexOf(key)
        if (idx1 < 0) {
            q2 = query + ' ' + key + ' ' + value
        } else {
            a = query.substring(0, idx1)
            var idx2 = query.indexOf(' ', idx1 + (key + ' ').length)
            if (idx2 > 0) {
                b = query.substring(idx2)
            }
            q2 = a + key + ' ' + value + b
        }
        return q2
    },
    removeKey: function (query, key, withParam) {
        var a = ''
        var b = ''
        var q2
        var idx1 = query.indexOf(key)
        if (idx1 < 0) {
            return query
        } else {
            a = query.substring(0, idx1)
            var idx2
            if (withParam) {
                idx2 = query.indexOf(' ', idx1 + (key + ' ').length)
            }else{
                idx2 = query.indexOf(' ', idx1)
            }
            if (idx2 > 0) {
                b = query.substring(idx2)
            }
            q2 = a + b
        }
        return q2
    },
    sweepSpaces: function (t) {
        if (t == null || t == undefined) return ''
        return t.trim().replace(/ +(?= )/g, '')
    },
    checkQuerySyntax: function (text) {
        var dql = this.sweepSpaces(text)
        if (dql == '' || dql == '1' || dql == 'last') return true
        var params = dql.split(' ')
        for (let i = 0; i < params.length;) {
            switch (params[i]) {
                case "last":
                case "limit":
                case "average":
                case "minimum":
                case "maximum":
                    if (params.length < (i + 2) || !Number.isInteger(parseInt(params[i + 1]))) {
                        return false
                    }
                    i = i + 2;
                    break;
                case "project":
                case "state":
                case "status":
                case "channel":
                case "group":
                case "eui":
                case "class":
                case "report":
                case "new":
                case "from":
                case "to":
                    if (params.length < i + 2) return false
                    i = i + 2;
                    break;
                case "timeseries":
                case "csv.timeseries":
                case "virtual":
                case "notnull":
                case "skipnull":
                    i = i + 1;
                    break;
                default:
                    return false
            }
        }
        return true
    },
    parse: function (query) {
        //this is work in progress
        let result = {}
        try {
            let q = this.sweepSpaces(query)
            let params = q.split(' ')
            for (let i = 0; i < params.length;) {
                switch (params[i]) {
                    case "last":
                    case "limit":
                    case "average":
                    case "minimum":
                    case "maximum":
                        result[params[i]] = parseInt(params[i + 1])
                        i = i + 2;
                        break;
                    case "project":
                    case "class":
                    case "report":
                    case "state":
                    case "status":
                    case "channel":
                    case "eui":
                    case "group":
                    case "new":
                    case "from":
                    case "to":
                        result[params[i]] = params[i + 1]
                        i = i + 2;
                        break;
                    case "timeseries":
                    case "csv.timeseries":
                    case "virtual":
                    case "notnull":
                    case "skipnull":
                        result[params[i]] = true
                        i = i + 1;
                        break;
                    default:
                        console.log('Error parsing DQL. Unknown parameter: ' + params[i])
                        i = i + 1
                }
            }
        } catch (e) {
            console.log(e)
        }
        return result
    }
}