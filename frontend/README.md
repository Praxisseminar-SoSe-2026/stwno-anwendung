# Frontend

## Setup
> Be sure to be in the `frontend` directory

### Prerequisites

- Node v24.18.0

### Install Dependencies

```
npm install
```

### Set environment variables

```
cp .env.example .env
```

Set `VITE_API_BASE_URL` in [.env](.env) to the backend URL

## Running

```
npm run dev
```

now it the frontend is available at http://localhost:5173/

## Linting and Formatting

```
npm run lint
npm run format
```

## Routes

### General
| Path | Page |
|---|---|
| `/login` | Login |
| `/registration` | Registration (person number verification) |
| `/set-password` | Set password (second registration step) |

### Resident
| Path | Page |
|---|---|
| `/` | Bulletin board / index |
| `/faq` | FAQ overview |
| `/faq/:id` | FAQ entry detail |
| `/waschmaschinen` | Laundry machines overview |
| `/waschmaschinen/nutzen/:id` | Start a laundry booking for a machine |
| `/reparaturanfrage` | Submit a repair request |
| `/gemeinschaftsraum` | Community room booking calendar |
| `/gemeinschaftsraum/anfrage/:id` | Create a room booking request |
| `/aushang/:id` | Announcement detail |

### Admin
| Path | Page |
|---|---|
| `/admin` | Admin index |
| `/admin/tickets` | Ticket overview (repair + room requests) |
| `/admin/tickets/:id` | Ticket detail |
| `/aushang/neu` | Create announcement |
| `/faq/neu` | Create FAQ entry |
| `/gemeinschaftsraum/neu` | Create community room |
| `/gemeinschaftsraum/:id` | Edit/delete community room |
| `/waschmaschinen/waschraum/neu` | Create laundry room |
| `/waschmaschinen/waschraum/:id` | Edit/delete laundry room |
| `/waschmaschinen/waschraum/:roomId/maschine/neu` | Create laundry machine |
| `/waschmaschinen/waschraum/:roomId/maschine/:id` | Edit/delete laundry machine |
| `/dormitory/neu` | Create dormitory |
| `/dormitory/:id` | Edit/delete dormitory |
| `/admin/users` | User list |
| `/admin/users/:id` | Edit user (roles, dormitory, etc.) |

All routes except `/login`, `/registration`, and `/set-password` require authentication (see [ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)).
