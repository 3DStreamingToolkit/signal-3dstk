# 3dtoolkit-signal

[![Build Status](https://travis-ci.org/bengreenier/3dtoolkit-signal.svg?branch=master)](https://travis-ci.org/bengreenier/3dtoolkit-signal)

[3dtoolkit](https://github.com/catalystcode/3dtoolkit) webrtc signal implementation, using `http` :satellite_antenna:

![logo gif](./readme_example.gif)

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

## RESTful API

This module makes no functional changes to the base API provided by [webrtc-signal-http](https://github.com/bengreenier/webrtc-signal-http), look at the [docs for that project](https://github.com/bengreenier/webrtc-signal-http#restful-api). However, __this module does require a new header__. When running with this extension (or a downlevel extension) it is required that clients pass a `Authorization` header with a valid `oauth2` token in the value.

## Extension API

To understand the base API provided by [webrtc-signal-http](https://github.com/bengreenier/webrtc-signal-http), look at the [docs for that project](https://github.com/bengreenier/webrtc-signal-http#extension-api). This documents the javascript API this extension adds. :sparkles:

### module.exports

> This is the exported behavior, you access it with `require('webrtc-signal-http-heartbeat')`

[Function] - takes a [HeartbeatOpts](#heartbeatopts) indicating configuration options. __Returns__ an [express](https://expressjs.com/) `router` object.

#### router.peerList

[Object] - can be used to retrieve a `PeerList` from the express `router`. __Returns__ a [TimeoutPeerList](#timeoutpeerlist) object.

### TimeoutPeerList

[Class] - Extends [PeerList](https://github.com/bengreenier/webrtc-signal-http/#peerlist) with the ability to have peers timeout.

#### refreshPeerTimeout

[Function] - Takes `id` (a Number). Resets the timeout on a peer, keeping it active. __Returns__ nothing.

#### cancelGc

[Function] - Takes nothing. Stops the GC from running. __Returns__ nothing.

### HeartbeatOpts

[Object] - represents the options that can be given to the heartbeat creator

#### timeoutPeriod

[Number] - the timeout period in `ms` after which a client will be marked as stale, and cleaned up when the "gc" runs. Default `30s`

#### gcInterval

[Number] - the interval in `ms` at which the gc will run, removing stale clients. Default `15s`

## License

MIT