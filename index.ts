#!/usr/bin/env node
import appCreator from "./lib";
import { optIsFalsey } from "./lib/modules";

const app = appCreator({
    port: parseInt(process.env.PORT),
    loggingEnabled: !optIsFalsey(process.env.WEBRTC_SIGNAL_LOGGING),
    heartbeatEnabled: !optIsFalsey(process.env.WEBRTC_HEARTBEAT_ENABLED),
    heartbeatMs: parseInt(process.env.WEBRTC_HEARTBEAT_MS),
    heartbeatGcMs: !optIsFalsey(process.env.WEBRTC_HEARTBEAT_GC_MS),
    authEnabled: !optIsFalsey(process.env.WEBRTC_AUTH_ENABLED),
    authB2cAppId: process.env.WEBRTC_AUTH_B2C_APP_ID,
    authB2cTenantId: process.env.WEBRTC_AUTH_B2C_TENANT_ID,
    authB2cPolicyName: process.env.WEBRTC_AUTH_B2C_POLICY_NAME,
    authAppId: process.env.WEBRTC_AUTH_APP_ID,
    authTenantId: process.env.WEBRTC_AUTH_TENANT_ID,
    capacityEnabled: !optIsFalsey(process.env.WEBRTC_CAPACITY_ENABLED),
    recognitionEnabled: !optIsFalsey(process.env.WEBRTC_RECOGNITION_ENABLED),
    publishState: !optIsFalsey(process.env.WEBRTC_PUBLISH_STATE),
    trustProxy: !optIsFalsey(process.env.WEBRTC_TRUST_PROXY),
    enableCors: !optIsFalsey(process.env.WEBRTC_CORS)
})

app.listen(process.env.PORT || 3000)