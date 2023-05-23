export const widgets = {
    types: [
        'bar_chart',
        'button',
        'date',
        'devinfo',
        'image',
        'led',
        'line_chart',
        'map',
        'multimap',
        'multitrack',
        'plan',
        'raw',
        'report',
        'stepped_chart',
        'sticker',
        'stopwatch',
        'time',
        'text',
        'canvas_placeholder',
        'chart_placeholder'
    ],
    widgetTypesLocal: [], // List of locally defined widget types
    getCommunityWidgetTypes: [], // List of widgets types delivered by the community
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
    widgetFieldTypes: {
        w_type: 'widget type',
        w_name: 'widget name',
        w_title: 'widget title',
        w_group: 'device group ID',
        w_role: 'user role required to see the widget (all users if empty)',
        w_channel: 'channel(s) to display',
        w_query: 'query (DQL)',
        w_format: 'format',
        w_chartOption: 'chart option (depends on the chart type)',
        w_cubicInterpolation: 'cubic interpolation',
        w_image_url: 'image URL',
        w_app_id: 'application ID',
        w_dev_id: 'device EUI',
        w_configuration: 'widget configuration',
        w_data_type: 'data type',
        w_command_type: 'command type',
        w_unit: 'unit',
        w_rounding: 'value rounding',
        w_range: 'alert range definition',
        w_icon: 'icon name',
        w_channel_translated: 'translated channel name(s)'
    },
    widgetFields: {
        tab0: {
            required: ['w_type', 'w_name', 'w_title'],
            typeDependent: {
                'report': ['w_group'],
                'multimap': ['w_group'],
                'multitrack': ['w_group'],
                'plan': ['w_group'],
                'text': [],
                'image': [],
                'raw': [],
                'line': ['w_channel', 'w_query', 'w_format', 'w_chartOption', 'w_cubicInterpolation'],
                'stepped': ['w_channel', 'w_query', 'w_format', 'w_chartOption', 'w_cubicInterpolation'],
                'bar': ['w_channel', 'w_query', 'w_format'],
                'map': ['w_channel', 'w_query'],
                'date': ['w_channel', 'w_query'],
                'stopwatch': ['w_channel', 'w_query'],
                'time': ['w_channel', 'w_query'],
                'plan': ['w_channel', 'w_query', 'w_range'],
                'led': ['w_channel', 'w_query', 'w_range'],
                'sticker': []
            },
            tab1: {
                required: ['w_role'],
                typeDependent: {
                    'text': [],
                    'image': ['w_image_url'],
                    'raw': ['w_channel', 'w_query'],
                    'line': ['w_channel', 'w_query', 'w_format', 'w_chartOption', 'w_cubicInterpolation'],
                    'stepped': ['w_channel', 'w_query', 'w_format', 'w_chartOption', 'w_cubicInterpolation'],
                    'bar': ['w_channel', 'w_query', 'w_format'],
                    'map': ['w_channel', 'w_query'],
                    'date': ['w_channel', 'w_query'],
                    'stopwatch': ['w_channel', 'w_query'],
                    'time': ['w_channel', 'w_query'],
                    'plan': ['w_channel', 'w_query', 'w_range'],
                    'led': ['w_channel', 'w_query', 'w_range'],
                    'report': ['w_channel', 'w_query', 'w_channel_translated'],
                    'devinfo': ['w_channel', 'w_query', 'w_channel_translated'],
                    'multimap': ['w_channel', 'w_query', 'w_channel_translated', 'w_range'],
                    'multitrack': ['w_channel', 'w_query', 'w_channel_translated', 'w_range'],
                    'button': ['w_channel', 'w_data_type', 'w_command_type'],
                    'sticker': ['w_channel', 'w_query', 'w_unit', 'w_rounding', 'w_range', 'w_icon']
                }
            },
            tab2: {
                required: ['w_configuration', 'w_app_id', 'w_dev_id'],
                typeDependent: {
                }
            }
        }
    }
}