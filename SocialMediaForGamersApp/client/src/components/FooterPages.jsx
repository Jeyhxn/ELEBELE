function StaticPage({ title, children }) {
  return (
    <div className="static-page">
      <h1 className="static-page-title">{title}</h1>
      <div className="static-page-body">{children}</div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>Last updated: January 1, 2025</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, post content, or contact support. This includes your username, email address, and any content you submit.</p>
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to operate and improve Gameily, personalize your experience, send you updates, and respond to your comments and questions.</p>
      <h2>Information Sharing</h2>
      <p>We do not sell or share your personal information with third parties except as described in this policy or with your consent.</p>
      <h2>Data Retention</h2>
      <p>We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account at any time through Settings.</p>
      <h2>Cookies</h2>
      <p>We use cookies and similar tracking technologies to improve your experience. See our <a href="/cookies">Cookie Policy</a> for details.</p>
      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at privacy@gameily.com.</p>
    </StaticPage>
  )
}

export function LegalPage() {
  return (
    <StaticPage title="Legal">
      <h2>Terms of Service</h2>
      <p>By using Gameily, you agree to these terms. You must be at least 13 years old to use this service.</p>
      <h2>User Content</h2>
      <p>You retain ownership of content you post, but grant Gameily a license to display and distribute it within the platform. You are responsible for ensuring your content does not violate applicable laws or the rights of others.</p>
      <h2>Prohibited Conduct</h2>
      <p>You may not use Gameily to harass others, distribute harmful content, attempt to gain unauthorized access to systems, or violate any applicable laws.</p>
      <h2>Intellectual Property</h2>
      <p>Gameily and its original content, features, and functionality are owned by Gameily and are protected by international copyright, trademark, and other laws.</p>
      <h2>Disclaimer</h2>
      <p>Gameily is provided "as is" without any warranties. We are not liable for any damages arising from your use of the service.</p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of the jurisdiction in which Gameily operates, without regard to conflict of law principles.</p>
    </StaticPage>
  )
}

export function AccessibilityPage() {
  return (
    <StaticPage title="Accessibility">
      <p>Gameily is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.</p>
      <h2>Conformance Status</h2>
      <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible to people with disabilities.</p>
      <h2>Keyboard Navigation</h2>
      <p>All core features of Gameily are accessible via keyboard. You can navigate the site using Tab, Enter, and arrow keys.</p>
      <h2>Screen Readers</h2>
      <p>We design our interface to be compatible with screen readers. Images include alternative text, and interactive elements have descriptive labels.</p>
      <h2>Text Sizing</h2>
      <p>Text on Gameily can be resized using your browser's zoom feature without loss of content or functionality.</p>
      <h2>Feedback</h2>
      <p>We welcome feedback on the accessibility of Gameily. Please contact us at accessibility@gameily.com if you experience barriers.</p>
    </StaticPage>
  )
}

export function TermsPage() {
  return (
    <StaticPage title="Subscriber Agreement">
      <p>This Subscriber Agreement ("Agreement") governs your use of Gameily. By creating an account, you agree to be bound by this Agreement.</p>
      <h2>Account Registration</h2>
      <p>You must provide accurate and complete information when creating your account and keep it up to date. You are responsible for maintaining the confidentiality of your password.</p>
      <h2>Acceptable Use</h2>
      <p>You agree to use Gameily only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the service.</p>
      <h2>Community Standards</h2>
      <p>All users must follow Gameily's community guidelines. Posts or comments that are abusive, hateful, or spam may be removed and accounts suspended.</p>
      <h2>Modifications</h2>
      <p>We may modify this Agreement at any time. Continued use of Gameily after changes constitutes acceptance of the new terms.</p>
      <h2>Termination</h2>
      <p>We reserve the right to suspend or terminate accounts that violate this Agreement, at our sole discretion.</p>
    </StaticPage>
  )
}

