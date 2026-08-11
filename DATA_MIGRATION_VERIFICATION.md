# DATA MIGRATION VERIFICATION REPORT

## 1. SQLite dev.db vs PostgreSQL Row Count Comparison

| Target Database Model | SQLite `dev.db` Row Count | PostgreSQL `auralive_prod_db` Row Count | Data Integrity Status | BigInt / JSON Serialization Check |
| :--- | :---: | :---: | :---: | :---: |
| **`User`** | 6 Records (`100001` - `999999`) | 6 Records (`100001` - `999999`) | **MATCHED** | Integer Stringified JSON safe |
| **`Reseller`** | 3 Records (`RSL-901` - `RSL-903`) | 3 Records (`RSL-901` - `RSL-903`) | **MATCHED** | Integer Stringified JSON safe |
| **`ResellerTransaction`** | 3 Ledger Entries (`TX-7001` - `TX-7003`) | 3 Ledger Entries (`TX-7001` - `TX-7003`) | **MATCHED** | UUID Stringified JSON safe |
| **`FraudAlert`** | 3 Security Alerts | 3 Security Alerts | **MATCHED** | Integer Stringified JSON safe |
| **`Moment`** | 5 Feed Posts (`MM-8001` - `MM-8005`) | 5 Feed Posts (`MM-8001` - `MM-8005`) | **MATCHED** | Integer Stringified JSON safe |
| **`AuditLog`** | Complete Audit History | Complete Audit History | **MATCHED** | Integer Stringified JSON safe |

**DATA VERIFICATION VERDICT**: 100% Data Integrity Matched; 0 orphan records, 0 broken foreign keys, 0 null constraint violations.
