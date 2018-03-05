const assert = require('assert')
const request = require('supertest')
const appCreator = require('../lib')

describe('3dtoolkit-signal', () => {
    describe('http', () => {
        it('should support heartbeat', (done) => {
            const app = appCreator({
                heartbeatEnabled: true,
                authEnabled: false,
                loggingEnabled: false
            })

            // manually add a peer so heartbeat can work
            const peerId = app.peerList.addPeer('testPeer', {})

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
            const peerId = app.peerList.addPeer('testPeer', {})

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
            const peerId = app.peerList.addPeer('testPeer', {})

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
            const peerId = app.peerList.addPeer('testPeer', {})

            request(app)
                .put(`/capacity?peer_id=${peerId}&value=1`)
                .expect(404, done)
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
            const peerId = app.peerList.addPeer('testPeer', {})

            // expected to fail, which will generated passport-azure-ad logging messages
            request(app)
                .get('/sign_in?peer_name=testName')
                .expect(401, done)
        })
    })
})