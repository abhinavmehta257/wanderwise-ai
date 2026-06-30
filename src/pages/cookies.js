import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

const Cookies = () => {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="June 27, 2025" path="/cookies">
      <p>
        This Cookie Policy explains how Wanderwise AI (&quot;Wanderwise,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) uses cookies and similar technologies when you visit our
        website. It should be read alongside our{' '}
        <a href="/policies">Privacy Policy</a>.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help
        websites remember information about your visit, such as preferences or session state.
        Similar technologies include local storage and session identifiers set via HTTP headers.
      </p>

      <h2>How We Use Cookies</h2>
      <p>Wanderwise uses a minimal set of cookies and session technologies:</p>

      <h3>Essential / Functional Cookies</h3>
      <ul>
        <li>
          <strong>threadId</strong> — An HttpOnly cookie set when you use our chat feature
          (<a href="/chat">/chat</a>). It stores an OpenAI conversation thread identifier so your
          chat session can continue across page loads. This cookie is necessary for the chat feature
          to function.
        </li>
      </ul>

      <h3>Third-Party Cookies</h3>
      <p>
        We use Google AdSense to display advertisements on some pages. Google may set cookies or use
        similar technologies to serve ads, measure ad performance, and personalize ad content based on
        your browsing activity. These cookies are controlled by Google, not by Wanderwise.
      </p>
      <p>
        For more information about how Google uses data, visit{' '}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          Google&apos;s Advertising Policies
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>.
      </p>

      <h2>What We Do Not Use</h2>
      <ul>
        <li>We do not use cookies for user account login (we do not offer accounts)</li>
        <li>We do not use analytics cookies such as Google Analytics at this time</li>
        <li>We do not use social media login cookies</li>
      </ul>

      <h2>Session Data in Redis</h2>
      <p>
        In addition to browser cookies, we store short-lived session data on our servers (via
        Upstash Redis) for Instagram trip planning and AI generation locks. This data is not stored
        in your browser but serves a similar session-management purpose. See our{' '}
        <a href="/data-storage">Data Storage &amp; Use</a> page for details.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings. You can typically:
      </p>
      <ul>
        <li>View and delete cookies stored on your device</li>
        <li>Block all cookies or block cookies from specific sites</li>
        <li>Set your browser to notify you when a cookie is being placed</li>
      </ul>
      <p>
        If you disable cookies, some features — particularly the chat feature — may not work
        correctly. Blocking third-party cookies may reduce ad personalization but will not prevent
        ads from being shown.
      </p>
      <p>
        To opt out of personalized Google ads, visit{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. Check this page periodically
        for updates. The &quot;Last updated&quot; date at the top reflects the most recent revision.
      </p>

      <h2>Contact Us</h2>
      <p>If you have questions about our use of cookies, contact us at:</p>
      <ul>
        <li>
          Email:{' '}
          <a href="mailto:abhinavmehtadeveloper@gmail.com">abhinavmehtadeveloper@gmail.com</a>
        </li>
      </ul>
    </LegalPageLayout>
  );
};

export default Cookies;
