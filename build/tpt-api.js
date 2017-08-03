(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"), require("flat-file-db"), require("dotenv"));
	else if(typeof define === 'function' && define.amd)
		define(["axios", "flat-file-db", "dotenv"], factory);
	else if(typeof exports === 'object')
		exports["Tpt"] = factory(require("axios"), require("flat-file-db"), require("dotenv"));
	else
		root["Tpt"] = factory(root["axios"], root["flat-file-db"], root["dotenv"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = __webpack_require__(1);

var _axios2 = _interopRequireDefault(_axios);

var _flatFileDb = __webpack_require__(2);

var _flatFileDb2 = _interopRequireDefault(_flatFileDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (process.env.NODE_ENV !== 'production') {
  __webpack_require__(3).config();
}

var db = _flatFileDb2.default.sync('/tmp/token.db');
var MINUTE = 1000 * 60;

var request = _axios2.default.create({
  validateStatus: function validateStatus(status) {
    return true;
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

function Tpt(apiKey, apiSecret, endpoint) {
  var _this = this;

  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.endpoint = endpoint;

  this.fetchToken = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var url, credentials, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            url = this.endpoint + '/oauth/token';
            credentials = {
              client_id: this.apiKey,
              client_secret: this.apiSecret,
              grant_type: 'client_credentials'
            };
            _context.next = 5;
            return request.post(url, credentials);

          case 5:
            response = _context.sent;
            return _context.abrupt('return', response.data);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);

            console.warn(_context.t0);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  this.getToken = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var token, expiry, fifteenMinutesFromNow, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            token = db.get('token');
            expiry = db.get('expiry');
            fifteenMinutesFromNow = new Date(new Date().valueOf() + 15 * MINUTE);

            if (!(!token || !expiry || new Date(expiry) < fifteenMinutesFromNow)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 7;
            return this.fetchToken();

          case 7:
            response = _context2.sent;

            db.put('token', response.access_token);
            db.put('expiry', response.expiry);

            return _context2.abrupt('return', {
              token: response.access_token,
              expiry: response.expiry
            });

          case 13:
            return _context2.abrupt('return', { token: token, expiry: expiry });

          case 14:
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](0);

            console.warn(_context2.t0);

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 16]]);
  }));

  this.formatHeaders = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var tokenData, token;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return this.getToken();

          case 3:
            tokenData = _context3.sent;
            token = tokenData.token;
            return _context3.abrupt('return', {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            });

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](0);

            console.warn(_context3.t0);

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 8]]);
  }));

  this.prepareHeaders = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var headers;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return this.formatHeaders();

          case 2:
            headers = _context4.sent;

            request.defaults.headers = headers;

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  this.accounts = {
    create: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id;
                _context5.next = 5;
                return request.post(url, options.body);

              case 5:
                response = _context5.sent;

                if (!(response.status === 200)) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt('return', response.data);

              case 10:
                return _context5.abrupt('return', { error: response.statusText });

              case 11:
                _context5.next = 16;
                break;

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5['catch'](0);

                console.warn(_context5.t0);

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this, [[0, 13]]);
      }));

      function create(_x) {
        return _ref5.apply(this, arguments);
      }

      return create;
    }(),
    get: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id;
                _context6.next = 5;
                return request.get(url);

              case 5:
                response = _context6.sent;

                if (!(response.status === 200)) {
                  _context6.next = 10;
                  break;
                }

                return _context6.abrupt('return', response.data);

              case 10:
                return _context6.abrupt('return', { error: response.statusText });

              case 11:
                _context6.next = 16;
                break;

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6['catch'](0);

                console.warn(_context6.t0);

              case 16:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this, [[0, 13]]);
      }));

      function get(_x2) {
        return _ref6.apply(this, arguments);
      }

      return get;
    }(),
    getStatus: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/status';
                _context7.next = 5;
                return request.get(url);

              case 5:
                response = _context7.sent;

                if (!(response.status === 200)) {
                  _context7.next = 10;
                  break;
                }

                return _context7.abrupt('return', response.data);

              case 10:
                return _context7.abrupt('return', { error: response.statusText });

              case 11:
                _context7.next = 16;
                break;

              case 13:
                _context7.prev = 13;
                _context7.t0 = _context7['catch'](0);

                console.warn(_context7.t0);

              case 16:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, _this, [[0, 13]]);
      }));

      function getStatus(_x3) {
        return _ref7.apply(this, arguments);
      }

      return getStatus;
    }(),
    getApplicant: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/applicants/' + applicant_id;
                _context8.next = 5;
                return request.get(url);

              case 5:
                response = _context8.sent;

                if (!(response.status === 200)) {
                  _context8.next = 10;
                  break;
                }

                return _context8.abrupt('return', response.data);

              case 10:
                return _context8.abrupt('return', { error: response.statusText });

              case 11:
                _context8.next = 16;
                break;

              case 13:
                _context8.prev = 13;
                _context8.t0 = _context8['catch'](0);

                console.warn(_context8.t0);

              case 16:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, _this, [[0, 13]]);
      }));

      function getApplicant(_x4) {
        return _ref8.apply(this, arguments);
      }

      return getApplicant;
    }(),
    updateApplicant: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id;
                _context9.next = 5;
                return request.patch(url, options.body);

              case 5:
                response = _context9.sent;

                if (!(response.status === 200)) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt('return', response.data);

              case 10:
                return _context9.abrupt('return', { error: response.statusText });

              case 11:
                _context9.next = 16;
                break;

              case 13:
                _context9.prev = 13;
                _context9.t0 = _context9['catch'](0);

                console.warn(_context9.t0);

              case 16:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, _this, [[0, 13]]);
      }));

      function updateApplicant(_x5) {
        return _ref9.apply(this, arguments);
      }

      return updateApplicant;
    }(),
    updateAccount: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/applicants/' + applicant_id;
                _context10.next = 5;
                return request.patch(url, options.body);

              case 5:
                response = _context10.sent;

                if (!(response.status === 200)) {
                  _context10.next = 10;
                  break;
                }

                return _context10.abrupt('return', response.data);

              case 10:
                return _context10.abrupt('return', { error: response.statusText });

              case 11:
                _context10.next = 16;
                break;

              case 13:
                _context10.prev = 13;
                _context10.t0 = _context10['catch'](0);

                console.warn(_context10.t0);

              case 16:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, _this, [[0, 13]]);
      }));

      function updateAccount(_x6) {
        return _ref10.apply(this, arguments);
      }

      return updateAccount;
    }()
  };

  this.documents = {
    getStatements: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/documents/statements';
                _context11.next = 5;
                return request.get(url);

              case 5:
                response = _context11.sent;

                if (!(response.status === 200)) {
                  _context11.next = 10;
                  break;
                }

                return _context11.abrupt('return', response.data);

              case 10:
                return _context11.abrupt('return', { error: response.statusText });

              case 11:
                _context11.next = 16;
                break;

              case 13:
                _context11.prev = 13;
                _context11.t0 = _context11['catch'](0);

                console.warn(_context11.t0);

              case 16:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, _this, [[0, 13]]);
      }));

      function getStatements(_x7) {
        return _ref11.apply(this, arguments);
      }

      return getStatements;
    }(),
    getConfirmations: function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/documents/confirmations';
                _context12.next = 5;
                return request.get(url);

              case 5:
                response = _context12.sent;

                if (!(response.status === 200)) {
                  _context12.next = 10;
                  break;
                }

                return _context12.abrupt('return', response.data);

              case 10:
                return _context12.abrupt('return', { error: response.statusText });

              case 11:
                _context12.next = 16;
                break;

              case 13:
                _context12.prev = 13;
                _context12.t0 = _context12['catch'](0);

                console.warn(_context12.t0);

              case 16:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, _this, [[0, 13]]);
      }));

      function getConfirmations(_x8) {
        return _ref12.apply(this, arguments);
      }

      return getConfirmations;
    }()
  };

  this.transfers = {
    create: function () {
      var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/transfers/' + options.transfer_id;
                _context13.next = 5;
                return request.post(url, options.body);

              case 5:
                response = _context13.sent;

                if (!(response.status === 200)) {
                  _context13.next = 10;
                  break;
                }

                return _context13.abrupt('return', response.data);

              case 10:
                return _context13.abrupt('return', { error: response.statusText });

              case 11:
                _context13.next = 16;
                break;

              case 13:
                _context13.prev = 13;
                _context13.t0 = _context13['catch'](0);

                console.warn(_context13.t0);

              case 16:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, _this, [[0, 13]]);
      }));

      function create(_x9) {
        return _ref13.apply(this, arguments);
      }

      return create;
    }(),
    cancel: function () {
      var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/transfers/' + options.transfer_id;
                _context14.next = 5;
                return request.delete(url);

              case 5:
                response = _context14.sent;

                if (!(response.status === 200)) {
                  _context14.next = 10;
                  break;
                }

                return _context14.abrupt('return', response.data);

              case 10:
                return _context14.abrupt('return', { error: response.statusText });

              case 11:
                _context14.next = 16;
                break;

              case 13:
                _context14.prev = 13;
                _context14.t0 = _context14['catch'](0);

                console.warn(_context14.t0);

              case 16:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, _this, [[0, 13]]);
      }));

      function cancel(_x10) {
        return _ref14.apply(this, arguments);
      }

      return cancel;
    }(),
    get: function () {
      var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/transfers';
                _context15.next = 5;
                return request.get(url, { params: options.params });

              case 5:
                response = _context15.sent;

                if (!(response.status === 200)) {
                  _context15.next = 10;
                  break;
                }

                return _context15.abrupt('return', response.data);

              case 10:
                return _context15.abrupt('return', { error: response.statusText });

              case 11:
                _context15.next = 16;
                break;

              case 13:
                _context15.prev = 13;
                _context15.t0 = _context15['catch'](0);

                console.warn(_context15.t0);

              case 16:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, _this, [[0, 13]]);
      }));

      function get(_x11) {
        return _ref15.apply(this, arguments);
      }

      return get;
    }(),
    find: function () {
      var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/transfers/' + options.transfer_id;
                _context16.next = 5;
                return request.get(url);

              case 5:
                response = _context16.sent;

                if (!(response.status === 200)) {
                  _context16.next = 10;
                  break;
                }

                return _context16.abrupt('return', response.data);

              case 10:
                return _context16.abrupt('return', { error: response.statusText });

              case 11:
                _context16.next = 16;
                break;

              case 13:
                _context16.prev = 13;
                _context16.t0 = _context16['catch'](0);

                console.warn(_context16.t0);

              case 16:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, _this, [[0, 13]]);
      }));

      function find(_x12) {
        return _ref16.apply(this, arguments);
      }

      return find;
    }()
  };

  this.sources = {
    create: function () {
      var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id;
                _context17.next = 5;
                return request.post(url, options.body);

              case 5:
                response = _context17.sent;

                if (!(response.status === 200)) {
                  _context17.next = 10;
                  break;
                }

                return _context17.abrupt('return', response.data);

              case 10:
                return _context17.abrupt('return', { error: response.statusText });

              case 11:
                _context17.next = 16;
                break;

              case 13:
                _context17.prev = 13;
                _context17.t0 = _context17['catch'](0);

                console.warn(_context17.t0);

              case 16:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, _this, [[0, 13]]);
      }));

      function create(_x13) {
        return _ref17.apply(this, arguments);
      }

      return create;
    }(),
    delete: function () {
      var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id;
                _context18.next = 5;
                return request.delete(url);

              case 5:
                response = _context18.sent;

                if (!(response.status === 200)) {
                  _context18.next = 10;
                  break;
                }

                return _context18.abrupt('return', response.data);

              case 10:
                return _context18.abrupt('return', { error: response.statusText });

              case 11:
                _context18.next = 16;
                break;

              case 13:
                _context18.prev = 13;
                _context18.t0 = _context18['catch'](0);

                console.warn(_context18.t0);

              case 16:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, _this, [[0, 13]]);
      }));

      function _delete(_x14) {
        return _ref18.apply(this, arguments);
      }

      return _delete;
    }(),
    get: function () {
      var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources';
                _context19.next = 5;
                return request.get(url, { params: options.params });

              case 5:
                response = _context19.sent;

                if (!(response.status === 200)) {
                  _context19.next = 10;
                  break;
                }

                return _context19.abrupt('return', response.data);

              case 10:
                return _context19.abrupt('return', { error: response.statusText });

              case 11:
                _context19.next = 16;
                break;

              case 13:
                _context19.prev = 13;
                _context19.t0 = _context19['catch'](0);

                console.warn(_context19.t0);

              case 16:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, _this, [[0, 13]]);
      }));

      function get(_x15) {
        return _ref19.apply(this, arguments);
      }

      return get;
    }(),
    find: function () {
      var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id;
                _context20.next = 5;
                return request.get(url);

              case 5:
                response = _context20.sent;

                if (!(response.status === 200)) {
                  _context20.next = 10;
                  break;
                }

                return _context20.abrupt('return', response.data);

              case 10:
                return _context20.abrupt('return', { error: response.statusText });

              case 11:
                _context20.next = 16;
                break;

              case 13:
                _context20.prev = 13;
                _context20.t0 = _context20['catch'](0);

                console.warn(_context20.t0);

              case 16:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, _this, [[0, 13]]);
      }));

      function find(_x16) {
        return _ref20.apply(this, arguments);
      }

      return find;
    }(),
    update: function () {
      var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id;
                _context21.next = 5;
                return request.patch(url, options.body);

              case 5:
                response = _context21.sent;

                if (!(response.status === 200)) {
                  _context21.next = 10;
                  break;
                }

                return _context21.abrupt('return', response.data);

              case 10:
                return _context21.abrupt('return', { error: response.statusText });

              case 11:
                _context21.next = 16;
                break;

              case 13:
                _context21.prev = 13;
                _context21.t0 = _context21['catch'](0);

                console.warn(_context21.t0);

              case 16:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, _this, [[0, 13]]);
      }));

      function update(_x17) {
        return _ref21.apply(this, arguments);
      }

      return update;
    }(),
    verify: function () {
      var _ref22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id + '/verify';
                _context22.next = 5;
                return request.post(url, options.body);

              case 5:
                response = _context22.sent;

                if (!(response.status === 200)) {
                  _context22.next = 10;
                  break;
                }

                return _context22.abrupt('return', response.data);

              case 10:
                return _context22.abrupt('return', { error: response.statusText });

              case 11:
                _context22.next = 16;
                break;

              case 13:
                _context22.prev = 13;
                _context22.t0 = _context22['catch'](0);

                console.warn(_context22.t0);

              case 16:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, _this, [[0, 13]]);
      }));

      function verify(_x18) {
        return _ref22.apply(this, arguments);
      }

      return verify;
    }(),
    reverify: function () {
      var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee23(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/sources/' + options.source_id + '/reverify';
                _context23.next = 5;
                return request.post(url);

              case 5:
                response = _context23.sent;

                if (!(response.status === 200)) {
                  _context23.next = 10;
                  break;
                }

                return _context23.abrupt('return', response.data);

              case 10:
                return _context23.abrupt('return', { error: response.statusText });

              case 11:
                _context23.next = 16;
                break;

              case 13:
                _context23.prev = 13;
                _context23.t0 = _context23['catch'](0);

                console.warn(_context23.t0);

              case 16:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, _this, [[0, 13]]);
      }));

      function reverify(_x19) {
        return _ref23.apply(this, arguments);
      }

      return reverify;
    }()
  };

  this.orders = {
    create: function () {
      var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee24(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/orders/' + options.order_id;
                _context24.next = 5;
                return request.post(url, options.body);

              case 5:
                response = _context24.sent;

                if (!(response.status === 200)) {
                  _context24.next = 10;
                  break;
                }

                return _context24.abrupt('return', response.data);

              case 10:
                return _context24.abrupt('return', { error: response.statusText });

              case 11:
                _context24.next = 16;
                break;

              case 13:
                _context24.prev = 13;
                _context24.t0 = _context24['catch'](0);

                console.warn(_context24.t0);

              case 16:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, _this, [[0, 13]]);
      }));

      function create(_x20) {
        return _ref24.apply(this, arguments);
      }

      return create;
    }(),
    get: function () {
      var _ref25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee25(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/orders';
                _context25.next = 5;
                return request.get(url, { params: options.params });

              case 5:
                response = _context25.sent;

                if (!(response.status === 200)) {
                  _context25.next = 10;
                  break;
                }

                return _context25.abrupt('return', response.data);

              case 10:
                return _context25.abrupt('return', { error: response.statusText });

              case 11:
                _context25.next = 16;
                break;

              case 13:
                _context25.prev = 13;
                _context25.t0 = _context25['catch'](0);

                console.warn(_context25.t0);

              case 16:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, _this, [[0, 13]]);
      }));

      function get(_x21) {
        return _ref25.apply(this, arguments);
      }

      return get;
    }(),
    find: function () {
      var _ref26 = _asyncToGenerator(regeneratorRuntime.mark(function _callee26(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/orders/' + options.order_id;
                _context26.next = 5;
                return request.get(url);

              case 5:
                response = _context26.sent;

                if (!(response.status === 200)) {
                  _context26.next = 10;
                  break;
                }

                return _context26.abrupt('return', response.data);

              case 10:
                return _context26.abrupt('return', { error: response.statusText });

              case 11:
                _context26.next = 16;
                break;

              case 13:
                _context26.prev = 13;
                _context26.t0 = _context26['catch'](0);

                console.warn(_context26.t0);

              case 16:
              case 'end':
                return _context26.stop();
            }
          }
        }, _callee26, _this, [[0, 13]]);
      }));

      function find(_x22) {
        return _ref26.apply(this, arguments);
      }

      return find;
    }(),
    cancel: function () {
      var _ref27 = _asyncToGenerator(regeneratorRuntime.mark(function _callee27(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/orders/' + options.order_id;
                _context27.next = 5;
                return request.delete(url);

              case 5:
                response = _context27.sent;

                if (!(response.status === 200)) {
                  _context27.next = 10;
                  break;
                }

                return _context27.abrupt('return', response.data);

              case 10:
                return _context27.abrupt('return', { error: response.statusText });

              case 11:
                _context27.next = 16;
                break;

              case 13:
                _context27.prev = 13;
                _context27.t0 = _context27['catch'](0);

                console.warn(_context27.t0);

              case 16:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee27, _this, [[0, 13]]);
      }));

      function cancel(_x23) {
        return _ref27.apply(this, arguments);
      }

      return cancel;
    }(),
    update: function () {
      var _ref28 = _asyncToGenerator(regeneratorRuntime.mark(function _callee28(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/orders/' + options.order_id;
                _context28.next = 5;
                return request.patch(url, options.body);

              case 5:
                response = _context28.sent;

                if (!(response.status === 200)) {
                  _context28.next = 10;
                  break;
                }

                return _context28.abrupt('return', response.data);

              case 10:
                return _context28.abrupt('return', { error: response.statusText });

              case 11:
                _context28.next = 16;
                break;

              case 13:
                _context28.prev = 13;
                _context28.t0 = _context28['catch'](0);

                console.warn(_context28.t0);

              case 16:
              case 'end':
                return _context28.stop();
            }
          }
        }, _callee28, _this, [[0, 13]]);
      }));

      function update(_x24) {
        return _ref28.apply(this, arguments);
      }

      return update;
    }()
  };

  this.portfolio = {
    getCash: function () {
      var _ref29 = _asyncToGenerator(regeneratorRuntime.mark(function _callee29(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/portfolio/cash/USD';
                _context29.next = 5;
                return request.get(url);

              case 5:
                response = _context29.sent;

                if (!(response.status === 200)) {
                  _context29.next = 10;
                  break;
                }

                return _context29.abrupt('return', response.data);

              case 10:
                return _context29.abrupt('return', { error: response.statusText });

              case 11:
                _context29.next = 16;
                break;

              case 13:
                _context29.prev = 13;
                _context29.t0 = _context29['catch'](0);

                console.warn(_context29.t0);

              case 16:
              case 'end':
                return _context29.stop();
            }
          }
        }, _callee29, _this, [[0, 13]]);
      }));

      function getCash(_x25) {
        return _ref29.apply(this, arguments);
      }

      return getCash;
    }(),
    getEquities: function () {
      var _ref30 = _asyncToGenerator(regeneratorRuntime.mark(function _callee30(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + options.account_id + '/portfolio/equities';
                _context30.next = 5;
                return request.get(url, { params: options.params });

              case 5:
                response = _context30.sent;

                if (!(response.status === 200)) {
                  _context30.next = 10;
                  break;
                }

                return _context30.abrupt('return', response.data);

              case 10:
                return _context30.abrupt('return', { error: response.statusText });

              case 11:
                _context30.next = 16;
                break;

              case 13:
                _context30.prev = 13;
                _context30.t0 = _context30['catch'](0);

                console.warn(_context30.t0);

              case 16:
              case 'end':
                return _context30.stop();
            }
          }
        }, _callee30, _this, [[0, 13]]);
      }));

      function getEquities(_x26) {
        return _ref30.apply(this, arguments);
      }

      return getEquities;
    }(),
    getHistory: function () {
      var _ref32 = _asyncToGenerator(regeneratorRuntime.mark(function _callee31(_ref31) {
        var account_id = _ref31.account_id,
            params = _ref31.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + account_id + '/portfolio/cash/USD/transactions';
                _context31.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context31.sent;

                if (!(response.status === 200)) {
                  _context31.next = 10;
                  break;
                }

                return _context31.abrupt('return', response.data);

              case 10:
                return _context31.abrupt('return', { error: response.statusText });

              case 11:
                _context31.next = 16;
                break;

              case 13:
                _context31.prev = 13;
                _context31.t0 = _context31['catch'](0);

                console.warn(_context31.t0);

              case 16:
              case 'end':
                return _context31.stop();
            }
          }
        }, _callee31, _this, [[0, 13]]);
      }));

      function getHistory(_x27) {
        return _ref32.apply(this, arguments);
      }

      return getHistory;
    }(),
    symbolHistory: function () {
      var _ref34 = _asyncToGenerator(regeneratorRuntime.mark(function _callee32(_ref33) {
        var account_id = _ref33.account_id,
            symbol = _ref33.symbol,
            params = _ref33.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _context32.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/accounts/' + account_id + '/portfolio/equities/' + symbol + '/transactions';
                _context32.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context32.sent;

                if (!(response.status === 200)) {
                  _context32.next = 10;
                  break;
                }

                return _context32.abrupt('return', response.data);

              case 10:
                return _context32.abrupt('return', { error: response.statusText });

              case 11:
                _context32.next = 16;
                break;

              case 13:
                _context32.prev = 13;
                _context32.t0 = _context32['catch'](0);

                console.warn(_context32.t0);

              case 16:
              case 'end':
                return _context32.stop();
            }
          }
        }, _callee32, _this, [[0, 13]]);
      }));

      function symbolHistory(_x28) {
        return _ref34.apply(this, arguments);
      }

      return symbolHistory;
    }()
  };

  this.market = {
    getSingleQuote: function () {
      var _ref36 = _asyncToGenerator(regeneratorRuntime.mark(function _callee33(_ref35) {
        var symbol = _ref35.symbol,
            params = _ref35.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                _context33.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + symbol + '/quote';
                _context33.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context33.sent;

                if (!(response.status === 200)) {
                  _context33.next = 10;
                  break;
                }

                return _context33.abrupt('return', response.data);

              case 10:
                return _context33.abrupt('return', { error: response.statusText });

              case 11:
                _context33.next = 16;
                break;

              case 13:
                _context33.prev = 13;
                _context33.t0 = _context33['catch'](0);

                console.warn(_context33.t0);

              case 16:
              case 'end':
                return _context33.stop();
            }
          }
        }, _callee33, _this, [[0, 13]]);
      }));

      function getSingleQuote(_x29) {
        return _ref36.apply(this, arguments);
      }

      return getSingleQuote;
    }(),
    getOptionChain: function () {
      var _ref38 = _asyncToGenerator(regeneratorRuntime.mark(function _callee34(_ref37) {
        var symbol = _ref37.symbol,
            params = _ref37.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                _context34.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + symbol + '/options';
                _context34.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context34.sent;

                if (!(response.status === 200)) {
                  _context34.next = 10;
                  break;
                }

                return _context34.abrupt('return', response.data);

              case 10:
                return _context34.abrupt('return', { error: response.statusText });

              case 11:
                _context34.next = 16;
                break;

              case 13:
                _context34.prev = 13;
                _context34.t0 = _context34['catch'](0);

                console.warn(_context34.t0);

              case 16:
              case 'end':
                return _context34.stop();
            }
          }
        }, _callee34, _this, [[0, 13]]);
      }));

      function getOptionChain(_x30) {
        return _ref38.apply(this, arguments);
      }

      return getOptionChain;
    }(),
    getIntraday: function () {
      var _ref40 = _asyncToGenerator(regeneratorRuntime.mark(function _callee35(_ref39) {
        var symbol = _ref39.symbol,
            params = _ref39.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + symbol + '/timeseries/intraday';
                _context35.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context35.sent;

                if (!(response.status === 200)) {
                  _context35.next = 10;
                  break;
                }

                return _context35.abrupt('return', response.data);

              case 10:
                return _context35.abrupt('return', { error: response.statusText });

              case 11:
                _context35.next = 16;
                break;

              case 13:
                _context35.prev = 13;
                _context35.t0 = _context35['catch'](0);

                console.warn(_context35.t0);

              case 16:
              case 'end':
                return _context35.stop();
            }
          }
        }, _callee35, _this, [[0, 13]]);
      }));

      function getIntraday(_x31) {
        return _ref40.apply(this, arguments);
      }

      return getIntraday;
    }(),
    getEndOfDayHistory: function () {
      var _ref42 = _asyncToGenerator(regeneratorRuntime.mark(function _callee36(_ref41) {
        var symbol = _ref41.symbol,
            params = _ref41.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbol/' + symbol + '/timeseries/eod';
                _context36.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context36.sent;

                if (!(response.status === 200)) {
                  _context36.next = 10;
                  break;
                }

                return _context36.abrupt('return', response.data);

              case 10:
                return _context36.abrupt('return', { error: response.statusText });

              case 11:
                _context36.next = 16;
                break;

              case 13:
                _context36.prev = 13;
                _context36.t0 = _context36['catch'](0);

                console.warn(_context36.t0);

              case 16:
              case 'end':
                return _context36.stop();
            }
          }
        }, _callee36, _this, [[0, 13]]);
      }));

      function getEndOfDayHistory(_x32) {
        return _ref42.apply(this, arguments);
      }

      return getEndOfDayHistory;
    }(),
    getSplits: function () {
      var _ref44 = _asyncToGenerator(regeneratorRuntime.mark(function _callee37(_ref43) {
        var symbol = _ref43.symbol,
            params = _ref43.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _context37.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbol/' + symbol + '/splits';
                _context37.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context37.sent;

                if (!(response.status === 200)) {
                  _context37.next = 10;
                  break;
                }

                return _context37.abrupt('return', response.data);

              case 10:
                return _context37.abrupt('return', { error: response.statusText });

              case 11:
                _context37.next = 16;
                break;

              case 13:
                _context37.prev = 13;
                _context37.t0 = _context37['catch'](0);

                console.warn(_context37.t0);

              case 16:
              case 'end':
                return _context37.stop();
            }
          }
        }, _callee37, _this, [[0, 13]]);
      }));

      function getSplits(_x33) {
        return _ref44.apply(this, arguments);
      }

      return getSplits;
    }(),
    getDividends: function () {
      var _ref46 = _asyncToGenerator(regeneratorRuntime.mark(function _callee38(_ref45) {
        var symbol = _ref45.symbol,
            params = _ref45.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                _context38.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbol/' + symbol + '/dividends';
                _context38.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context38.sent;

                if (!(response.status === 200)) {
                  _context38.next = 10;
                  break;
                }

                return _context38.abrupt('return', response.data);

              case 10:
                return _context38.abrupt('return', { error: response.statusText });

              case 11:
                _context38.next = 16;
                break;

              case 13:
                _context38.prev = 13;
                _context38.t0 = _context38['catch'](0);

                console.warn(_context38.t0);

              case 16:
              case 'end':
                return _context38.stop();
            }
          }
        }, _callee38, _this, [[0, 13]]);
      }));

      function getDividends(_x34) {
        return _ref46.apply(this, arguments);
      }

      return getDividends;
    }(),
    getMultiQuote: function () {
      var _ref48 = _asyncToGenerator(regeneratorRuntime.mark(function _callee39(_ref47) {
        var symbols = _ref47.symbols,
            params = _ref47.params;
        var url, response;
        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                _context39.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/quote?symbols=' + symbols;
                _context39.next = 5;
                return request.get(url, { params: params });

              case 5:
                response = _context39.sent;

                if (!(response.status === 200)) {
                  _context39.next = 10;
                  break;
                }

                return _context39.abrupt('return', response.data);

              case 10:
                return _context39.abrupt('return', { error: response.statusText });

              case 11:
                _context39.next = 16;
                break;

              case 13:
                _context39.prev = 13;
                _context39.t0 = _context39['catch'](0);

                console.warn(_context39.t0);

              case 16:
              case 'end':
                return _context39.stop();
            }
          }
        }, _callee39, _this, [[0, 13]]);
      }));

      function getMultiQuote(_x35) {
        return _ref48.apply(this, arguments);
      }

      return getMultiQuote;
    }(),
    getHours: function () {
      var _ref50 = _asyncToGenerator(regeneratorRuntime.mark(function _callee40(_ref49) {
        var date = _ref49.date;
        var url, response;
        return regeneratorRuntime.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                _context40.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/hours/' + date;
                _context40.next = 5;
                return request.get(url);

              case 5:
                response = _context40.sent;

                if (!(response.status === 200)) {
                  _context40.next = 10;
                  break;
                }

                return _context40.abrupt('return', response.data);

              case 10:
                return _context40.abrupt('return', { error: response.statusText });

              case 11:
                _context40.next = 16;
                break;

              case 13:
                _context40.prev = 13;
                _context40.t0 = _context40['catch'](0);

                console.warn(_context40.t0);

              case 16:
              case 'end':
                return _context40.stop();
            }
          }
        }, _callee40, _this, [[0, 13]]);
      }));

      function getHours(_x36) {
        return _ref50.apply(this, arguments);
      }

      return getHours;
    }(),
    getBrokerRatings: function () {
      var _ref51 = _asyncToGenerator(regeneratorRuntime.mark(function _callee41(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                _context41.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/ratings';
                _context41.next = 5;
                return request.get(url);

              case 5:
                response = _context41.sent;

                if (!(response.status === 200)) {
                  _context41.next = 10;
                  break;
                }

                return _context41.abrupt('return', response.data);

              case 10:
                return _context41.abrupt('return', { error: response.statusText });

              case 11:
                _context41.next = 16;
                break;

              case 13:
                _context41.prev = 13;
                _context41.t0 = _context41['catch'](0);

                console.warn(_context41.t0);

              case 16:
              case 'end':
                return _context41.stop();
            }
          }
        }, _callee41, _this, [[0, 13]]);
      }));

      function getBrokerRatings(_x37) {
        return _ref51.apply(this, arguments);
      }

      return getBrokerRatings;
    }(),
    getEarningsEvents: function () {
      var _ref52 = _asyncToGenerator(regeneratorRuntime.mark(function _callee42(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                _context42.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/earnings/events';
                _context42.next = 5;
                return request.get(url);

              case 5:
                response = _context42.sent;

                if (!(response.status === 200)) {
                  _context42.next = 10;
                  break;
                }

                return _context42.abrupt('return', response.data);

              case 10:
                return _context42.abrupt('return', { error: response.statusText });

              case 11:
                _context42.next = 16;
                break;

              case 13:
                _context42.prev = 13;
                _context42.t0 = _context42['catch'](0);

                console.warn(_context42.t0);

              case 16:
              case 'end':
                return _context42.stop();
            }
          }
        }, _callee42, _this, [[0, 13]]);
      }));

      function getEarningsEvents(_x38) {
        return _ref52.apply(this, arguments);
      }

      return getEarningsEvents;
    }(),
    getEarningSurprises: function () {
      var _ref53 = _asyncToGenerator(regeneratorRuntime.mark(function _callee43(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                _context43.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/earnings/surprises';
                _context43.next = 5;
                return request.get(url);

              case 5:
                response = _context43.sent;

                if (!(response.status === 200)) {
                  _context43.next = 10;
                  break;
                }

                return _context43.abrupt('return', response.data);

              case 10:
                return _context43.abrupt('return', { error: response.statusText });

              case 11:
                _context43.next = 16;
                break;

              case 13:
                _context43.prev = 13;
                _context43.t0 = _context43['catch'](0);

                console.warn(_context43.t0);

              case 16:
              case 'end':
                return _context43.stop();
            }
          }
        }, _callee43, _this, [[0, 13]]);
      }));

      function getEarningSurprises(_x39) {
        return _ref53.apply(this, arguments);
      }

      return getEarningSurprises;
    }(),
    getFinancials: function () {
      var _ref54 = _asyncToGenerator(regeneratorRuntime.mark(function _callee44(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee44$(_context44) {
          while (1) {
            switch (_context44.prev = _context44.next) {
              case 0:
                _context44.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/financials';
                _context44.next = 5;
                return request.get(url);

              case 5:
                response = _context44.sent;

                if (!(response.status === 200)) {
                  _context44.next = 10;
                  break;
                }

                return _context44.abrupt('return', response.data);

              case 10:
                return _context44.abrupt('return', { error: response.statusText });

              case 11:
                _context44.next = 16;
                break;

              case 13:
                _context44.prev = 13;
                _context44.t0 = _context44['catch'](0);

                console.warn(_context44.t0);

              case 16:
              case 'end':
                return _context44.stop();
            }
          }
        }, _callee44, _this, [[0, 13]]);
      }));

      function getFinancials(_x40) {
        return _ref54.apply(this, arguments);
      }

      return getFinancials;
    }(),
    getCompanyNews: function () {
      var _ref55 = _asyncToGenerator(regeneratorRuntime.mark(function _callee45(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                _context45.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/news';
                _context45.next = 5;
                return request.get(url);

              case 5:
                response = _context45.sent;

                if (!(response.status === 200)) {
                  _context45.next = 10;
                  break;
                }

                return _context45.abrupt('return', response.data);

              case 10:
                return _context45.abrupt('return', { error: response.statusText });

              case 11:
                _context45.next = 16;
                break;

              case 13:
                _context45.prev = 13;
                _context45.t0 = _context45['catch'](0);

                console.warn(_context45.t0);

              case 16:
              case 'end':
                return _context45.stop();
            }
          }
        }, _callee45, _this, [[0, 13]]);
      }));

      function getCompanyNews(_x41) {
        return _ref55.apply(this, arguments);
      }

      return getCompanyNews;
    }(),
    getCompanyOwnership: function () {
      var _ref56 = _asyncToGenerator(regeneratorRuntime.mark(function _callee46(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee46$(_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                _context46.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol;
                _context46.next = 5;
                return request.get(url);

              case 5:
                response = _context46.sent;

                if (!(response.status === 200)) {
                  _context46.next = 10;
                  break;
                }

                return _context46.abrupt('return', response.data);

              case 10:
                return _context46.abrupt('return', { error: response.statusText });

              case 11:
                _context46.next = 16;
                break;

              case 13:
                _context46.prev = 13;
                _context46.t0 = _context46['catch'](0);

                console.warn(_context46.t0);

              case 16:
              case 'end':
                return _context46.stop();
            }
          }
        }, _callee46, _this, [[0, 13]]);
      }));

      function getCompanyOwnership(_x42) {
        return _ref56.apply(this, arguments);
      }

      return getCompanyOwnership;
    }(),
    getCompanyProfile: function () {
      var _ref57 = _asyncToGenerator(regeneratorRuntime.mark(function _callee47(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                _context47.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/profile';
                _context47.next = 5;
                return request.get(url);

              case 5:
                response = _context47.sent;

                if (!(response.status === 200)) {
                  _context47.next = 10;
                  break;
                }

                return _context47.abrupt('return', response.data);

              case 10:
                return _context47.abrupt('return', { error: response.statusText });

              case 11:
                _context47.next = 16;
                break;

              case 13:
                _context47.prev = 13;
                _context47.t0 = _context47['catch'](0);

                console.warn(_context47.t0);

              case 16:
              case 'end':
                return _context47.stop();
            }
          }
        }, _callee47, _this, [[0, 13]]);
      }));

      function getCompanyProfile(_x43) {
        return _ref57.apply(this, arguments);
      }

      return getCompanyProfile;
    }(),
    getCompanyRatios: function () {
      var _ref58 = _asyncToGenerator(regeneratorRuntime.mark(function _callee48(options) {
        var url, response;
        return regeneratorRuntime.wrap(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                _context48.prev = 0;

                _this.prepareHeaders();
                url = _this.endpoint + '/v1/market/symbols/' + options.symbol + '/company/ratios';
                _context48.next = 5;
                return request.get(url);

              case 5:
                response = _context48.sent;

                if (!(response.status === 200)) {
                  _context48.next = 10;
                  break;
                }

                return _context48.abrupt('return', response.data);

              case 10:
                return _context48.abrupt('return', { error: response.statusText });

              case 11:
                _context48.next = 16;
                break;

              case 13:
                _context48.prev = 13;
                _context48.t0 = _context48['catch'](0);

                console.warn(_context48.t0);

              case 16:
              case 'end':
                return _context48.stop();
            }
          }
        }, _callee48, _this, [[0, 13]]);
      }));

      function getCompanyRatios(_x44) {
        return _ref58.apply(this, arguments);
      }

      return getCompanyRatios;
    }()
  };
};

exports.default = Tpt;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("flat-file-db");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ })
/******/ ]);
});
//# sourceMappingURL=tpt-api.js.map