import axios from 'axios';
import flatfile from 'flat-file-db';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const db = flatfile.sync('/tmp/token.db');
const MINUTE = 1000 * 60;

const request = axios.create({
  validateStatus: (status) => true,
  headers: {
    'Content-Type': 'application/json',
  }
});

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
  }

  this.accounts = {
    create: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getStatus: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/status`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getApplicant: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/applicants/${applicant_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    updateApplicant: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    updateAccount: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/applicants/${applicant_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/documents/statements`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getConfirmations: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/documents/confirmations`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    cancel: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/transfers/${options.transfer_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    delete: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    update: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    verify: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}/verify`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    reverify: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/sources/${options.source_id}/reverify`;
        let response = await request.post(url);
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.post(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    get: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    find: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    cancel: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.delete(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    update: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/orders/${options.order_id}`;
        let response = await request.patch(url, options.body);
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/portfolio/cash/USD`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEquities: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${options.account_id}/portfolio/equities`;
        let response = await request.get(url, { params: options.params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getHistory: async ({ account_id, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${account_id}/portfolio/cash/USD/transactions`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    symbolHistory: async ({ account_id, symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/accounts/${account_id}/portfolio/equities/${symbol}/transactions`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
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
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/quote`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getOptionChain: async ({ symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/options`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getIntraday: async ({ symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${symbol}/timeseries/intraday`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEndOfDayHistory: async ({ symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbol/${symbol}/timeseries/eod`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getSplits: async ({ symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbol/${symbol}/splits`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getDividends: async ({ symbol, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbol/${symbol}/dividends`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getMultiQuote: async ({ symbols, params }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/quote?symbols=${symbols}`;
        let response = await request.get(url, { params });
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getHours: async ({ date }) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/hours/${date}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getBrokerRatings: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/ratings`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEarningsEvents: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/earnings/events`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getEarningSurprises: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/earnings/surprises`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getFinancials: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/financials`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyNews: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/news`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyOwnership: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyProfile: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/profile`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
    getCompanyRatios: async (options) => {
      try {
        this.prepareHeaders();
        let url = `${this.endpoint}/v1/market/symbols/${options.symbol}/company/ratios`;
        let response = await request.get(url);
        if (response.status === 200) {
          return response.data;
        } else {
          return { error: response.statusText };
        }
      } catch (e) {
        console.warn(e);
      }
    },
  };
};


export default Tpt;