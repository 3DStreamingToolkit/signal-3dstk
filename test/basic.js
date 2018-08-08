const assert = require('assert')
const request = require('supertest')
const appCreator = require('../lib')

describe('3dtoolkit-signal', () => {
    describe('http', () => {
        it('should support publisher', (done) => {
            const app = appCreator({
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false,
                publishState: true
            })

            process.env.WEBRTC_PUBLISH_URI = "http://example.com"

            app._publisher.on('update', () => {
                process.env.WEBRTC_PUBLISH_URI = null
                done()
            })
            app.peerList.emit('addPeer:post', {})
        })
        it('should support heartbeat', (done) => {
            const app = appCreator({
                heartbeatEnabled: true,
                authEnabled: false,
                loggingEnabled: false
            })

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', {}, {})

            request(app)
                .get(`/heartbeat?peer_id=${peerId}`)
                .expect(200)
                .then(() => {
                    // stop the gc so this test can exit cleanly
                    app.peerList.cancelGc()
                })
                .then(done,done)
        })

        it('should support no heartbeat', (done) => {
            const app = appCreator({
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            })

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', {}, {})

            request(app)
                .get(`/heartbeat?peer_id=${peerId}`)
                .expect(404, done)
        })

        it('should support capacity', (done) => {
            const app = appCreator({
                capacityEnabled: true,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            })

            // manually add a peer so capacity can work
            const peerId = app.peerList.addPeer('testPeer', {}, {})

            request(app)
                .put(`/capacity?peer_id=${peerId}&value=10`)
                .expect(200, done)
        })

        it('should support no capacity', (done) => {
            const app = appCreator({
                capacityEnabled: false,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false
            })

            // manually add a peer so capacity can work
            const peerId = app.peerList.addPeer('testPeer', {}, {})

            request(app)
                .put(`/capacity?peer_id=${peerId}&value=1`)
                .expect(404, done)
        })

        it('should support peer recognition', () => {
            const app = appCreator({
                capacityEnabled: false,
                heartbeatEnabled: false,
                authEnabled: false,
                loggingEnabled: false,
                recognitionEnabled: true
            })

            const clientId1 = app.peerList.addPeer('client1', {}, {})
            const clientId2 = app.peerList.addPeer('client2', {}, {})
            const clientId3 = app.peerList.addPeer('client3', {}, {})
            const serverId1 = app.peerList.addPeer('server1', {}, {})
            const serverId2 = app.peerList.addPeer('server2', {}, {})
            const serverId3 = app.peerList.addPeer('server3', {}, {})

            //Make sure only 3 peers (and the empty string) are returned
            //This is true for each client
            assert.equal(app.peerList.dataFor(clientId1).split("\n").length, 4)
            assert.equal(app.peerList.dataFor(clientId2).split("\n").length, 4)
            assert.equal(app.peerList.dataFor(clientId3).split("\n").length, 4)

            //Make sure these are the same lists being returned 
            assert.equal(app.peerList.dataFor(clientId1), app.peerList.dataFor(clientId2))
            assert.equal(app.peerList.dataFor(clientId1), app.peerList.dataFor(clientId3))
            
            //Make sure there are no clients in the returned peer list
            assert(!app.peerList.dataFor(clientId1).includes("client"))
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
            })

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', {}, {})

            // expected to fail, which will generated passport-azure-ad logging messages
            request(app)
                .get('/sign_in?peer_name=testName')
                .expect(401, done)
        })
    })
})
