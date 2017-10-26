'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const AuthError = require('yan-error-class').AuthError;

const defaultOptions = {
    authorFunc: defaultAuthorization,
    invalidCallback: defaultInvalidCallback,
    exceptUrls: ['/login', '/logout'],
    apiRegxStr: '^\/api\/.+',
    redirectUrl: '/login'
};

const defaultAuthorization = function defaultAuthorization(ctx) {
    return ctx && ctx['session'] && typeof ctx['session']['user'] === 'object';
};

const defaultInvalidCallback = function defaultInvalidCallback() {
    throw new AuthError('未登录或登录过期，请重新登录');
};

module.exports = function (options = {}) {
    const authorFunc = getFunction(options.authorFunc) || defaultOptions.authorFunc;
    const invalidCallback = getFunction(options.invalidCallback) || defaultOptions.invalidCallback;
    const exceptUrls = getArray(options.exceptUrls) || defaultOptions.exceptUrls;
    const apiRegxStr = getString(options.apiRegxStr) || defaultOptions.apiRegxStr;
    const redirectUrl = getString(options.redirectUrl) || defaultOptions.redirectUrl;

    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            const regx = new RegExp(apiRegxStr);
            const isLogin = yield authorFunc(ctx);

            if (isLogin) {
                return next();
            }

            if (exceptUrls.indexOf(ctx.url) !== -1) {
                return next();
            }

            if (regx.test(ctx.url) || ctx.is('application/json')) {
                yield invalidCallback();
            }

            ctx.redirect(redirectUrl);
        });

        function koaAuth(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return koaAuth;
    })();
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