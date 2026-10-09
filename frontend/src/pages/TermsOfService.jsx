import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-[60vh] bg-white dark:bg-gray-900 transition-colors duration-300">
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
                        Please read these terms and conditions carefully before using our service.
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>

                    <h2>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Arviora Solutions's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul>
                        <li>Modifying or copying the materials</li>
                        <li>Using the materials for any commercial purpose or for any public display</li>
                        <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                        <li>Removing any copyright or other proprietary notations from the materials</li>
                        <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                    </ul>

                    <h2>3. Disclaimer</h2>
                    <p>
                        The materials on Arviora Solutions's website are provided on an 'as is' basis. Arviora Solutions makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h2>4. Limitations</h2>
                    <p>
                        In no event shall Arviora Solutions or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Arviora Solutions's website, even if Arviora Solutions or an authorized representative of Arviora Solutions has been notified orally or in writing of the possibility of such damage.
                    </p>

                    <h2>5. Accuracy of Materials</h2>
                    <p>
                        The materials appearing on Arviora Solutions's website could include technical, typographical, or photographic errors. Arviora Solutions does not warrant that any of the materials on the website are accurate, complete, or current. Arviora Solutions may make changes to the materials contained on the website at any time without notice.
                    </p>

                    <h2>6. Links</h2>
                    <p>
                        Arviora Solutions has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Arviora Solutions of the site. Use of any such linked website is at the user's own risk.
                    </p>

                    <h2>7. Modifications</h2>
                    <p>
                        Arviora Solutions may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                    </p>

                    <h2>8. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>

                    <h2>9. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at{' '}
                        <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="mailto:arviorasolutions@gmail.com">
                            arviorasolutions@gmail.com
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

export default TermsOfService;
