import * as express from "express";
import * as expressBunyan from "express-bunyan-logger";
import * as passport from "passport";
import { BearerStrategy, ITokenPayload, VerifyCallback } from "passport-azure-ad";
import * as capacityRouterCreator from "webrtc-signal-http-capacity";
import * as heartbeatRouterCreator from "webrtc-signal-http-heartbeat";
import * as  recognitionRouterCreator from "webrtc-signal-http-peer-identification";
import * as Publisher from "webrtc-signal-http-publisher";
import { IPeerRequest, PeerList, signalRouterCreator } from "webrtc-signal-http-ts";
import { IExpressApp, IPeerBearerStrategyOpts, ISignalerOpts, optIsFalsey } from "./modules";

export default function appCreator(opts: ISignalerOpts) {
    const app = express() as IExpressApp;
    let peerList = new PeerList();

    if (!optIsFalsey(opts.trustProxy)) {
        app.set("trust proxy", true);
        app.use((req: IPeerRequest, res, next) => {
            req.realIp = (req.ip.match(/:/g) || []).length === 1 ? req.ip.substr(0, req.ip.indexOf(":")) : req.ip;
            next();
        });
    }

    // enable logging right away if needed
    // we do this instead of using the webrtc-signal-http logger so we can log the entire request pipeline
    if (!optIsFalsey(opts.loggingEnabled)) {
        app.use(expressBunyan());
    }

    // configure auth if needed
    if (!optIsFalsey(opts.authEnabled)) {
        const b2cStrategy = new BearerStrategy({
            clientID: opts.authB2cAppId,
            identityMetadata: `https://login.microsoftonline.com/${opts.authB2cTenantId}/v2.0/.well-known/openid-configuration`,
            isB2C: true,
            loggingLevel: "warn",
            passReqToCallback: false,
            policyName: opts.authB2cPolicyName,
            validateIssuer: true,
        } as IPeerBearerStrategyOpts, (token: ITokenPayload, done: VerifyCallback) => {
            return done(null, {}, token);
        });

        // we need to rename this strategy because passport uses names as a unique identifier, and we need two of the same type
        b2cStrategy.name = "oauth-bearer-b2c";

        passport.use(b2cStrategy);

        passport.use(new BearerStrategy({
            clientID: opts.authAppId,
            identityMetadata: `https://login.microsoftonline.com/${opts.authTenantId}/.well-known/openid-configuration`,
            isB2C: false,
            loggingLevel: "warn",
            passReqToCallback: false,
            validateIssuer: true,
        } as IPeerBearerStrategyOpts, (token: ITokenPayload, done: VerifyCallback) => {
            return done(null, {}, token);
        }));

        app.use(passport.initialize());

        app.all("*", (req, res, next) => {
            // cors is exempt from authentication
            if (req.method === "OPTIONS") {
                res.set("Access-Control-Allow-Origin", "*");
                res.set("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
                return res.status(200).end();
            }

            // the rest of the stack needs to authenticate
            passport.authorize(["oauth-bearer", "oauth-bearer-b2c"], (err, user, info) => {
                if (!err && user) {
                    next();
                } else {
                    res.status(401).end();
                }
            })(req, res, next);
        });
    }

    // configure heartbeat if needed
    if (!optIsFalsey(opts.heartbeatEnabled)) {
        const heartbeatRouter = heartbeatRouterCreator({
            gcInterval: opts.heartbeatGcMs || 15 * 1000,
            peerList,
            timeoutPeriod: opts.heartbeatMs || 30 * 1000,
        });

        // use the heartbeat peerList instead
        peerList = heartbeatRouter.peerList;

        app.use(heartbeatRouter);
    }

    // configure capacity if needed
    if (!optIsFalsey(opts.capacityEnabled)) {
        const capacityRouter = capacityRouterCreator({
            peerList,
        });

        // use the capacity peer list instead
        peerList = capacityRouter.peerList;

        app.use(capacityRouter);
    }

    // configure peer recognition router if needed
    if (!optIsFalsey(opts.recognitionEnabled)) {
        const recognitionRouter = recognitionRouterCreator({
            peerList,
        });

        // use the recognition peer list instead
        peerList = recognitionRouter.peerList;

        app.use(recognitionRouter);
    }

    // configure the webrtc-signal-http router
    const signalRouter = signalRouterCreator({
        ...opts,
        // we use a predefined peerList in case we need to support heartbeats
        peerList,

        // see above, we use a different logger to capture more scenarios
        enableLogging: false,
    });

    // configure webrtc-signal-http-publisher if needed
    if (!optIsFalsey(opts.publishState)) {
        app._publisher = new Publisher(signalRouter);
    }

    // use webrtc-signal-http router
    app.use(signalRouter);

    // expose the peerList on the app
    app.peerList = peerList;

    // return a configured app, ready to be used
    return app;
}
