* accounts
  - *create* `({ body: any, account_id: string })`
  - *get* `({ account_id: string })`
  - *getStatus* `({ account_id: string })`
  - getApplicant* `({ account_id: string, applicant_id: string })`
  - *updateAccount* `({ account_id: string, body: any })`
  - *updateApplicant* `({ account_id: string, applicant_id: string, body: any })`
* documents
  - *getStatements* `({ account_id: string })`
  - *getConfirmations* `({ account_id: string })`
* transfers
  - *create* `({ account_id: string, transfer_id: string, body: any })`
  - *cancel* `({ account_id: string, transfer_id: string })`
  - *get* `({ account_id: string, params: any })`
  - *getAll* `({ account_id: string })`
  - *find* `({ account_id: string, transfer_id: string })`
* sources
  - 
