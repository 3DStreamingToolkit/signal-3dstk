import { Express } from "express";
import { IBearerStrategyOption } from "passport-azure-ad";
import { Publisher } from "webrtc-signal-http-publisher";
import { PeerList } from "webrtc-signal-http-ts";

export interface ISignalerOpts {
    port?: number;
    trustProxy?: boolean;
    loggingEnabled: boolean;
    authEnabled?: boolean;
    authB2cTenantId?: string;
    authB2cAppId?: string;
    authB2cPolicyName?: string;
    authAppId?: string;
    authTenantId?: string;
    heartbeatMs?: number;
    heartbeatEnabled?: boolean;
    heartbeatGcMs?: boolean;
    capacityEnabled?: boolean;
    recognitionEnabled?: boolean;
    enableCors?: boolean;
    publishState?: boolean;
}

export interface IPeerBearerStrategyOpts extends IBearerStrategyOption {
    passReqToCallback: boolean;
}

export interface IExpressApp extends Express {
    peerList: PeerList;
    _publisher?: typeof Publisher;
}

export function optIsFalsey(opt: string | boolean) {
    return !opt ||
        opt === "false" ||
        ( typeof(opt) === "string" && opt.toLowerCase() === "false");
}
