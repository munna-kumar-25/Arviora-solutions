import React, { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Eye } from 'react-feather';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import { blogsAPI, getImageUrl } from '../services/api';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useContext(ThemeContext);
    const { getBlogById } = useContext(AppContext);
    const blog = getBlogById(id);
    const [views, setViews] = React.useState(blog?.views || 0);
    const countedBlogId = React.useRef(null);

    React.useEffect(() => {
        if (!blog?._id) return;
        setViews(blog.views || 0);
        if (countedBlogId.current === blog._id) return;

        countedBlogId.current = blog._id;
        blogsAPI.getById(blog._id)
            .then(({ data }) => setViews(data.blog.views || 0))
            .catch((error) => console.error('Unable to update blog view count:', error));
    }, [blog?._id, blog?.views]);

    React.useEffect(() => {
        if (!blog) return undefined;

        const metaSnapshot = new Map();
        const setMeta = (key, value, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, key);
                document.head.appendChild(element);
                metaSnapshot.set(element, null);
            } else {
                metaSnapshot.set(element, element.getAttribute('content'));
            }
            element.setAttribute('content', value);
        };
        const toIsoString = (value) => {
            if (!value) return undefined;
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
        };
        const plainText = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
        const description = plainText(blog.metaDescription || blog.description || blog.content).slice(0, 160);
        const title = blog.metaTitle || blog.title;
        const canonicalUrl = blog.canonicalUrl || `${window.location.origin}/blog/${blog.slug || blog._id}`;
        const socialTitle = blog.ogTitle || title;
        const socialDescription = blog.ogDescription || description;
        const imageUrl = blog.image ? new URL(getImageUrl(blog.image), window.location.origin).href : '';
        const keywords = [...new Set([...(blog.seoKeywords || []), ...(blog.tags || [])])].join(', ');
        const publishedAt = toIsoString(blog.date);
        const modifiedAt = toIsoString(blog.updatedAt);
        const previousTitle = document.title;

        document.title = `${title} | Arviora Solutions`;
        setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
        setMeta('og:type', 'article', true);
        setMeta('og:title', socialTitle, true);
        setMeta('og:description', socialDescription, true);
        setMeta('robots', blog.noIndex ? 'noindex, nofollow' : 'index, follow');
        setMeta('og:url', canonicalUrl, true);
        if (publishedAt) setMeta('article:published_time', publishedAt, true);
        if (imageUrl) setMeta('og:image', imageUrl, true);
        setMeta('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
        setMeta('twitter:title', socialTitle);
        setMeta('twitter:description', socialDescription);
        if (imageUrl) setMeta('twitter:image', imageUrl);

        let canonical = document.head.querySelector('link[rel="canonical"]');
        const createdCanonical = !canonical;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        const previousCanonical = canonical.getAttribute('href');
        canonical.href = canonicalUrl;

        const structuredData = document.createElement('script');
        structuredData.type = 'application/ld+json';
        structuredData.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description,
            image: imageUrl ? [imageUrl] : undefined,
            datePublished: publishedAt,
            dateModified: modifiedAt,
            author: { '@type': 'Organization', name: blog.author || 'Arviora Solutions' },
            mainEntityOfPage: canonicalUrl,
        });
        document.head.appendChild(structuredData);

        return () => {
            document.title = previousTitle;
            metaSnapshot.forEach((content, element) => {
                if (content === null) element.remove();
                else element.setAttribute('content', content);
            });
            if (createdCanonical) canonical.remove();
            else if (previousCanonical === null) canonical.removeAttribute('href');
            else canonical.setAttribute('href', previousCanonical);
            structuredData.remove();
        };
    }, [blog]);

    if (!blog) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <h1 className={`mb-4 text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog Post Not Found</h1>
                    <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>The blog post you're looking for doesn't exist.</p>
                    <Link to="/blog" className="btn-primary inline-block">Back to Blog</Link>
                </div>
            </div>
        );
    }

    const keywords = [...new Set([...(blog.seoKeywords || []), ...(blog.tags || [])])];

    return (
        <main className={`min-h-screen pb-16 pt-28 transition-colors ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-5xl px-4"
            >
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={`mb-6 font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                >
                    ← Back
                </button>

                <h1 className={`mb-4 text-4xl font-bold leading-tight md:text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {blog.title}
                </h1>

                <div className={`mb-8 flex flex-wrap items-center gap-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <time dateTime={blog.date ? new Date(blog.date).toISOString() : undefined}>
                            {blog.date ? new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </time>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye size={18} />
                        <span>{Number(views || 0).toLocaleString()} views</span>
                    </div>
                </div>

                {blog.image && (
                    <div className="mb-10 aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                        <img
                            src={getImageUrl(blog.image)}
                            alt={blog.imageAlt || blog.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <h2 className={`mb-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</h2>
                <div
                    className={`prose prose-lg max-w-none leading-relaxed ${isDark ? 'prose-invert' : ''}`}
                    dangerouslySetInnerHTML={{ __html: blog.content || blog.description || '' }}
                />

                {keywords.length > 0 && (
                    <section className="mt-10">
                        <h2 className={`mb-3 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Keywords</h2>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className={`rounded-full px-3 py-1 text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </motion.article>
        </main>
    );
};

export default BlogDetail;
