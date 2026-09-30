# Save Life (انقاذ حياة) — Blood Bank Website

A static website for a blood donation platform. It connects blood donors with people who need blood.

The site is written in Arabic and uses right-to-left (RTL) layout.

## Tech

This project is **frontend only**. There is no server, no database, and no build step.

| Part | What is used |
|---|---|
| Markup | HTML5 |
| Styles | CSS3, Bootstrap 4 |
| Scripts | jQuery 3.5.1 |
| Icons | Font Awesome 5 |
| Animations | Animate.css, Owl Carousel |

All libraries are stored locally in the `css/`, `js/`, and `webfonts/` folders, so the site also works offline.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home page. Hero, about us, blood banks, donation camps, testimonials, newsletter |
| `regestration.html` | Sign up page. Social login buttons and a registration modal (address, city, area, blood type) |
| `volunteers.html` | Donor list with filters for blood type and city |
| `bloodRequests.html` | Blood requests list with a blood type filter and a carousel |
| `profile.html` | User profile page with tabs for home, messages, profile, settings |
| `Admin.html` | Admin dashboard for donors, camps, blood requests, and blood banks |

## Folders

```
blood-bank/
├── css/       Bootstrap, Font Awesome, Owl Carousel, and page styles
├── img/       Images, logos, icons (with about/, admin/, profile/, testimonial/ subfolders)
├── js/        jQuery, Bootstrap, Owl Carousel, index.js, searchpages.js
├── video/     Campaign video used on the home page
└── webfonts/  Font Awesome font files
```

Custom CSS file per page: `admin.css`, `index.css`, `profile.css`, `regestration.css`, `volunteer.css`.

## Features

- Responsive navbar with a sticky white background on scroll
- Smooth scrolling between page sections
- Scroll fade-in effect for `.fade` elements
- Animated blood counters on the home page
- Donor cards that slide in when scrolled into view
- Clickable testimonial slider
- Blood type filter (A, B, AB, O) on the donors and requests pages
- City filter with checkboxes on the donors page
- RTL Owl Carousel slider
- Newsletter signup forms
- Working Bootstrap modals for login and registration

## Run it

Open `index.html` in any browser, or start a small server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Notes and limitations

This is a **front-end prototype**. All data is hard-coded in the HTML.

- Registration and login forms do not send data anywhere.
- Donor and request lists do not come from a database.
- The newsletter form is not connected.
- `js/admin.js` is empty and `js/script.js` is referenced by one page but does not exist, so the admin dashboard has no custom logic yet.
- Some blood bank links in `index.html` point to an external placeholder site.
- Some images are loaded over plain HTTP from a CDN, so they will be blocked on HTTPS pages.
- The home page title tag says only "Blood". It could be improved.

## Possible next steps

1. Add a backend and a database to store donors, requests, and camps.
2. Connect the registration and login forms.
3. Filter the donor and request lists with JavaScript.
4. Fix the missing files (`js/script.js`) and the empty `js/admin.js`.
5. Replace external and duplicate image links.
6. Add form validation.
