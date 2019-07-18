#!/usr/bin/env node
const appCreator = require('./lib');
const app = appCreator({
    port: process.env.PORT,
    loggingEnabled: process.env.WEBRTC_SIGNAL_LOGGING,
    heartbeatEnabled: process.env.WEBRTC_HEARTBEAT_ENABLED,
    heartbeatMs: process.env.WEBRTC_HEARTBEAT_MS,
    heartbeatGcMs: process.env.WEBRTC_HEARTBEAT_GC_MS,
    authEnabled: process.env.WEBRTC_AUTH_ENABLED,
    authB2cAppId: process.env.WEBRTC_AUTH_B2C_APP_ID,
    authB2cTenantId: process.env.WEBRTC_AUTH_B2C_TENANT_ID,
    authB2cPolicyName: process.env.WEBRTC_AUTH_B2C_POLICY_NAME,
    authAppId: process.env.WEBRTC_AUTH_APP_ID,
    authTenantId: process.env.WEBRTC_AUTH_TENANT_ID,
    capacityEnabled: process.env.WEBRTC_CAPACITY_ENABLED,
    recognitionEnabled: process.env.WEBRTC_RECOGNITION_ENABLED,
    publishState: process.env.WEBRTC_PUBLISH_STATE,
    trustProxy: process.env.WEBRTC_TRUST_PROXY,
    enableCors: process.env.WEBRTC_CORS
});
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=index.js.map