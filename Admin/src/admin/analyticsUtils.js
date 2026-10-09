const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const REPORT_METRICS = [
    { key: 'messages', label: 'Messages', color: '#818cf8' },
    { key: 'blogs', label: 'Blogs', color: '#34d399' },
    { key: 'services', label: 'Services', color: '#38bdf8' },
    { key: 'testimonials', label: 'Testimonials', color: '#fbbf24' },
];

const formatDate = (date) => date.toISOString().slice(0, 10);

const getBucketDate = (date, interval) => {
    const bucket = new Date(date);

    if (interval === 'week') {
        const daysSinceMonday = (bucket.getUTCDay() + 6) % 7;
        bucket.setUTCDate(bucket.getUTCDate() - daysSinceMonday);
    } else if (interval === 'month') {
        bucket.setUTCDate(1);
    }

    return bucket;
};

const formatBucketLabel = (date, interval) => {
    if (interval === 'month') {
        return new Intl.DateTimeFormat(undefined, { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(date);
    }

    const label = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
    return interval === 'week' ? `Week of ${label}` : label;
};

export const groupReportSeries = (metrics, from, to, interval) => {
    const buckets = new Map();
    const dataByMetric = {};
    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);

    for (let time = start.getTime(); time <= end.getTime(); time += DAY_IN_MS) {
        const bucketDate = getBucketDate(new Date(time), interval);
        const key = formatDate(bucketDate);
        if (!buckets.has(key)) {
            buckets.set(key, { key, label: formatBucketLabel(bucketDate, interval), counts: {} });
        }
    }

    Object.entries(metrics).forEach(([metric, value]) => {
        const dailyCounts = new Map(value.series.map((entry) => [entry.date, entry.count]));
        dataByMetric[metric] = dailyCounts;
    });

    for (let time = start.getTime(); time <= end.getTime(); time += DAY_IN_MS) {
        const day = formatDate(new Date(time));
        const bucketKey = formatDate(getBucketDate(new Date(time), interval));
        const bucket = buckets.get(bucketKey);

        Object.entries(dataByMetric).forEach(([metric, dailyCounts]) => {
            bucket.counts[metric] = (bucket.counts[metric] || 0) + (dailyCounts.get(day) || 0);
        });
    }

    return [...buckets.values()];
};

const escapeCsvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const downloadReportCsv = (report, metrics, interval) => {
    const buckets = groupReportSeries(report.metrics, report.from, report.to, interval);
    const rows = [
        ['Arviora analytics report'],
        ['From', report.from, 'To', report.to],
        ['Generated at', report.generatedAt],
        [],
        ['Metric', 'Total in period', 'Additional detail'],
        ...metrics.map((metric) => {
            const entry = report.metrics[metric.key];
            const detail = Object.entries(entry.details || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
            return [entry.label, entry.total, detail];
        }),
        [],
        ['Period', ...metrics.map((metric) => report.metrics[metric.key].label)],
        ...buckets.map((bucket) => [
            bucket.label,
            ...metrics.map((metric) => bucket.counts[metric.key] || 0),
        ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `arviora-analytics-${report.from}-to-${report.to}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

export const getInitialReportConfig = () => {
    const today = new Date();
    const to = formatDate(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())));
    const fromDate = new Date(`${to}T00:00:00.000Z`);
    fromDate.setUTCDate(fromDate.getUTCDate() - 29);
    const defaults = { period: '30', from: formatDate(fromDate), to, interval: 'day', metrics: REPORT_METRICS.map(({ key }) => key) };

    try {
        const stored = JSON.parse(localStorage.getItem('arvioraAnalyticsConfig') || 'null');
        if (!stored || !Array.isArray(stored.metrics)) {
            return defaults;
        }

        const metrics = stored.metrics.filter((metric) => REPORT_METRICS.some(({ key }) => key === metric));
        return {
            ...defaults,
            ...stored,
            metrics: metrics.length ? metrics : defaults.metrics,
        };
    } catch {
        return defaults;
    }
};

export const getDateRangeForPeriod = (period) => {
    if (period === 'custom') {
        return null;
    }

    const today = new Date();
    const to = formatDate(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())));
    const fromDate = new Date(`${to}T00:00:00.000Z`);
    fromDate.setUTCDate(fromDate.getUTCDate() - Number(period) + 1);
    return { from: formatDate(fromDate), to };
};
