/**
 * Runtime environment validation.
 * Logs warnings for missing optional vars and throws for critical ones
 * (only when actually needed — not at import time).
 */

interface EnvConfig {
  // Database
  MONGODB_URI: string | undefined;
  // Email
  SMTP_HOST: string | undefined;
  SMTP_PORT: string | undefined;
  SMTP_USER: string | undefined;
  SMTP_PASS: string | undefined;
  CONTACT_EMAIL: string | undefined;
  // Site
  NEXT_PUBLIC_SITE_URL: string | undefined;
}

function getEnv(): EnvConfig {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

let validated = false;

/**
 * Call once during app startup (e.g., in a route handler) to log
 * any missing env vars. Does NOT throw — the app degrades gracefully.
 */
export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const env = getEnv();
  const warnings: string[] = [];

  if (!env.MONGODB_URI) {
    warnings.push('MONGODB_URI is missing — API will use in-memory fallback data');
  }

  const smtpVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const;
  const missingSmtp = smtpVars.filter((v) => !env[v]);
  if (missingSmtp.length > 0) {
    warnings.push(`${missingSmtp.join(', ')} missing — email notifications disabled`);
  }

  if (!env.NEXT_PUBLIC_SITE_URL) {
    warnings.push('NEXT_PUBLIC_SITE_URL is missing — using fallback URL for sitemap/SEO');
  }

  if (warnings.length > 0) {
    console.warn(
      `\n⚠️  Environment warnings:\n${warnings.map((w) => `   • ${w}`).join('\n')}\n`,
    );
  }
}
