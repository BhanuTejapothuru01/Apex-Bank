# Login credentials

Sign in from the **landing page** → click **Login** → pick your portal → enter credentials below.

## All portal logins

| Portal | Email / username | Password |
|--------|------------------|----------|
| **Customer (your account)** | `24691a3317@mits.ac.in` | `Teja@602142` |
| **Customer (demo)** | `customer@apexbank.com` | `customer123` |
| **Employee** | `employee@apexbank.com` | `employee123` |
| **Admin** | `admin@apexbank.com` | `admin123` |
| **Super Admin** | `superadmin@apexbank.com` | `superadmin123` |

### Customer (Supabase)

Customer login uses the `students` table (email or mobile + password) and **Supabase Auth**.

Your account has live data: transactions, cards, savings vaults, and a pending education loan.

### After login

| Portal | URL |
|--------|-----|
| Customer | `/customer` |
| Employee | `/employee` |
| Admin | `/admin` |
| Super Admin | `/super-admin` |

Direct URLs without logging in redirect to the home page.

### Database commands

```bash
npm run db:seed-expanded    # add customers, employees, transactions across all portals
npm run db:verify      # run system checks
npm run db:check       # confirm Supabase connection
```
