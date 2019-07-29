import * as assert from "assert";
import * as request from "supertest";
import appCreator from "../lib"
import { IPeerRequest, IPeerResponse } from "webrtc-signal-http";

const emptyRes = {} as IPeerResponse;
const emptyReq = {} as IPeerRequest;

describe('3dtoolkit-signal', () => {
    describe('http', () => {
        it('should support publisher', (done) => {
            const app = appCreator({
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false,
                publishState: true
            });

            process.env.WEBRTC_PUBLISH_URI = "http://example.com";

            app._publisher.on('update', () => {
                process.env.WEBRTC_PUBLISH_URI = null;
                done();
            })
            app.peerList.emit('addPeer:post', {});
        })
        it('should support heartbeat', (done) => {
            const app = appCreator({
                heartbeatEnabled: true,
                authEnabled: false,
                loggingEnabled: false
            }) as unknown as {peerList: {addPeer: any, cancelGc: any}};
            
            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', emptyRes, emptyReq);
            request(app)
            .get(`/heartbeat?peer_id=${peerId}`)
            .expect(200)
            .then(() => {
                // stop the gc so this test can exit cleanly
                app.peerList.cancelGc();
            })
            .then(done,done);
        })

        it('should support no heartbeat', (done) => {
            const app = appCreator({
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            });

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', emptyRes, emptyReq);

            request(app)
                .get(`/heartbeat?peer_id=${peerId}`)
                .expect(404, done);
        })

        it('should support capacity', (done) => {
            const app = appCreator({
                capacityEnabled: true,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            });

            // manually add a peer so capacity can work
            const peerId = app.peerList.addPeer('testPeer', emptyRes, emptyReq);

            request(app)
                .put(`/capacity?peer_id=${peerId}&value=10`)
                .expect(200, done)
        });

        it('should support no capacity', (done) => {
            const app = appCreator({
                capacityEnabled: false,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            });

            // manually add a peer so capacity can work
            const peerId = app.peerList.addPeer('testPeer', emptyRes, emptyReq);

            request(app)
                .put(`/capacity?peer_id=${peerId}&value=1`)
                .expect(404, done);
        })

        it('should support peer recognition', () => {
            const app = appCreator({
                capacityEnabled: false,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false,
                recognitionEnabled: true
            });

            const clientId1 = app.peerList.addPeer('client1', emptyRes, emptyReq);
            const clientId2 = app.peerList.addPeer('client2', emptyRes, emptyReq);
            const clientId3 = app.peerList.addPeer('client3', emptyRes, emptyReq);
            const serverId1 = app.peerList.addPeer('server1', emptyRes, emptyReq);
            const serverId2 = app.peerList.addPeer('server2', emptyRes, emptyReq);
            const serverId3 = app.peerList.addPeer('server3', emptyRes, emptyReq);

            //Make sure only 3 peers (and the empty string) are returned
            //This is true for each client
            assert.equal(app.peerList.dataFor(clientId1).split("\n").length, 4);
            assert.equal(app.peerList.dataFor(clientId2).split("\n").length, 4);
            assert.equal(app.peerList.dataFor(clientId3).split("\n").length, 4);

            //Make sure these are the same lists being returned 
            assert.equal(app.peerList.dataFor(clientId1), app.peerList.dataFor(clientId2));
            assert.equal(app.peerList.dataFor(clientId1), app.peerList.dataFor(clientId3));
            
            //Make sure there are no clients in the returned peer list
            assert(!app.peerList.dataFor(clientId1).includes("client"));
        })

        it('should require auth if enabled', (done) => {
            const app = appCreator({
                heartbeatEnabled: false,
                authEnabled: true,
                authB2cAppId: 'testId',
                authB2cTenantId: 'testId',
                authB2cPolicyName: 'b2c_1_signup',
                authAppId: 'testId',
                authTenantId: 'testId',
                loggingEnabled: false
            });

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', emptyRes, emptyReq);

            // expected to fail, which will generated passport-azure-ad logging messages
            request(app)
                .get('/sign_in?peer_name=testName')
                .expect(401, done);
        })

        it('should not use x-forwarded-for by default', (done) => {
            const app = appCreator({
                loggingEnabled: false,
                trustProxy: false
            });

            request(app)
                .get('/sign_in?peer_name=testName')
                .set('x-forwarded-for', '10.01.10.01')
                .expect(200, () => {
                    assert.notEqual(app.peerList.getPeer(1).ip, '10.01.10.01');
                    done();
                });
        });

        it('should respect x-forwarded-for if told to (v4)', (done) => {
            const app = appCreator({
                loggingEnabled: false,
                trustProxy: true
            });

            request(app)
                .get('/sign_in?peer_name=testName')
                .set('x-forwarded-for', '10.01.10.01')
                .expect(200, () => {
                    assert.equal(app.peerList.getPeer(1).ip, '10.01.10.01');
                    done();
                });
        });

        it('should respect x-forwarded-for if told to (v4, port)', (done) => {
            const app = appCreator({
                loggingEnabled: false,
                trustProxy: true
            });

            request(app)
                .get('/sign_in?peer_name=testName')
                .set('x-forwarded-for', '10.01.10.01:1010')
                .expect(200, () => {
                    assert.equal(app.peerList.getPeer(1).ip, '10.01.10.01')
                    done()
                })
        })

        it('should respect x-forwarded-for if told to (v6)', (done) => {
            const app = appCreator({
                loggingEnabled: false,
                trustProxy: true
            })

            request(app)
                .get('/sign_in?peer_name=testName')
                .set('x-forwarded-for', '::2')
                .expect(200, () => {
                    assert.equal(app.peerList.getPeer(1).ip, '::2')
                    done()
                })
        })
    })
})
