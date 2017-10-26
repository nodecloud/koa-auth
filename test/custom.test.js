const request = require('supertest');
const assert = require('assert');

const support = require('./support');
const koaAuth = require('../index');

let mark = false;
const app = support.getApp();
app.use(koaAuth({
    authorFunc: function () {
        return mark;
    },
    invalidCallback: function (ctx, next) {
        ctx.status = 401;
        ctx.body = {
            message: 'Invalid request'
        };
    },
    exceptUrls: [],
    apiRegxStr: '^\/api\/.+',
    redirectUrl: '/login2'
}));
let server = support.getServer(app);

describe('test/custom.test.js', () => {
    describe('use', () => {
        it('should return 302 status with correct url', async () => {
            return request(server)
                .get('/')
                .set('Accept', 'text/html')
                .expect(302)
                .expect('location', '/login2');
        });
        it('should return 401 status', async () => {
            return request(server)
                .get('/login')
                .expect(401)
        });
        it('should return 200 status', async () => {
            return request(server)
                .get('/api/hello')
                .set('Accept', 'text/html')
                .expect(401);
        });
        it('should return correct body', async () => {
            mark = true;
            return request(server)
                .get('/api/hello')
                .expect(200)
                .then(response => {
                    assert.equal(response.body.message, 'hello world');
                });
        });
    })
});


