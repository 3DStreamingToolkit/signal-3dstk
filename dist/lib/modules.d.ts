import { IBearerStrategyOption } from "passport-azure-ad";
import { Express } from "express";
import { PeerList } from "webrtc-signal-http-ts";
declare const Publisher: any;
export interface ISignalerOpts {
    trustProxy: boolean;
    loggingEnabled: boolean;
    authEnabled: boolean;
    authB2cTenantId: string;
    authB2cAppId: string;
    authB2cPolicyName: string;
    authAppId: string;
    authTenantId: string;
    heartbeatMs: number;
    heartbeatEnabled: boolean;
    heartbeatGcMs: boolean;
    capacityEnabled: boolean;
    recognitionEnabled: boolean;
    publishState: boolean;
}
export interface IPeerList {
}
export interface IPeerBearerStrategyOpts extends IBearerStrategyOption {
    passReqToCallback: boolean;
}
export interface IExpressApp extends Express {
    peerList: PeerList;
    _publisher: typeof Publisher;
}
export {};
