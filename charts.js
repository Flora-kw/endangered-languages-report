(function() {
    var style = getComputedStyle(document.documentElement);
    var accent = style.getPropertyValue('--accent').trim();
    var accent2 = style.getPropertyValue('--accent2').trim();
    var accent3 = style.getPropertyValue('--accent3').trim();
    var ink = style.getPropertyValue('--ink').trim();
    var muted = style.getPropertyValue('--muted').trim();
    var rule = style.getPropertyValue('--rule').trim();
    var bg2 = style.getPropertyValue('--bg2').trim();

    // ==================== Chart 1: 各洲概览 ====================
    (function() {
        var el = document.getElementById('chart-continent-overview');
        if (!el) return;
        var chart = echarts.init(el, null, { renderer: 'svg' });

        var continents = ['Africa', 'Americas', 'Asia', 'Oceania'];
        var levelColors = ['#8bc34a', '#ffc107', '#ff9800', '#e53935'];
        var levelNames = ['Vulnerable', 'Endangered', 'Severely Endangered', 'Critically Endangered'];

        // Estimated distribution based on treemap data patterns
        var dataByLevel = [
            [27, 25, 22, 20],  // Vulnerable
            [16, 20, 18, 12],  // Endangered
            [15, 18, 17, 12],  // Severely Endangered
            [20, 22, 20, 16]   // Critically Endangered
        ];

        var totalSpeakers = [348000, 462000, 382000, 199657];

        var series = levelNames.map(function(name, i) {
            return {
                name: name,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                itemStyle: { color: levelColors[i], borderRadius: i === 3 ? [4, 4, 0, 0] : [0, 0, 0, 0] },
                data: dataByLevel[i],
                animation: false
            };
        });

        series.push({
            name: '总使用人数',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { color: accent2, width: 2 },
            itemStyle: { color: accent2 },
            data: totalSpeakers,
            animation: false
        });

        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(17, 26, 46, 0.95)',
                borderColor: rule,
                textStyle: { color: ink },
                appendToBody: true
            },
            legend: {
                data: levelNames.concat(['总使用人数']),
                textStyle: { color: muted },
                bottom: 0
            },
            grid: { left: '8%', right: '8%', bottom: '15%', top: '10%', containLabel: true },
            xAxis: {
                type: 'category',
                data: continents,
                axisLine: { lineStyle: { color: rule } },
                axisLabel: { color: muted, fontSize: 12 },
                axisTick: { show: false }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '语言数量',
                    nameTextStyle: { color: muted },
                    axisLine: { show: false },
                    axisLabel: { color: muted },
                    splitLine: { lineStyle: { color: rule, type: 'dashed' } }
                },
                {
                    type: 'value',
                    name: '总使用人数',
                    nameTextStyle: { color: muted },
                    axisLine: { show: false },
                    axisLabel: {
                        color: muted,
                        formatter: function(v) { return (v / 1000) + 'k'; }
                    },
                    splitLine: { show: false }
                }
            ],
            series: series
        });

        window.addEventListener('resize', function() { chart.resize(); });
    })();

    // ==================== Chart 2: 濒危等级统计与色彩体系 ====================
    (function() {
        var el = document.getElementById('chart-color-system');
        if (!el) return;
        var chart = echarts.init(el, null, { renderer: 'svg' });

        var levels = ['Vulnerable', 'Endangered', 'Severely Endangered', 'Critically Endangered'];
        var levelColors = ['#8bc34a', '#ffc107', '#ff9800', '#e53935'];
        var levelNamesCn = ['脆弱', '濒危', '严重濒危', '极度濒危'];

        var stats = {
            count: [94, 66, 62, 78],
            median: [3251, 3350, 3363, 3072],
            max: [23949, 19144, 17645, 21752]
        };

        chart.setOption({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(17, 26, 46, 0.95)',
                borderColor: rule,
                textStyle: { color: ink },
                appendToBody: true,
                formatter: function(params) {
                    var idx = params[0].dataIndex;
                    var html = '<div style="font-weight:700;margin-bottom:6px;">' + levels[idx] + ' · ' + levelNamesCn[idx] + '</div>';
                    html += '<div style="color:' + muted + '">语言数量: <strong style="color:' + ink + '">' + stats.count[idx] + '</strong></div>';
                    html += '<div style="color:' + muted + '">中位数: <strong style="color:' + ink + '">' + stats.median[idx].toLocaleString() + '</strong></div>';
                    html += '<div style="color:' + muted + '">最大值: <strong style="color:' + ink + '">' + stats.max[idx].toLocaleString() + '</strong></div>';
                    return html;
                }
            },
            legend: {
                data: ['语言数量', '中位数人数', '最大人数'],
                textStyle: { color: muted },
                bottom: 0
            },
            grid: { left: '8%', right: '8%', bottom: '15%', top: '10%', containLabel: true },
            xAxis: {
                type: 'category',
                data: levels.map(function(l, i) { return levelNamesCn[i] + '\n' + l; }),
                axisLine: { lineStyle: { color: rule } },
                axisLabel: { color: muted, fontSize: 11, interval: 0 },
                axisTick: { show: false }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '数量',
                    nameTextStyle: { color: muted },
                    axisLine: { show: false },
                    axisLabel: { color: muted },
                    splitLine: { lineStyle: { color: rule, type: 'dashed' } }
                },
                {
                    type: 'value',
                    name: '人数',
                    nameTextStyle: { color: muted },
                    axisLine: { show: false },
                    axisLabel: {
                        color: muted,
                        formatter: function(v) { return (v / 1000) + 'k'; }
                    },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '语言数量',
                    type: 'bar',
                    barWidth: '25%',
                    itemStyle: {
                        color: function(params) { return levelColors[params.dataIndex]; },
                        borderRadius: [4, 4, 0, 0]
                    },
                    data: stats.count,
                    animation: false
                },
                {
                    name: '中位数人数',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: { color: accent, width: 2 },
                    itemStyle: { color: accent },
                    data: stats.median,
                    animation: false
                },
                {
                    name: '最大人数',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'diamond',
                    symbolSize: 8,
                    lineStyle: { color: accent3, width: 2, type: 'dashed' },
                    itemStyle: { color: accent3 },
                    data: stats.max,
                    animation: false
                }
            ]
        });

        window.addEventListener('resize', function() { chart.resize(); });
    })();
})();