export function RefundsPage() {
  return (
    <StaticPage title="Refunds">
      <p>This page describes Gameily's refund policy for any paid features or subscriptions.</p>
      <h2>Free Tier</h2>
      <p>The core Gameily experience is free. No payment is required to browse, post, comment, or interact with communities.</p>
      <h2>Premium Features</h2>
      <p>If Gameily offers paid subscriptions or features in the future, purchases may be eligible for a refund within 14 days if the feature has not been significantly used.</p>
      <h2>How to Request a Refund</h2>
      <p>To request a refund, contact our support team at support@gameily.com with your account email and a description of the purchase. We process refund requests within 5–7 business days.</p>
      <h2>Exceptions</h2>
      <p>Refunds will not be issued for accounts that have been suspended or terminated due to violations of our Terms of Service.</p>
      <h2>Contact</h2>
      <p>For any billing questions, reach out to billing@gameily.com.</p>
    </StaticPage>
  )
}

export function CookiesPage() {
  return (
    <StaticPage title="Cookie Policy">
      <p>This Cookie Policy explains how Gameily uses cookies and similar technologies when you visit our platform.</p>
      <h2>What Are Cookies</h2>
      <p>Cookies are small text files stored on your device by your browser. They help us remember your preferences and understand how you use Gameily.</p>
      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>These cookies are necessary for Gameily to function. They enable core features such as authentication and session management.</p>
      <h3>Analytics Cookies</h3>
      <p>We use analytics cookies to understand how users interact with Gameily, helping us improve the platform.</p>
      <h3>Preference Cookies</h3>
      <p>These cookies remember your settings and preferences, such as your display theme and notification choices.</p>
      <h2>Managing Cookies</h2>
      <p>You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of Gameily.</p>
      <h2>Contact</h2>
      <p>For questions about our use of cookies, contact privacy@gameily.com.</p>
    </StaticPage>
  )
}

export function AboutPage() {
  return (
    <StaticPage title="About Gameily">
      <p>Gameily is a social platform built for gamers — a place to discover games, share opinions, join communities, and connect with other players who share your passion.</p>
      <h2>Our Mission</h2>
      <p>We believe gaming is more than a hobby — it's a culture. Gameily's mission is to bring that culture together in one place, giving every gamer a voice and a community to call home.</p>
      <h2>What We Offer</h2>
      <ul>
        <li>Browse and discover thousands of games across all platforms and genres.</li>
        <li>Join communities built around the games you love.</li>
        <li>Post, comment, and vote on content with fellow gamers.</li>
        <li>Stay up to date with news, reviews, and hot takes from the community.</li>
      </ul>
      <h2>Our Story</h2>
      <p>Gameily started as a passion project by gamers who wanted a better way to stay connected with the games and communities they cared about. It has grown into a full-featured platform serving players across every genre and platform.</p>
      <h2>Get in Touch</h2>
      <p>Have questions or feedback? We'd love to hear from you. Reach out at hello@gameily.com.</p>
    </StaticPage>
  )
}

export function CareersPage() {
  return (
    <StaticPage title="Jobs at Gameily">
      <p>We're always looking for talented, passionate people to join the Gameily team. If you love games and want to build something meaningful, we'd love to talk.</p>
      <h2>Our Culture</h2>
      <p>We're a small, dedicated team that moves fast, ships often, and cares deeply about the gamer community. We value autonomy, creativity, and collaboration.</p>
      <h2>Open Positions</h2>
      <div className="static-job-card">
        <h3>Full-Stack Developer</h3>
        <p>Help us build and scale the Gameily platform. Experience with React and .NET preferred.</p>
        <span className="static-job-tag">Remote · Full-time</span>
      </div>
      <div className="static-job-card">
        <h3>Community Manager</h3>
        <p>Grow and support our gaming communities. Strong communication skills and a love of games required.</p>
        <span className="static-job-tag">Remote · Full-time</span>
      </div>
      <div className="static-job-card">
        <h3>UI/UX Designer</h3>
        <p>Design beautiful, intuitive experiences for gamers. Portfolio required.</p>
        <span className="static-job-tag">Remote · Full-time</span>
      </div>
      <h2>How to Apply</h2>
      <p>Send your resume and a short note about yourself to careers@gameily.com.</p>
    </StaticPage>
  )
}

