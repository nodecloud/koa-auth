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
                .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
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
                .set('Accept', 'application/json')
                .expect(401);
        });
    })
});


