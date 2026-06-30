import { ImageResponse } from '@vercel/og';
import { BRAND, OG_CACHE_HEADERS, OG_SIZE } from '../../../../lib/og/brand';
import { fetchTripHeroBackground } from '../../../../lib/og/fetchHeroImage';
import { getOgFonts } from '../../../../lib/og/fonts';

export const config = {
  runtime: 'edge',
};

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get('title') || 'Trip Itinerary', 72);
  const location = truncate(searchParams.get('location') || '', 40);
  const days = searchParams.get('days');
  const image = searchParams.get('image');
  const pathname = searchParams.get('pathname');

  const [fonts, heroBackground] = await Promise.all([
    getOgFonts(),
    fetchTripHeroBackground(request, { image, pathname }),
  ]);

  const durationLabel = days ? `${days}-day trip` : 'Travel itinerary';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: BRAND.dark,
          fontFamily: 'Inter',
          position: 'relative',
        }}
      >
        {heroBackground ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroBackground}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(160deg, ${BRAND.dark} 0%, ${BRAND.primaryDark} 100%)`,
              display: 'flex',
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(15,20,24,0.92) 0%, rgba(15,20,24,0.45) 50%, rgba(15,20,24,0.15) 100%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: '56px 64px',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                background: BRAND.primary,
                color: BRAND.white,
                fontSize: 20,
                fontWeight: 700,
                padding: '8px 18px',
                borderRadius: 999,
              }}
            >
              {durationLabel}
            </div>
            {location ? (
              <div
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  color: BRAND.white,
                  fontSize: 20,
                  fontWeight: 600,
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {location}
              </div>
            ) : null}
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: BRAND.white,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: BRAND.white,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                W
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  fontWeight: 700,
                  color: BRAND.white,
                }}
              >
                <span>Wander</span>
                <span style={{ color: BRAND.primary }}>wise</span>
              </div>
            </div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              AI travel planning
            </div>
          </div>
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