export function DevelopersPage() {
  return (
    <StaticPage title="Developers">
      <p>Build on top of Gameily with our developer tools and API. Whether you're creating tools for gamers or integrating game data into your app, we have you covered.</p>
      <h2>Gameily API</h2>
      <p>The Gameily API gives you programmatic access to games, communities, posts, and more. Use it to build apps, bots, or integrations.</p>
      <h2>Getting Started</h2>
      <p>To get started with the API, create a developer account and generate an API key from your settings dashboard. Full documentation is available at <code>api.gameily.com/docs</code>.</p>
      <h2>Rate Limits</h2>
      <p>Free tier API access is limited to 1,000 requests per day. Higher limits are available for verified developers and partners.</p>
      <h2>Open Source</h2>
      <p>Parts of Gameily's tooling are open source. Visit our GitHub to contribute or explore our repositories.</p>
      <h2>Developer Support</h2>
      <p>For API questions or issues, contact developers@gameily.com or join our developer Discord channel.</p>
    </StaticPage>
  )
}

export function DistributionPage() {
  return (
    <StaticPage title="Distribution">
      <p>Gameily partners with publishers, studios, and indie developers to help bring games and gaming content to our community.</p>
      <h2>List Your Game</h2>
      <p>Are you a developer or publisher? Get your game listed on Gameily to reach a passionate community of players. We support games across all platforms and genres.</p>
      <h2>Content Distribution</h2>
      <p>Distribute news, trailers, updates, and announcements directly to relevant Gameily communities. Reach targeted audiences who are already interested in your genre.</p>
      <h2>Partnership Benefits</h2>
      <ul>
        <li>Verified game listings with rich metadata.</li>
        <li>Direct community engagement with your player base.</li>
        <li>Analytics dashboard to track community activity around your titles.</li>
        <li>Featured placement opportunities on the Gameily homepage.</li>
      </ul>
      <h2>Get in Touch</h2>
      <p>To discuss distribution or partnership opportunities, contact partners@gameily.com.</p>
    </StaticPage>
  )
}

export function SupportPage() {
  return (
    <StaticPage title="Support">
      <p>Need help with Gameily? We're here for you. Browse common topics below or contact us directly.</p>
      <h2>Account Help</h2>
      <ul>
        <li><strong>Forgot your password?</strong> Use the "Forgot password" link on the login page to reset it.</li>
        <li><strong>Change your username or email?</strong> Go to Settings → Account.</li>
        <li><strong>Delete your account?</strong> Go to Settings → Danger Zone.</li>
      </ul>
      <h2>Community & Posts</h2>
      <ul>
        <li><strong>Report a post or comment?</strong> Use the report button on any post or comment.</li>
        <li><strong>Mute a community?</strong> Go to Settings → Muted to hide communities from your feed.</li>
        <li><strong>Notifications not working?</strong> Check Settings → Notifications to review your preferences.</li>
      </ul>
      <h2>Technical Issues</h2>
      <p>If you're experiencing a bug or technical problem, please describe the issue and your browser/device and send it to support@gameily.com.</p>
      <h2>Contact Support</h2>
      <p>For anything not covered above, email us at support@gameily.com. We typically respond within 24–48 hours.</p>
    </StaticPage>
  )
}

export function GiftCardsPage() {
  return (
    <StaticPage title="Gift Cards">
      <p>Give the gift of gaming. Gameily Gift Cards let your friends and family unlock premium features and support the platform they love.</p>
      <h2>How It Works</h2>
      <ol>
        <li>Purchase a Gift Card in the amount of your choice.</li>
        <li>The recipient receives a unique redemption code via email.</li>
        <li>They redeem it under Settings → Billing to apply credit to their account.</li>
      </ol>
      <h2>Available Amounts</h2>
      <p>Gift Cards are available in the following amounts: $5, $10, $25, $50.</p>
      <h2>Terms</h2>
      <ul>
        <li>Gift Cards do not expire.</li>
        <li>Gift Cards are non-refundable once purchased.</li>
        <li>Gift Cards can only be redeemed on Gameily and cannot be exchanged for cash.</li>
      </ul>
      <h2>Purchase</h2>
      <p>Gift Card purchasing will be available soon. To be notified when they launch, contact us at hello@gameily.com.</p>
    </StaticPage>
  )
}
