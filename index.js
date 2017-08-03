import axios from 'axios';
import flatfile from 'flat-file-db';
import moment from 'moment';

const db = flatfile.sync('/tmp/token.db');
const MINUTE = 1000 * 60;

const request = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

function Tpt(apiKey, apiSecret, endpoint) {
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;

  this.fetchToken = async function() {
    try {
      let url = `${endpoint}/oauth/token`;
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
      if (!token || !expiry || moment.utc(expiry) < moment.utc(fifteenMinutesFromNow)) {
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

  this.accounts = {
    get: (options) => {
      console.log('> Get account: ', options, this.apiKey);
    },
    getStatus: (options) => {

    },
    getApplicant: (options) => {

    },
    updateApplicant: (options) => {

    },
    updateAccount: (options) => {

    }
  };

  this.documents = {
    getStatements: (options) => {

    },
    getConfirmations: (options) => {

    },
  };

  this.transfers = {
    create: (options) => {

    },
    cancel: (options) => {

    },
    get: (options) => {

    },
    find: (options) => {

    },
  };

  this.sources = {
    create: (options) => {

    },
    delete: (options) => {

    },
    get: (options) => {

    },
    find: (options) => {

    },
    update: (options) => {

    },
    verify: (options) => {

    },
    reverify: (options) => {

    },
  };

  this.orders = {
    create: (options) => {

    },
    get: (options) => {

    },
    find: (options) => {

    },
    cancel: (options) => {

    },
  };

  this.portfolio = {
    getCash: (options) => {

    },
    getEquities: (options) => {

    },
    getHistory: (options) => {

    },
    symbolHistory: (options) => {

    }
  };

  this.market = {
    getSingleQuote: (options) => {

    },
    getOptionChain: (options) => {

    },
    getIntraday: (options) => {

    },
    getEndOfDayHistory: (options) => {

    },
    getDividends: (options) => {

    },
    getMultiQuote: (options) => {

    },
    getHours: (options) => {

    },
    getBrokerRatings: (options) => {

    },
    getEarningsEvents: (options) => {

    },
    getEarningSurprises: (options) => {

    },
    getFinancials: (options) => {

    },
    getCompanyNews: (options) => {

    },
    getCompanyOwnership: (options) => {

    },
    getCompanyProfile: (options) => {

    },
    getCompanyRatios: (options) => {

    },
  };
};


var tpt = new Tpt(process.env.TPT_API_KEY, process.env.TPT_API_SECRET, process.env.TPT_ENDPOINT);

console.log('> tpt: ', tpt);

tpt.accounts.get('options');

export default Tpt;
