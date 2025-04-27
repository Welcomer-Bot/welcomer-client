// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://1e4ac005f063c4e051f529596491a4b8@o4508545743388672.ingest.de.sentry.io/4508875963826256",
  enabled: process.env.NODE_ENV === "production",
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  integrations: [nodeProfilingIntegration()],
  // Tracing must be enabled for profiling to work
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: "trace",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
