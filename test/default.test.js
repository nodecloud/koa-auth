const request = require('supertest');

const support = require('./support');
const koaAuth = require('../index');

const app = support.getApp();
app.use(koaAuth());
let server = support.getServer(app);

describe('test/default.test.js', () => {
    describe('use', () => {
        it('should return 302 status', async () => {
            return request(server)
                .get('/')
                .set('Accept', 'text/html')
                .expect(302);
        });
        it('should return 200 status', async () => {
            return request(server)
                .get('/login')
                .expect(200);
        });
        it('should return 200 status', async () => {
            return request(server)
                .get('/logout')
                .expect(200);
        });
        it('should return 401 status', async () => {
            return request(server)
                .get('/hello')
                .expect(401);
        });
    })
});


