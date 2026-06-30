import Head from 'next/head';
import PropTypes from 'prop-types';
import {
  buildCanonicalUrl,
  buildDefaultOgImageUrl,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../../lib/seo';

export default function SeoHead({
  title,
  description,
  path = '',
  ogImage,
  ogType = 'website',
  children,
}) {
  const canonical = buildCanonicalUrl(path);
  const image = ogImage || buildDefaultOgImageUrl({ title, description });
  const pageTitle = `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {children}
    </Head>
  );
}

SeoHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  children: PropTypes.node,
};
