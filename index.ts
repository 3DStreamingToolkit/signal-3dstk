#!/usr/bin/env node
import appCreator from "./lib";
import { optIsFalsey } from "./lib/utils";

const app = appCreator({
    authAppId: process.env.WEBRTC_AUTH_APP_ID,
    authB2cAppId: process.env.WEBRTC_AUTH_B2C_APP_ID,
    authB2cPolicyName: process.env.WEBRTC_AUTH_B2C_POLICY_NAME,
    authB2cTenantId: process.env.WEBRTC_AUTH_B2C_TENANT_ID,
    authEnabled: !optIsFalsey(process.env.WEBRTC_AUTH_ENABLED),
    authTenantId: process.env.WEBRTC_AUTH_TENANT_ID,
    capacityEnabled: !optIsFalsey(process.env.WEBRTC_CAPACITY_ENABLED),
    enableCors: !optIsFalsey(process.env.WEBRTC_CORS),
    heartbeatEnabled: !optIsFalsey(process.env.WEBRTC_HEARTBEAT_ENABLED),
    heartbeatGcMs: !optIsFalsey(process.env.WEBRTC_HEARTBEAT_GC_MS),
    heartbeatMs: parseInt(process.env.WEBRTC_HEARTBEAT_MS, 10),
    loggingEnabled: !optIsFalsey(process.env.WEBRTC_SIGNAL_LOGGING),
    port: parseInt(process.env.PORT, 10),
    publishState: !optIsFalsey(process.env.WEBRTC_PUBLISH_STATE),
    recognitionEnabled: !optIsFalsey(process.env.WEBRTC_RECOGNITION_ENABLED),
    trustProxy: !optIsFalsey(process.env.WEBRTC_TRUST_PROXY),
});

app.listen(process.env.PORT || 3000);
