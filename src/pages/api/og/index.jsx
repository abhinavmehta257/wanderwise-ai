import { ImageResponse } from '@vercel/og';
import { BRAND, OG_CACHE_HEADERS, OG_SIZE } from '../../../../lib/og/brand';
import { getOgFonts } from '../../../../lib/og/fonts';
import { SITE_NAME, SITE_TAGLINE } from '../../../../lib/seo';

export const config = {
  runtime: 'edge',
};

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function BrandMark({ size = 36 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: BRAND.white,
          fontSize: size * 0.55,
          fontWeight: 700,
        }}
      >
        W
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: size * 0.85,
          fontWeight: 700,
          color: BRAND.white,
          letterSpacing: '-0.02em',
        }}
      >
        <span>Wander</span>
        <span style={{ color: BRAND.primary }}>wise</span>
      </div>
    </div>
  );
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get('title') || 'Explore Destinations', 60);
  const description = truncate(
    searchParams.get('description') ||
      'Discover trips to unique destinations we have planned with AI.',
    120
  );

  const fonts = await getOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: `linear-gradient(145deg, ${BRAND.dark} 0%, #0f1418 45%, ${BRAND.primaryDark} 100%)`,
          fontFamily: 'Inter',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND.primary}44 0%, transparent 70%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND.primary}33 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        <BrandMark size={40} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: BRAND.white,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.45,
              maxWidth: 880,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 22, color: BRAND.primary, fontWeight: 700 }}>
            {SITE_TAGLINE}
          </div>
          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)' }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts,
      headers: OG_CACHE_HEADERS,
    }
  );
}
