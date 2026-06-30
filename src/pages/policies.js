import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

const Policies = () => {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 27, 2025" path="/policies">
      <p>
        This Privacy Policy describes how Wanderwise AI (&quot;Wanderwise,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information when you use our
        website and services, including AI-generated travel itineraries and our Instagram integration.
        By using the Service, you agree to the practices described here.
      </p>

      <h2>Who We Are</h2>
      <p>
        Wanderwise AI is an AI-powered travel itinerary planning service operated from Delhi, India.
        Our website is accessible at{' '}
        <a href="https://wanderwise-ai.vercel.app/" target="_blank" rel="noopener noreferrer">
          wanderwise-ai.vercel.app
        </a>.
      </p>

      <h2>Information We Collect</h2>

      <h3>Information You Provide</h3>
      <ul>
        <li>Destination and trip duration when planning a trip</li>
        <li>Travel date preferences (flexible or specific dates)</li>
        <li>Optional creator name and Instagram handle (shown on public trip pages if provided)</li>
        <li>Messages sent through our chat feature or Instagram Direct Messages</li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <ul>
        <li>
          Anonymous session identifiers for web users (e.g. randomly generated web session IDs)
        </li>
        <li>Instagram user IDs when you interact via Instagram DMs</li>
        <li>
          Standard usage data such as IP address, browser type, pages visited, and timestamps
        </li>
        <li>Chat session cookies (see our <a href="/cookies">Cookie Policy</a>)</li>
      </ul>

      <h3>What We Do Not Collect</h3>
      <ul>
        <li>GPS or device geolocation data</li>
        <li>Email addresses or passwords (we do not offer user accounts)</li>
        <li>Payment or financial information</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Generate and deliver AI-powered travel itineraries</li>
        <li>Publish trips on publicly accessible pages</li>
        <li>Send itinerary links via Instagram Direct Messages</li>
        <li>Maintain chat conversation context</li>
        <li>Prevent abuse and duplicate generation requests</li>
        <li>Display advertisements through Google AdSense</li>
        <li>Improve and maintain the Service</li>
      </ul>

      <h2>How We Share Your Information</h2>
      <p>We share information with service providers who help us operate Wanderwise:</p>
      <ul>
        <li>
          <strong>OpenAI</strong> — to generate itineraries and chat responses
        </li>
        <li>
          <strong>Meta (Instagram)</strong> — to facilitate DM-based trip planning
        </li>
        <li>
          <strong>Unsplash</strong> — to fetch destination cover images
        </li>
        <li>
          <strong>OpenStreetMap Nominatim</strong> — for destination search autocomplete
        </li>
        <li>
          <strong>Google AdSense</strong> — for ad serving on public pages
        </li>
        <li>
          <strong>MongoDB and Upstash</strong> — for data storage and caching
        </li>
      </ul>
      <p>
        We do not sell your personal information. We may disclose information if required by law or
        to protect the rights, safety, and security of Wanderwise and its users.
      </p>
      <p>
        For detailed information about where and how long data is stored, see our{' '}
        <a href="/data-storage">Data Storage &amp; Use</a> page.
      </p>

      <h2>Public Trip Pages</h2>
      <p>
        Trips you create are published on publicly accessible URLs. If you provide an optional name
        or Instagram handle, that information may be visible to anyone who visits your trip page. Do
        not submit information you do not want displayed publicly.
      </p>

      <h2>Cookies and Tracking</h2>
      <p>
        We use a minimal set of cookies, primarily for chat session management. Third-party ad
        providers may also set cookies. See our <a href="/cookies">Cookie Policy</a> for full
        details.
      </p>

      <h2>Data Retention</h2>
      <p>
        Trip itineraries are stored until you request deletion. Temporary session data in Redis
        expires automatically (typically within 24 hours). Server logs are retained per our hosting
        provider&apos;s policies.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the right to access, correct, or delete personal
        data we hold about you. To make a request, email us at{' '}
        <a href="mailto:abhinavmehtadeveloper@gmail.com">abhinavmehtadeveloper@gmail.com</a> with
        the trip URL or Instagram handle associated with your data.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our Service is not directed to children under 13. We do not knowingly collect personal
        information from children under 13. If you believe a child has provided us with personal
        data, please contact us and we will delete it.
      </p>

      <h2>International Transfers</h2>
      <p>
        Your data may be processed in countries other than your own, including the United States,
        where our service providers operate. By using Wanderwise, you consent to such transfers.
      </p>

      <h2>Security</h2>
      <p>
        We use HTTPS and other commercially reasonable measures to protect your data. However, no
        method of transmission or storage is completely secure.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Itineraries may contain links to external websites. We are not responsible for the privacy
        practices of those sites.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes take effect when posted on this
        page with an updated &quot;Last updated&quot; date.
      </p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, contact us at:</p>
      <ul>
        <li>
          Email:{' '}
          <a href="mailto:abhinavmehtadeveloper@gmail.com">abhinavmehtadeveloper@gmail.com</a>
        </li>
      </ul>
    </LegalPageLayout>
  );
};

export default Policies;
