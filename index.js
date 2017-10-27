const AuthError = require('yan-error-class').AuthError;

const defaultAuthorization = function (ctx) {
    return ctx && ctx['session'] && (typeof ctx['session']['user'] === 'object');
};

const defaultInvalidCallback = function () {
    throw new AuthError('未登录或登录过期，请重新登录');
};

const defaultOptions = {
    authorFunc: defaultAuthorization,
    invalidCallback: defaultInvalidCallback,
    exceptUrls: ['/login', '/logout'],
    redirectUrl: '/login'
};

module.exports = function (options = {}) {
    const authorFunc = getFunction(options.authorFunc) || defaultOptions.authorFunc;
    const invalidCallback = getFunction(options.invalidCallback) || defaultOptions.invalidCallback;
    const exceptUrls = getArray(options.exceptUrls) || defaultOptions.exceptUrls;
    const apiRegxStr = getString(options.apiRegxStr);
    const redirectUrl = getString(options.redirectUrl) || defaultOptions.redirectUrl;

    return async function koaAuth(ctx, next) {
        const isLogin = await authorFunc(ctx);

        if (isLogin) {
            return next();
        }

        if (exceptUrls.indexOf(ctx.url) !== -1) {
            return next();
        }

        if (apiRegxStr && new RegExp(apiRegxStr).test(ctx.url)) {
            return invalidCallback(ctx, next);
        } else if (!ctx.accepts('html')) {
            console.log('ddd');
            return invalidCallback(ctx, next);
        }
        ctx.redirect(redirectUrl);
    }
};

function getFunction(func) {
    return typeof func === 'function' ? func : false;
}

function getArray(arr) {
    return Array.isArray(arr) ? arr : false;
}

function getString(str) {
    return typeof str === 'string' ? str : false;
}


