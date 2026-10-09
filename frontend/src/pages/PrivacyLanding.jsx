import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyLanding = () => {
    return (
        <div className="min-h-[60vh] bg-white dark:bg-gray-900 transition-colors duration-300">
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
                        This is your privacy policy landing page. Replace this text with your final legal content.
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We may collect information you provide directly (such as contact information) and information collected
                        automatically (such as usage data).
                    </p>

                    <h2>2. How We Use Information</h2>
                    <p>
                        We use information to provide and improve our services, respond to requests, and communicate with you.
                    </p>

                    <h2>3. Cookies</h2>
                    <p>
                        We may use cookies and similar technologies to analyze traffic and enhance user experience.
                    </p>

                    <h2>4. Contact</h2>
                    <p>
                        If you have questions about this policy, contact us at{' '}
                        <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="mailto:arviorasolution@gmail.com">
                            arviorasolution@gmail.com
                        </a>.
                    </p>
                </div>

                <div className="mt-10 flex justify-center">
                    <Link
                        to="/"
                        className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default PrivacyLanding;

