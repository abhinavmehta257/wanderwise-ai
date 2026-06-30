import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

const DataStorage = () => {
  return (
    <LegalPageLayout title="Data Storage & Use" lastUpdated="June 27, 2025" path="/data-storage">
      <p>
        This page describes what data Wanderwise AI collects, where it is stored, how long we keep
        it, and how it is used. For broader privacy rights and legal terms, see our{' '}
        <a href="/policies">Privacy Policy</a> and <a href="/terms">Terms of Use</a>.
      </p>

      <h2>Overview</h2>
      <p>
        Wanderwise is a travel itinerary generator. We collect only the information needed to create
        and display your trip. We do not require user accounts, passwords, or payment information.
        We do not collect GPS location or device geolocation data.
      </p>

      <h2>Data We Collect</h2>

      <h3>Information You Provide</h3>
      <ul>
        <li>
          <strong>Destination</strong> — The city or place you want to visit (entered as text, not
          GPS coordinates)
        </li>
        <li>
          <strong>Trip duration</strong> — Number of days (1–30)
        </li>
        <li>
          <strong>Travel dates</strong> — Whether dates are flexible or specific start/end dates
        </li>
        <li>
          <strong>Creator name</strong> (optional) — Displayed on public trip pages if provided
        </li>
        <li>
          <strong>Instagram handle</strong> (optional) — Displayed on public trip pages if provided
        </li>
        <li>
          <strong>Instagram user ID</strong> — Received automatically when you plan a trip via
          Instagram Direct Messages
        </li>
        <li>
          <strong>Chat messages</strong> — Text you send in our experimental chat feature at{' '}
          <a href="/chat">/chat</a>
        </li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Anonymous web session ID</strong> — A randomly generated identifier
          (e.g. <code>web:timestamp-random</code>) assigned when you submit a trip from the website
          without an Instagram link
        </li>
        <li>
          <strong>Server and usage logs</strong> — Standard web server data such as IP address,
          browser type, pages visited, and timestamps, collected by our hosting provider
        </li>
        <li>
          <strong>OpenAI thread ID</strong> — Stored in an HttpOnly cookie for chat session
          continuity
        </li>
      </ul>

      <h2>Where Data Is Stored</h2>

      <h3>MongoDB (Persistent Storage)</h3>
      <p>
        Completed trip itineraries are stored in a MongoDB database. Each trip record includes:
      </p>
      <ul>
        <li>Unique slug and title</li>
        <li>Destination and number of days</li>
        <li>Full AI-generated itinerary (JSON)</li>
        <li>Destination cover image URL (sourced from Unsplash)</li>
        <li>Date preferences and optional start/end dates</li>
        <li>Optional creator name, Instagram handle, and Instagram user ID</li>
        <li>Creation timestamp</li>
      </ul>
      <p>
        Trip pages are publicly accessible via their unique URL (e.g.{' '}
        <code>/trip/your-trip-slug</code>). Anyone with the link can view the itinerary.
      </p>

      <h3>Upstash Redis (Temporary Storage)</h3>
      <p>
        Short-lived session data is stored in Upstash Redis with automatic expiration (typically
        24 hours):
      </p>
      <ul>
        <li>
          <strong>thread:{'{user_id}'}</strong> — OpenAI conversation thread IDs for assistant
          chat sessions
        </li>
        <li>
          <strong>pending_trip:{'{instagramUserId}'}</strong> — In-progress trip form data during
          the Instagram DM planning flow
        </li>
        <li>
          <strong>lock:{'{user_id}'}</strong> — Short-lived locks to prevent duplicate itinerary
          generation requests
        </li>
      </ul>

      <h3>Browser Cookies</h3>
      <ul>
        <li>
          <strong>threadId</strong> — HttpOnly cookie for chat session persistence (see our{' '}
          <a href="/cookies">Cookie Policy</a>)
        </li>
      </ul>

      <h2>How We Use Your Data</h2>
      <ul>
        <li>Generate personalized travel itineraries using OpenAI</li>
        <li>Display and share your trip on public trip pages</li>
        <li>Deliver itinerary links via Instagram Direct Messages</li>
        <li>Maintain chat conversation context in the experimental chat feature</li>
        <li>Prevent duplicate or abusive generation requests</li>
        <li>Improve and maintain the Service</li>
        <li>Display relevant advertisements via Google AdSense</li>
      </ul>

      <h2>Third-Party Data Sharing</h2>
      <p>We share data with the following service providers solely to operate the Service:</p>
      <ul>
        <li>
          <strong>OpenAI</strong> — Trip preferences and chat messages are sent to OpenAI&apos;s API
          to generate itineraries and chat responses. Subject to{' '}
          <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
            OpenAI&apos;s Privacy Policy
          </a>
        </li>
        <li>
          <strong>Meta (Instagram)</strong> — Instagram user IDs and message content for DM-based
          trip planning. Subject to{' '}
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
            Meta Privacy Policy
          </a>
        </li>
        <li>
          <strong>Unsplash</strong> — Destination name sent to fetch cover images
        </li>
        <li>
          <strong>OpenStreetMap Nominatim</strong> — Place search queries for destination
          autocomplete (sent server-side)
        </li>
        <li>
          <strong>Google AdSense</strong> — Ad serving on public pages; may use cookies for ad
          personalization
        </li>
        <li>
          <strong>MongoDB Atlas / Upstash</strong> — Cloud database and cache hosting providers
        </li>
      </ul>
      <p>We do not sell your personal data to third parties.</p>

      <h2>Data Retention</h2>
      <ul>
        <li>
          <strong>Trip itineraries (MongoDB)</strong> — Retained indefinitely unless you request
          deletion. Public trip pages remain accessible until removed.
        </li>
        <li>
          <strong>Redis session data</strong> — Automatically deleted after approximately 24 hours
          (or sooner for generation locks).
        </li>
        <li>
          <strong>Chat thread cookie</strong> — Persists in your browser until you clear cookies or
          it expires.
        </li>
        <li>
          <strong>Server logs</strong> — Retained according to our hosting provider&apos;s standard
          log retention policies.
        </li>
      </ul>

      <h2>Your Rights &amp; Choices</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Request access to data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your trip data or associated identifiers</li>
        <li>Object to certain processing of your data</li>
      </ul>
      <p>
        To exercise any of these rights, email us at{' '}
        <a href="mailto:abhinavmehtadeveloper@gmail.com">abhinavmehtadeveloper@gmail.com</a> with
        the trip URL or Instagram handle associated with your request. We will respond within a
        reasonable timeframe.
      </p>
      <p>
        You can also clear the chat session cookie through your browser settings at any time.
      </p>

      <h2>Data Security</h2>
      <p>
        We use industry-standard measures to protect data in transit (HTTPS) and at rest. API
        endpoints are protected by authentication keys. However, no method of electronic storage or
        transmission is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>International Data Transfers</h2>
      <p>
        Our service providers (OpenAI, MongoDB, Upstash, Meta, Google) may process data in the
        United States or other countries. By using Wanderwise, you consent to the transfer of your
        data to these jurisdictions, which may have different data protection laws than your country.
      </p>

      <h2>Changes to This Page</h2>
      <p>
        We may update this page as our data practices evolve. Check back periodically for changes.
        The &quot;Last updated&quot; date at the top indicates the latest revision.
      </p>

      <h2>Contact Us</h2>
      <p>For questions about data storage and use, contact us at:</p>
      <ul>
        <li>
          Email:{' '}
          <a href="mailto:abhinavmehtadeveloper@gmail.com">abhinavmehtadeveloper@gmail.com</a>
        </li>
      </ul>
    </LegalPageLayout>
  );
};

export default DataStorage;
