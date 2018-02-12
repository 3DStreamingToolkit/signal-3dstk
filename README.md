# 3dtoolkit-signal

[![Build Status](https://travis-ci.org/bengreenier/3dtoolkit-signal.svg?branch=master)](https://travis-ci.org/bengreenier/3dtoolkit-signal)

[3dtoolkit](https://github.com/catalystcode/3dtoolkit) webrtc signal implementation, using `http` :satellite_antenna:


This enables webrtc peer communication across the [3dtoolkit](https://github.com/catalystcode/3dtoolkit) server/client stack. This means that it can be used to faciliate communication between N clients, N peers, and/or both. It uses `http` as a protocol, and can run over `https` as well. Further, authentication can be toggled on, requiring clients to provide valid [OAuth 2.0](https://oauth.net/2/) tokens in order to successfully access the service.

This implementation is built on top of the following components:
    + [express](https://github.com/expressjs/express)
    + [webrtc-signal-http](https://github.com/bengreenier/webrtc-signal-http)
    + [webrtc-signal-http-heartbeat](https://github.com/bengreenier/webrtc-signal-http-heartbeat)
    + [passport](https://github.com/jaredhanson/passport)
    + [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad)

## Getting started

> The RESTful API remains largely unchanged from [webrtc-signal-http](https://github.com/bengreenier/webrtc-signal-http), but is fully documented in OpenAPI format ([raw](./swagger.yml) or [hosted](https://rebilly.github.io/ReDoc/?url=https://raw.githubusercontent.com/bengreenier/3dtoolkit-signal/master/swagger.yml)) for completeness.

This implementation supports the following configuration settings, controlled via environment variables:
    + `PORT` - the port to start the server on
    + `WEBRTC_SIGNAL_LOGGING` - boolean flag indicating if [bunyan](https://github.com/trentm/node-bunyan) logging should be enabled
    + `WEBRTC_HEARTBEAT_ENABLED` - boolean flag indicating if [webrtc-signal-http-heartbeat](https://github.com/bengreenier/webrtc-signal-http-heartbeat) should be enabled
    + `WEBRTC_HEARTBEAT_MS` - (requires heartbeat) number of `ms` after which a client is marked as stale and removed if they have not issued a `GET /heartbeat`
    + `WEBRTC_HEARTBEAT_GC_MS` - (requires heartbeat) number of `ms` at which the stale clients are "garbage collected" and removed
    + `WEBRTC_AUTH_ENABLED` - boolean flag indicating if [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad) should be enabled
    + `WEBRTC_AUTH_B2C_APP_ID` - Azure AD B2C application id. required if auth is enabled
    + `WEBRTC_AUTH_B2C_TENANT_ID` - Azure AD B2C tenant id. required if auth is enabled
    + `WEBRTC_AUTH_B2C_POLICY_NAME` - Azure AD B2C policy name. likely `b2c_1_signup`. required if auth is enabled
    + `WEBRTC_AUTH_APP_ID` - Azure AD application id. required if auth is enabled
    + `WEBRTC_AUTH_TENANT_ID` - Azure AD tenant id. required if auth is enabled
    + `WEBRTC_CAPACITY_ENABLED` - boolean flag indicating if [webrtc-signal-http-capacity](https://github.com/bengreenier/webrtc-signal-http-capacity) should be enabled

## RESTful API

See:

+ [webrtc-signal-http](https://github.com/bengreenier/webrtc-signal-http)
+ [webrtc-signal-http-heartbeat](https://github.com/bengreenier/webrtc-signal-http-heartbeat)
+ [webrtc-signal-http-capacity](https://github.com/bengreenier/webrtc-signal-http-capacity)

Our API is simply those APIs combined, with this added requirement:

All requests must have a valid `Authorization: Bearer <token>` Header if `WEBRTC_AUTH_ENABLED` is `true`. See [the AzureAD docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-code) to learn how to acquire one.

## License

MIT