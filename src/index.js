import axios from 'axios';
import flatfile from 'flat-file-db';
import has from 'lodash/has';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbName = process.env.TPT_ENDPOINT === 'https://api.thirdparty.com' ? 'production-tpt-token' : 'development-tpt-token';

const db = flatfile.sync(`/tmp/${dbName}.db`);
const MINUTE = 1000 * 60;

const request = axios.create({
  validateStatus: (status) => true,
  headers: {
    'Content-Type': 'application/json',
  }
});

class ObjectList {
  constructor() {
    this.items = [ ];
    this.endpoint = process.env.TPT_ENDPOINT;
  }
  async list(path) {
    try {
      var response = await request.get(path);
      console.log('> transfer response: ', response.statusText);
      if (response.status !== 200) {
        return;
      }
      this.items =  [ ...this.items, ...response.data.items ];
      var hasTail = has(response.data, '_tail');
      if (!hasTail || response.data.items.length < 10) {
        return;
      } else {
        var url = `${process.env.TPT_ENDPOINT}${response.data._tail}`
        await this.list(url);
      }
    } catch (e) {
      console.warn(e);
      return [ ];
    }
  }
}

function Tpt(apiKey, apiSecret, endpoint) {
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.endpoint = endpoint;

  this.fetchToken = async function() {
    try {
      let url = `${this.endpoint}/oauth/token`;
      let credentials = {
        client_id: this.apiKey,
        client_secret: this.apiSecret,
        grant_type: 'client_credentials',
      };
      let response = await request.post(url, credentials);
      return response.data;
    } catch (e) {
      console.warn(e);
    }
  };

  this.getToken = async function() {
    try {
      let token = db.get('token');
      let expiry = db.get('expiry');

      let fifteenMinutesFromNow = new Date(new Date().valueOf() + (15 * MINUTE));
      if (!token || !expiry || new Date(expiry) < fifteenMinutesFromNow) {
        let response = await this.fetchToken();
        db.put('token', response.access_token);
        db.put('expiry', response.expiry);

        return {
          token: response.access_token,
          expiry: response.expiry,
        };
      } else {
        return { token, expiry };
      }
    } catch (e) {
      console.warn(e);
    }
  }

  this.formatHeaders = async function() {
    try {
      let tokenData = await this.getToken();
      let token = tokenData.token;
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    } catch (e) {
      console.warn(e);
    }
  }

  this.prepareHeaders = async function() {
    let headers = await this.formatHeaders();
    request.defaults.headers = headers;
    console.log('> prepare headers: ', headers);
  }

  this.accounts = {
    create: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getStatus: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/status`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getApplicant: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/applicants/${applicant_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    updateApplicant: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    updateAccount: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/applicants/${applicant_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  this.documents = {
    getStatements: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/documents/statements`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getConfirmations: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/documents/confirmations`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
  };

  this.transfers = {
    create: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          let error = response.statusText;
          if (response.data.error) {
            error = response.data.error;
          }
          return { error: error };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    cancel: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getAll: async ({ account_id }) => {
      try {
        await this.prepareHeaders();
        let transferRequest = new ObjectList();
        let path = `${process.env.TPT_ENDPOINT}/v1/accounts/${account_id}/transfers`;
        await transferRequest.list(path);

        let result = transferRequest.items;
        // console.log('> get all transfers: ', result);
        return result;
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
  };

  this.sources = {
    create: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          let error = response.statusText;
          if (response.data.error) {
            error = response.data.error;
          }
          return { error: error };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    delete: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
          } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    update: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    verify: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}/verify`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {

          console.warn(response.data);
          let error = response.statusText;
          if (response.data.error) {
            error = response.data.error;
          }
          return { error: error };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    reverify: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}/reverify`;
        let response = await request.post(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
  };

  this.orders = {
    create: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          let error = response.statusText;
          if (response.data.error) {
            error = response.data.error;
          }
          return { error: error, fullResponse: response.data };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async ({ account_id, params }) => {
      try {
        console.log('> Get orders: ', account_id, params);
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${account_id}/orders`;
        let response = await request.get(url, { params: params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getAll: async ({ account_id, params }) => {
      try {
        await this.prepareHeaders();
        let orderRequest = new ObjectList();
        let path = `${process.env.TPT_ENDPOINT}/v1/accounts/${account_id}/orders?status=filled`;
        await orderRequest.list(path);

        let result = orderRequest.items;
        // console.log('> get all orders: ', result);
        return result;
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    cancel: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    update: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  this.portfolio = {
    getCash: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/portfolio/cash/USD`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEquities: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/portfolio/equities`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getHistory: async ({ account_id }) => {
      try {
        await this.prepareHeaders();
        let historyRequest = new ObjectList();
        let path = `${this.endpoint}/v1/accounts/${account_id}/portfolio/cash/USD/transactions`;
        await historyRequest.list(path);

        let result = historyRequest.items;
        return result;
      } catch (e) {
        console.warn(e);
      }
    },
    symbolHistory: async ({ account_id, symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${account_id}/portfolio/equities/${symbol}/transactions`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  this.market = {
    getSingleQuote: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/quote`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getOptionChain: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/options`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getIntraday: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/timeseries/intraday`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEndOfDayHistory: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/timeseries/eod`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getSplits: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/splits`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getDividends: async ({ symbol, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/dividends`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getMultiQuote: async ({ symbols, params }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/quote?symbols=${symbols}`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getHours: async ({ date }) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/hours/${date}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getBrokerRatings: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/ratings`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEarningsEvents: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/earnings/events`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEarningSurprises: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/earnings/surprises`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getFinancials: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/financials`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyNews: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/news`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyOwnership: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/ownership`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyProfile: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/profile`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyRatios: async (options) => {
      try {
        await this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/ratios`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          console.warn(response.data);
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
  };
};

// let t = new Tpt(process.env.TPT_API_KEY, process.env.TPT_API_SECRET, process.env.TPT_ENDPOINT);
// let account_id = 'b11b3629-aed8-41ca-b916-16bc2a097369';
//
// t.transfers.getAll({ account_id });

export default Tpt;
