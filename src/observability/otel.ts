// Optional OpenTelemetry initialization.
// Activated only if OTEL_ENABLE is '1' or 'true' and NODE_ENV !== 'test'.
// Provides auto-instrumentations + OTLP HTTP trace exporter.

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const enabled = (process.env.OTEL_ENABLE || '').toLowerCase() === '1' || (process.env.OTEL_ENABLE || '').toLowerCase() === 'true';
if (enabled && process.env.NODE_ENV !== 'test') {
  try {
    // Reduce noise unless explicitly asking for debug
    if ((process.env.OTEL_DEBUG || '').toLowerCase() === 'true') {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    }

    const endpointEnv = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';
    // If the user passed a base collector URL without /v1/traces, append it heuristically
    const traceUrl = /\/v1\/traces$/.test(endpointEnv) ? endpointEnv : endpointEnv.replace(/\/$/, '') + '/v1/traces';

    const traceExporter = new OTLPTraceExporter({ url: traceUrl });

    const sdk = new NodeSDK({
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          // future config here
        })
      ]
    });

    (async () => {
      try {
        await sdk.start();
        // eslint-disable-next-line no-console
        console.log(`✅ OpenTelemetry tracing initialisé (OTLP -> ${traceUrl})`);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.warn('⚠️  Échec initialisation OpenTelemetry:', err?.message || err);
      }
    })();

    const shutdown = async () => {
      try { await sdk.shutdown(); } catch { /* ignore */ }
    };
    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('⚠️  OpenTelemetry non initialisé:', (e as any)?.message || e);
  }
}
