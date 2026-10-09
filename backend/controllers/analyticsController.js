const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

const reportModels = {
    messages: {
        label: 'Messages',
        model: Contact,
        summary: {
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
        },
    },
    blogs: {
        label: 'Blogs',
        model: Blog,
        summary: {
            published: { $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] } },
            views: { $sum: { $ifNull: ['$views', 0] } },
        },
    },
    services: {
        label: 'Services',
        model: Service,
        summary: {
            active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        },
    },
    testimonials: {
        label: 'Testimonials',
        model: Testimonial,
        summary: {
            ratingTotal: { $sum: { $ifNull: ['$rating', 0] } },
            ratingCount: { $sum: { $cond: [{ $gt: ['$rating', 0] }, 1, 0] } },
        },
    },
};

const parseDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
};

const getAnalyticsReport = async (req, res) => {
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);
    const selectedMetrics = typeof req.query.metrics === 'string'
        ? [...new Set(req.query.metrics.split(',').filter(Boolean))]
        : [];

    if (!from || !to || from > to) {
        return res.status(400).json({
            success: false,
            message: 'Provide a valid date range using YYYY-MM-DD dates.',
        });
    }

    const endExclusive = new Date(to);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

    if (endExclusive.getTime() - from.getTime() > 366 * 24 * 60 * 60 * 1000) {
        return res.status(400).json({
            success: false,
            message: 'The report date range cannot exceed 366 days.',
        });
    }

    if (
        selectedMetrics.length === 0 ||
        selectedMetrics.some((metric) => !Object.prototype.hasOwnProperty.call(reportModels, metric))
    ) {
        return res.status(400).json({
            success: false,
            message: 'Select at least one supported report metric.',
        });
    }

    try {
        const results = await Promise.all(selectedMetrics.map(async (metric) => {
            const definition = reportModels[metric];
            const [aggregate = {}] = await definition.model.aggregate([
                {
                    $match: {
                        createdAt: { $gte: from, $lt: endExclusive },
                    },
                },
                {
                    $facet: {
                        daily: [
                            {
                                $group: {
                                    _id: {
                                        $dateToString: {
                                            format: '%Y-%m-%d',
                                            date: '$createdAt',
                                            timezone: 'UTC',
                                        },
                                    },
                                    count: { $sum: 1 },
                                },
                            },
                            { $sort: { _id: 1 } },
                        ],
                        summary: [
                            {
                                $group: {
                                    _id: null,
                                    total: { $sum: 1 },
                                    ...definition.summary,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        daily: 1,
                        summary: { $arrayElemAt: ['$summary', 0] },
                    },
                },
            ]);

            const summary = aggregate.summary || {};
            const details = {};
            Object.keys(definition.summary).forEach((key) => {
                if (key === 'ratingTotal' || key === 'ratingCount') {
                    return;
                }
                details[key] = summary[key] || 0;
            });

            if (metric === 'testimonials') {
                details.averageRating = summary.ratingCount
                    ? Number((summary.ratingTotal / summary.ratingCount).toFixed(1))
                    : 0;
            }

            return [metric, {
                label: definition.label,
                total: summary.total || 0,
                details,
                series: (aggregate.daily || []).map(({ _id, count }) => ({
                    date: _id,
                    count,
                })),
            }];
        }));

        return res.status(200).json({
            success: true,
            report: {
                from: req.query.from,
                to: req.query.to,
                generatedAt: new Date().toISOString(),
                metrics: Object.fromEntries(results),
            },
        });
    } catch (error) {
        console.error('Analytics report error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to generate the analytics report.',
        });
    }
};

module.exports = { getAnalyticsReport };
