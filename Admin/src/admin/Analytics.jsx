import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, Calendar, Check, ChevronDown, Download, Filter, Loader, RefreshCw } from 'react-feather';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    downloadReportCsv,
    getDateRangeForPeriod,
    getInitialReportConfig,
    groupReportSeries,
    REPORT_METRICS,
} from './analyticsUtils';

const inputClass = 'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

const Analytics = () => {
    const { getAnalyticsReport } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [config, setConfig] = useState(getInitialReportConfig);
    const initialConfig = useRef(config);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadReport = useCallback(async (reportConfig) => {
        setError('');
        setLoading(true);
        try {
            const response = await getAnalyticsReport(reportConfig);
            setReport(response.report);
            localStorage.setItem('arvioraAnalyticsConfig', JSON.stringify(reportConfig));
        } catch (requestError) {
            setError(requestError.message || 'Could not generate the report. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [getAnalyticsReport]);

    useEffect(() => {
        loadReport(initialConfig.current);
    }, [loadReport]);

    const selectedMetrics = useMemo(
        () => REPORT_METRICS.filter(({ key }) => config.metrics.includes(key)),
        [config.metrics]
    );
    const buckets = useMemo(
        () => report ? groupReportSeries(report.metrics, report.from, report.to, config.interval) : [],
        [report, config.interval]
    );

    const setPeriod = (period) => {
        const range = getDateRangeForPeriod(period);
        setConfig((current) => ({
            ...current,
            period,
            ...(range || {}),
        }));
    };

    const toggleMetric = (metric) => {
        setConfig((current) => ({
            ...current,
            metrics: current.metrics.includes(metric)
                ? current.metrics.filter((item) => item !== metric)
                : [...current.metrics, metric],
        }));
    };

    const handleGenerate = (event) => {
        event.preventDefault();

        const fromDate = Date.parse(`${config.from}T00:00:00.000Z`);
        const toDate = Date.parse(`${config.to}T00:00:00.000Z`);
        if (!Number.isFinite(fromDate) || !Number.isFinite(toDate) || fromDate > toDate) {
            setError('Choose a valid start and end date.');
            return;
        }
        if (toDate - fromDate > 365 * 24 * 60 * 60 * 1000) {
            setError('Reports can cover up to 366 days.');
            return;
        }
        if (config.metrics.length === 0) {
            setError('Select at least one metric for the report.');
            return;
        }

        loadReport(config);
    };

    const chartHeight = 260;
    const chartWidth = 900;
    const padding = { top: 24, right: 22, bottom: 42, left: 48 };
    const maxValue = Math.max(1, ...buckets.flatMap((bucket) => selectedMetrics.map(({ key }) => bucket.counts[key] || 0)));
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    const labelIndexes = buckets.length <= 6
        ? buckets.map((_, index) => index)
        : [...new Set([0, Math.floor((buckets.length - 1) / 4), Math.floor((buckets.length - 1) / 2), Math.floor((3 * (buckets.length - 1)) / 4), buckets.length - 1])];

    const card = isDark ? 'border-slate-800 bg-slate-900/75' : 'border-slate-200 bg-white';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputTheme = isDark
        ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
        : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400';

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-900/15 md:p-8"
            >
                <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[32px] border-white/5" />
                <div className="absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-50">
                            <Activity size={14} /> Workspace insights
                        </span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Analytics & reports</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
                            Understand content and enquiries from your saved records. Configure a period, choose metrics, and export the report.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => report && downloadReportCsv(report, selectedMetrics, config.interval)}
                        disabled={!report || loading}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={17} /> Export CSV
                    </button>
                </div>
            </motion.section>

            <section className={`rounded-2xl border p-5 shadow-sm md:p-6 ${card}`}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                            <Filter size={19} />
                        </span>
                        <div>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Report configuration</h3>
                            <p className={`text-xs ${muted}`}>Choose what to include in this report</p>
                        </div>
                    </div>
                    <span className={`text-xs ${muted}`}>Settings are saved on this device</span>
                </div>

                <form onSubmit={handleGenerate} className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr_auto]">
                        <label className={`block text-xs font-semibold ${muted}`}>
                            <span className="mb-2 flex items-center gap-2"><Calendar size={14} /> Date range</span>
                            <span className="relative block">
                                <select
                                    value={config.period}
                                    onChange={(event) => setPeriod(event.target.value)}
                                    className={`${inputClass} appearance-none pr-9 ${inputTheme}`}
                                >
                                    <option value="7">Last 7 days</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="365">Last 365 days</option>
                                    <option value="custom">Custom range</option>
                                </select>
                                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
                            </span>
                        </label>
                        <label className={`block text-xs font-semibold ${muted}`}>
                            <span className="mb-2 block">From</span>
                            <input
                                type="date"
                                value={config.from}
                                onChange={(event) => setConfig((current) => ({ ...current, period: 'custom', from: event.target.value }))}
                                className={`${inputClass} ${inputTheme}`}
                                required
                            />
                        </label>
                        <label className={`block text-xs font-semibold ${muted}`}>
                            <span className="mb-2 block">To</span>
                            <input
                                type="date"
                                value={config.to}
                                onChange={(event) => setConfig((current) => ({ ...current, period: 'custom', to: event.target.value }))}
                                className={`${inputClass} ${inputTheme}`}
                                required
                            />
                        </label>
                        <label className={`block text-xs font-semibold ${muted}`}>
                            <span className="mb-2 block">Chart grouping</span>
                            <span className="relative block">
                                <select
                                    value={config.interval}
                                    onChange={(event) => setConfig((current) => ({ ...current, interval: event.target.value }))}
                                    className={`${inputClass} appearance-none pr-9 ${inputTheme}`}
                                >
                                    <option value="day">Daily</option>
                                    <option value="week">Weekly</option>
                                    <option value="month">Monthly</option>
                                </select>
                                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
                            </span>
                        </label>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                            >
                                {loading ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                {loading ? 'Generating' : 'Generate'}
                            </button>
                        </div>
                    </div>

                    <div className={`border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <p className={`mb-3 text-xs font-semibold ${muted}`}>Include metrics</p>
                        <div className="flex flex-wrap gap-2">
                            {REPORT_METRICS.map((metric) => {
                                const checked = config.metrics.includes(metric.key);
                                return (
                                    <button
                                        key={metric.key}
                                        type="button"
                                        aria-pressed={checked}
                                        onClick={() => toggleMetric(metric.key)}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${checked
                                            ? isDark ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                            : isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: metric.color }} />
                                        {metric.label}
                                        {checked && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>
                {error && (
                    <div role="alert" className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                        {error}
                    </div>
                )}
            </section>

            {report && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {selectedMetrics.map((metric, index) => {
                            const result = report.metrics[metric.key];
                            const details = Object.entries(result.details || {});
                            return (
                                <motion.article
                                    key={metric.key}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    className={`rounded-2xl border p-5 shadow-sm ${card}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${muted}`}>{result.label}</span>
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ color: metric.color, backgroundColor: `${metric.color}1a` }}>
                                            <BarChart2 size={18} />
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {Number(result.total).toLocaleString()}
                                    </p>
                                    <div className={`mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs ${muted}`}>
                                        {details.map(([key, value]) => (
                                            <span key={key}>{key === 'averageRating' ? 'Avg. rating' : key[0].toUpperCase() + key.slice(1)}: {value}</span>
                                        ))}
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>

                    <section className={`rounded-2xl border p-5 shadow-sm md:p-6 ${card}`}>
                        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity over time</h3>
                                <p className={`mt-1 text-sm ${muted}`}>
                                    {report.from} to {report.to} · grouped {config.interval === 'day' ? 'daily' : config.interval === 'week' ? 'weekly' : 'monthly'}
                                </p>
                            </div>
                            {report.generatedAt && (
                                <span className={`text-xs ${muted}`}>Updated {new Date(report.generatedAt).toLocaleString()}</span>
                            )}
                        </div>

                        {buckets.length > 0 ? (
                            <div className="overflow-x-auto">
                                <svg
                                    role="img"
                                    aria-label="Selected records created over time"
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                    className="min-w-[640px] w-full"
                                >
                                    {[0, 1, 2, 3].map((line) => {
                                        const y = padding.top + (plotHeight / 3) * line;
                                        return (
                                            <g key={line}>
                                                <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="4 6" />
                                                <text x={padding.left - 10} y={y + 4} textAnchor="end" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="11">
                                                    {Math.round(maxValue * (1 - line / 3))}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    {selectedMetrics.map((metric) => {
                                        const points = buckets.map((bucket, index) => {
                                            const x = buckets.length === 1
                                                ? padding.left + plotWidth / 2
                                                : padding.left + (plotWidth * index) / (buckets.length - 1);
                                            const y = padding.top + plotHeight - ((bucket.counts[metric.key] || 0) / maxValue) * plotHeight;
                                            return `${x},${y}`;
                                        }).join(' ');
                                        return (
                                            <g key={metric.key}>
                                                <polyline points={points} fill="none" stroke={metric.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                {buckets.map((bucket, index) => {
                                                    const x = buckets.length === 1
                                                        ? padding.left + plotWidth / 2
                                                        : padding.left + (plotWidth * index) / (buckets.length - 1);
                                                    const y = padding.top + plotHeight - ((bucket.counts[metric.key] || 0) / maxValue) * plotHeight;
                                                    return (
                                                        <circle
                                                            key={`${metric.key}-${bucket.key}`}
                                                            cx={x}
                                                            cy={y}
                                                            r="3.5"
                                                            fill={metric.color}
                                                            stroke={isDark ? '#0f172a' : '#fff'}
                                                            strokeWidth="2"
                                                        >
                                                            <title>{`${metric.label}: ${bucket.counts[metric.key] || 0} on ${bucket.label}`}</title>
                                                        </circle>
                                                    );
                                                })}
                                            </g>
                                        );
                                    })}
                                    {labelIndexes.map((index) => {
                                        const x = buckets.length === 1
                                            ? padding.left + plotWidth / 2
                                            : padding.left + (plotWidth * index) / (buckets.length - 1);
                                        return (
                                            <text key={buckets[index].key} x={x} y={chartHeight - 12} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="11">
                                                {buckets[index].label}
                                            </text>
                                        );
                                    })}
                                </svg>
                            </div>
                        ) : (
                            <div className={`rounded-xl py-16 text-center text-sm ${muted}`}>No data is available for this date range.</div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                            {selectedMetrics.map((metric) => (
                                <span key={metric.key} className={`inline-flex items-center gap-2 text-xs font-medium ${muted}`}>
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metric.color }} />
                                    {report.metrics[metric.key].label}
                                </span>
                            ))}
                        </div>
                    </section>
                    <p className={`text-xs ${muted}`}>
                        Reports use records created within the selected dates. They do not represent website visitors or page views.
                    </p>
                </>
            )}
        </div>
    );
};

export default Analytics;
