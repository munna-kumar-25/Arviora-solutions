import React, { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock } from 'react-feather';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

const TIME_SLOTS = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

const getToday = () => {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
};

const BookDemo = () => {
    const { services, addContactMessage } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const serviceOptions = useMemo(
        () => [...new Set(services.map((service) => service.title).filter(Boolean))],
        [services]
    );
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        const requestMessage = [
            `Demo request for: ${formData.service}`,
            `Preferred date: ${formData.preferredDate}`,
            `Preferred time: ${formData.preferredTime}`,
            formData.company ? `Company: ${formData.company}` : '',
            formData.message.trim() ? `Additional details: ${formData.message.trim()}` : '',
        ].filter(Boolean).join('\n');

        try {
            await addContactMessage({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                company: formData.company.trim(),
                requestType: 'demo',
                service: formData.service,
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime,
                subject: `Demo request: ${formData.service}`,
                message: requestMessage,
            });
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                service: '',
                preferredDate: '',
                preferredTime: '',
                message: '',
            });
        } catch (submitError) {
            setError(submitError.message || 'Unable to submit your demo request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const fieldClass = `w-full rounded-lg border px-4 py-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
        isDark
            ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
    }`;

    return (
        <main className={`min-h-screen px-4 pb-16 pt-28 transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="mx-auto max-w-5xl">
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                        Let’s talk about your project
                    </p>
                    <h1 className={`text-4xl font-bold sm:text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Book a Demo
                    </h1>
                    <p className={`mx-auto mt-4 max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose a service and a preferred time. Our team will contact you to confirm availability.
                    </p>
                </motion.header>

                <motion.form
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className={`rounded-2xl p-6 shadow-xl sm:p-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                >
                    {submitted && (
                        <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                            <CheckCircle className="mt-0.5 shrink-0" size={20} />
                            <p>Your demo request has been received. We’ll contact you to confirm the date and time.</p>
                        </div>
                    )}
                    {error && (
                        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Full name *
                            <input className={`${fieldClass} mt-2`} name="name" value={formData.name} onChange={handleChange} autoComplete="name" minLength={2} maxLength={100} required />
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Work email *
                            <input className={`${fieldClass} mt-2`} type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Phone number
                            <input className={`${fieldClass} mt-2`} type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" maxLength={30} />
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Company
                            <input className={`${fieldClass} mt-2`} name="company" value={formData.company} onChange={handleChange} autoComplete="organization" maxLength={150} />
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Service *
                            <select className={`${fieldClass} mt-2`} name="service" value={formData.service} onChange={handleChange} required>
                                <option value="">Choose a service</option>
                                {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
                                <option value="Other / Not sure">Other / Not sure</option>
                            </select>
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Preferred date *
                            <span className="relative mt-2 block">
                                <Calendar className={`pointer-events-none absolute left-3 top-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                                <input className={`${fieldClass} pl-10`} type="date" name="preferredDate" min={getToday()} value={formData.preferredDate} onChange={handleChange} required />
                            </span>
                        </label>
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Preferred time *
                            <span className="relative mt-2 block">
                                <Clock className={`pointer-events-none absolute left-3 top-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                                <select className={`${fieldClass} pl-10`} name="preferredTime" value={formData.preferredTime} onChange={handleChange} required>
                                    <option value="">Choose a time</option>
                                    {TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}
                                </select>
                            </span>
                        </label>
                        <label className={`text-sm font-semibold sm:col-span-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            What would you like to discuss?
                            <textarea className={`${fieldClass} mt-2`} name="message" value={formData.message} onChange={handleChange} rows={4} maxLength={2000} placeholder="Tell us a little about your goals or questions." />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-7 w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {submitting ? 'Sending request…' : 'Request a demo'}
                    </button>
                    <p className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Your selected time is a preference. It is not confirmed until our team contacts you.
                    </p>
                </motion.form>
            </div>
        </main>
    );
};

export default BookDemo;
