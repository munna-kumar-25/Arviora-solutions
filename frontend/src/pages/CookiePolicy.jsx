import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
    return (
        <div className="min-h-[60vh] bg-white dark:bg-gray-900 transition-colors duration-300">
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
                        Learn how Arviora Solutions uses cookies and similar technologies.
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files that are stored on your device when you visit our website. They are widely used to make websites work more efficiently, as well as to provide information to the site owners. Cookies can be either "persistent" cookies or "session" cookies.
                    </p>

                    <h2>2. Types of Cookies We Use</h2>
                    <h3>Essential Cookies</h3>
                    <p>
                        These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. Without these cookies, the website cannot operate correctly.
                    </p>

                    <h3>Performance Cookies</h3>
                    <p>
                        These cookies collect information about how visitors use our website, including which pages are visited most often, and whether visitors receive error messages. These cookies don't collect information that identifies a visitor.
                    </p>

                    <h3>Functional Cookies</h3>
                    <p>
                        These cookies allow the website to remember choices you make (such as your user name, language preference, or the region you are in) and provide enhanced, more personalized features.
                    </p>

                    <h3>Targeting/Advertising Cookies</h3>
                    <p>
                        These cookies are used to deliver adverts relevant to you. They also limit the number of times you see an advert and measure the effectiveness of advertising campaigns. They are usually placed by advertising networks with our permission.
                    </p>

                    <h2>3. How We Use Cookies</h2>
                    <ul>
                        <li>To remember your preferences and settings</li>
                        <li>To understand how you use our website</li>
                        <li>To improve the performance and functionality of our website</li>
                        <li>To deliver targeted advertising content</li>
                        <li>To protect against fraud and ensure website security</li>
                        <li>To analyze website traffic and user behavior</li>
                    </ul>

                    <h2>4. Third-Party Cookies</h2>
                    <p>
                        Some cookies may be placed by third-party services, such as analytics providers, social media platforms, and advertising networks. These third parties may use cookies to track your activity across multiple websites to deliver personalized content and advertising.
                    </p>

                    <h2>5. Your Cookie Choices</h2>
                    <p>
                        You have the right to decide whether to accept or reject non-essential cookies. Most browsers allow you to refuse cookies and alert you when a cookie is being sent. However, blocking cookies may affect the functionality of our website. You can control cookies through your browser settings:
                    </p>
                    <ul>
                        <li>Google Chrome: Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                        <li>Mozilla Firefox: Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                        <li>Safari: Preferences &gt; Privacy &gt; Cookies and website data</li>
                        <li>Microsoft Edge: Settings &gt; Privacy, search, and services &gt; Cookies and other site permissions</li>
                    </ul>

                    <h2>6. Cookie Retention</h2>
                    <p>
                        Session cookies are deleted when you close your browser. Persistent cookies remain on your device until they expire or you delete them. The retention period varies depending on the purpose of the cookie and can range from days to years.
                    </p>

                    <h2>7. Do Not Track Signals</h2>
                    <p>
                        Some browsers include a "Do Not Track" (DNT) feature. Currently, there is no industry standard for recognizing DNT signals, and our website does not respond to DNT browser signals. However, you can use other tools to control data collection and use.
                    </p>

                    <h2>8. Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, and other factors. We will notify you of any material changes by posting the updated policy on our website and updating the "last updated" date.
                    </p>

                    <h2>9. Contact Us</h2>
                    <p>
                        If you have questions about our use of cookies or this Cookie Policy, please contact us at{' '}
                        <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="mailto:arviorasolutions@gmail.com">
                            arviorasolutions@gmail.com
                        </a>.
                    </p>

                    <h2>10. Last Updated</h2>
                    <p>
                        This Cookie Policy was last updated on May 22, 2026.
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

export default CookiePolicy;
