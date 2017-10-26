const koa = require('koa');
const http = require('http');


exports.getApp = function () {
    return new koa();
};

exports.getServer = function (app) {
    app.use(async function controller(ctx, next) {
        switch (ctx.request.path) {
            case '/':
                ctx.body = 'home';
                break;
            case '/login':
                ctx.body = 'login page';
                break;
            case '/logout':
                ctx.body = 'logout';
                break;
            case '/api/hello':
                ctx.body = {
                    message: 'hello world'
                };
                break;
            case '/hello':
                ctx.body = {
                    message: 'hello world'
                };
                break;
            default:
                ctx.status = 404;
                break;
        }
    });
    return http.createServer(app.callback());
};

exports.stop = function (server) {
    if (server) {
        server.close();
    }
};
