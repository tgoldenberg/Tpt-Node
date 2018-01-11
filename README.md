TPT node is a wrapper of Third Party Trade's API for easier usage. Created and maintained by the developers at [Commandiv](https://app.commandiv.com)
---
- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Methods](#methods)


## How to use
### Setup
- Install the package with npm:

```
npm install @commandiv/tpt-api
```

- Initialize the **TPT node object** in a `tpt.js` file like this (or directly instantiate it when you need it): 

```
import Tpt from '@commandiv/tpt-api';

const tpt = new Tpt(process.env.TPT_API_KEY, process.env.TPT_API_SECRET, process.env.TPT_ENDPOINT);

export default tpt;
```
> Make sure to update your environment variables with your TPT credentials.


- Import the instantiated **TPT node object** where needed to start using the API:

```
import tpt from './tpt';

async someFunction() {
	//	Example to retrieve User info
	const account_id = 'TPT_ACCOUNT_ID';
	const tptData = await tpt.accounts.get({ account_id });
}
```
---
### Methods
> For returned result object structure. Please refer to [TPT documentation](https://portal.thirdparty.com/docs/)

#### [accounts](https://portal.thirdparty.com/docs/accounts.html#feature-accounts)

  - **create**              `({ body: any, account_id: string })`
  
  - **get**                 `({ account_id: string })`
  
  - **getStatus**           `({ account_id: string })`
  
  - **getApplicant**        `({ account_id: string, applicant_id: string })`
  
  - **updateAccount**       `({ account_id: string, body: any })`
  
  - **updateApplicant**     `({ account_id: string, applicant_id: string, body: any })`
  
#### [documents](https://portal.thirdparty.com/docs/documents.html)

  - **getStatements**       `({ account_id: string })`
  
  - **getConfirmations**    `({ account_id: string })`
  
#### [transfers](https://portal.thirdparty.com/docs/funding.html#feature-transfers)

  - **create**              `({ account_id: string, transfer_id: string, body: any })`
  
  - **cancel**              `({ account_id: string, transfer_id: string })`
  
  - **get**                 `({ account_id: string, params: any })`
  
  - **getAll**              `({ account_id: string })`
  
  - **find**                `({ account_id: string, transfer_id: string })`
  
#### [sources](https://portal.thirdparty.com/docs/funding.html#feature-sources)

  - **create**              `({ account_id: string, source_id: string, body: any })`
  
  - **delete**              `({ account_id: string, source_id: string })`
  
  - **get**                 `({ account_id: string })`
  
  - **find**                `({ account_id: string, source_id: string })`
  
  - **update**              `({ account_id: string, source_id: string, body: any })`
  
  - **verify**              `({ account_id: string, source_id: string, body: any })`
  
  - **reverify**            `({ account_id: string, source_id: string })`
  
#### [orders](https://portal.thirdparty.com/docs/oms.html#feature-standard) 

  - **create**              `({ account_id: string, order_id: string, body: any })`
  
  - **get**                 `({ account_id: string, params: any })`
  
  - **getAll**              `({ account_id: string, params: any })`
  
  - **find**                `({ account_id: string, order_id: string })`
  
  - **cancel**              `({ account_id: string, order_id: string })`
  
  - **update**              `({ account_id: string, order_id: string, body: any })`
  
#### [portfolio](https://portal.thirdparty.com/docs/portfolio.html)
  
  - **getCash**             `({ account_id: string })`
  
  - **getEquities**         `({ account_id: string })`
  
  - **getHistory**          `({ account_id: string })`
  
  - **symbolHistory**       `({ account_id: string, symbol: string, params: any })`
  
#### [market](https://portal.thirdparty.com/docs/market-data.html)

  - **getSingleQuote**      `({ symbol: string, params: any })`
  
  - **getOptionChain**      `({ symbol: string, params: any })`
  
  - **getIntraday**         `({ symbol: string, params: any })`
  
  - **getEndOfDayHistory**  `({ symbol: string, params: any })`
  
  - **getSplits**           `({ symbol: string, params: any })`
  
  - **getDividends**        `({ symbol: string, params: any })`
  
  - **getMultiQuote**       `({ symbols: string, params: any })`
  
  - **getHours**            `({ date: string })`
  
  - **getBrokerRatings**    `({ symbol: string })`
  
  - **getEarningsEvents**   `({ symbol: string })`
  
  - **getEarningSurprises** `({ symbol: string })`
  
  - **getFinancials**       `({ symbol: string, params: any })`
  
  - **getCompanyNews**      `({ symbol: string })`
  
  - **getCompanyOwnership** `({ symbol: string })`
  
  - **getCompanyProfile**   `({ symbol: string })`
  
  - **getCompanyRatios**    `({ symbol: string })`
 
