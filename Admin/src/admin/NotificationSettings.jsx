import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Bell, Loader, Mail, Save, Send } from 'react-feather';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

const NotificationSettings = () => {
    const { getNotificationSettings, updateNotificationSettings, sendTestNotificationEmail } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [contactEmailEnabled, setContactEmailEnabled] = useState(true);
    const [demoEmailEnabled, setDemoEmailEnabled] = useState(true);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [testLoading, setTestLoading] = useState(false);
    const [testResult, setTestResult] = useState('');

    const loadSettings = useCallback(async () => {
        setError('');
        setLoading(true);
        try {
            const response = await getNotificationSettings();
            setContactEmailEnabled(response.settings.contactEmailEnabled ?? response.settings.emailEnabled ?? true);
            setDemoEmailEnabled(response.settings.demoEmailEnabled ?? response.settings.emailEnabled ?? true);
            setInAppEnabled(response.settings.inAppEnabled ?? true);
            setEmail(response.settings.email || '');
        } catch (requestError) {
            setError(requestError.message || 'Could not load notification settings.');
        } finally {
            setLoading(false);
        }
    }, [getNotificationSettings]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if ((contactEmailEnabled || demoEmailEnabled) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Enter a valid recipient email address or disable both email alerts.');
            return;
        }

        setSaving(true);
        try {
            const response = await updateNotificationSettings({
                contactEmailEnabled,
                demoEmailEnabled,
                inAppEnabled,
                email: email.trim(),
            });
            setContactEmailEnabled(response.settings.contactEmailEnabled ?? response.settings.emailEnabled);
            setDemoEmailEnabled(response.settings.demoEmailEnabled ?? response.settings.emailEnabled);
            setInAppEnabled(response.settings.inAppEnabled ?? true);
            setEmail(response.settings.email || '');
            setSuccess(response.message || 'Notification settings saved.');
        } catch (requestError) {
            setError(requestError.message || 'Could not save notification settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setError('');
        setTestResult('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Enter a valid email address before sending a test.');
            return;
        }

        setTestLoading(true);
        try {
            const response = await sendTestNotificationEmail(email.trim());
            setTestResult(response.message || 'Test email sent.');
        } catch (requestError) {
            setError(requestError.message || 'Could not send a test email.');
        } finally {
            setTestLoading(false);
        }
    };

    const cardClass = isDark ? 'border-slate-800 bg-slate-900/75' : 'border-slate-200 bg-white';
    const textClass = isDark ? 'text-white' : 'text-slate-900';
    const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputClass = isDark
        ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
        : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400';

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-10">
            <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-900/15 md:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-50">
                    <Bell size={14} /> Admin preferences
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">Notification settings</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
                    Configure in-panel alerts and separate email notifications for contact messages and demo requests.
                </p>
            </section>

            <section className={`rounded-2xl border p-5 shadow-sm md:p-6 ${cardClass}`}>
                {loading ? (
                    <div className={`flex items-center gap-3 py-8 ${mutedClass}`} role="status">
                        <Loader size={18} className="animate-spin" /> Loading notification settings...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className={`font-semibold ${textClass}`}>In-panel notifications</h3>
                            <p className={`mt-1 text-sm ${mutedClass}`}>
                                Show an alert in the Admin Panel when a new request arrives. The panel checks for new requests every 30 seconds.
                            </p>
                            <label className={`mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium ${textClass}`}>
                                <input
                                    type="checkbox"
                                    checked={inAppEnabled}
                                    onChange={(event) => setInAppEnabled(event.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                Enable in-panel alerts
                            </label>
                        </div>

                        <div className={`border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <h3 className={`flex items-center gap-2 font-semibold ${textClass}`}><Mail size={17} /> Email notifications</h3>
                            <p className={`mt-1 text-sm ${mutedClass}`}>Select which new submissions should send email to the recipient below.</p>
                            <div className="mt-4 space-y-3">
                                <label className={`flex cursor-pointer items-center gap-3 text-sm font-medium ${textClass}`}>
                                    <input
                                        type="checkbox"
                                        checked={contactEmailEnabled}
                                        onChange={(event) => setContactEmailEnabled(event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Email alerts for contact messages
                                </label>
                                <label className={`flex cursor-pointer items-center gap-3 text-sm font-medium ${textClass}`}>
                                    <input
                                        type="checkbox"
                                        checked={demoEmailEnabled}
                                        onChange={(event) => setDemoEmailEnabled(event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Email alerts for demo requests
                                </label>
                            </div>
                        </div>

                        <label className={`block text-sm font-medium ${textClass}`}>
                            Notification recipient email
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                maxLength={254}
                                required={contactEmailEnabled || demoEmailEnabled}
                                disabled={loading}
                                placeholder="admin@example.com"
                                className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 ${inputClass}`}
                            />
                            <span className={`mt-2 block text-xs font-normal ${mutedClass}`}>
                                The selected email alerts will be sent to this address.
                            </span>
                            <button
                                type="button"
                                onClick={handleTestEmail}
                                disabled={testLoading || loading}
                                className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                            >
                                {testLoading ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                                {testLoading ? 'Sending test…' : 'Send test email'}
                            </button>
                        </label>

                        {error && (
                            <div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
                                {success}
                            </div>
                        )}
                        {testResult && (
                            <div role="status" className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-600 dark:text-sky-300">
                                {testResult}
                            </div>
                        )}

                        <div className={`flex justify-end border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? 'Saving...' : 'Save settings'}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
};

export default NotificationSettings;
