#### accounts

  - **create**              `({ body: any, account_id: string })`
  
  - **get**                 `({ account_id: string })`
  
  - **getStatus**           `({ account_id: string })`
  
  - **getApplicant**        `({ account_id: string, applicant_id: string })`
  
  - **updateAccount**       `({ account_id: string, body: any })`
  
  - **updateApplicant**     `({ account_id: string, applicant_id: string, body: any })`
  
#### documents

  - **getStatements**       `({ account_id: string })`
  
  - **getConfirmations**    `({ account_id: string })`
  
#### transfers

  - **create**              `({ account_id: string, transfer_id: string, body: any })`
  
  - **cancel**              `({ account_id: string, transfer_id: string })`
  
  - **get**                 `({ account_id: string, params: any })`
  
  - **getAll**              `({ account_id: string })`
  
  - **find**                `({ account_id: string, transfer_id: string })`
  
#### sources

  - **create**              `({ account_id: string, source_id: string, body: any })`
  
  - **delete**              `({ account_id: string, source_id: string })`
  
  - **get**                 `({ account_id: string })`
  
  - **find**                `({ account_id: string, source_id: string })`
  
  - **update**              `({ account_id: string, source_id: string, body: any })`
  
  - **verify**              `({ account_id: string, source_id: string, body: any })`
  
  - **reverify**            `({ account_id: string, source_id: string })`
  
#### orders 

  - **create**              `({ account_id: string, order_id: string, body: any })`
  
  - **get**                 `({ account_id: string, params: any })`
  
  - **getAll**              `({ account_id: string, params: any })`
  
  - **find**                `({ account_id: string, order_id: string })`
  
  - **cancel**              `({ account_id: string, order_id: string })`
  
  - **update**              `({ account_id: string, order_id: string, body: any })`
  
#### portfolio
  
  - **getCash**             `({ account_id: string })`
  
  - **getEquities**         `({ account_id: string })`
  
  - **getHistory**          `({ account_id: string })`
  
  - **symbolHistory**       `({ account_id: string, symbol: string, params: any })`
  
#### market

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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
