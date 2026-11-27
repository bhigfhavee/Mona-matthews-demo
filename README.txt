
MONA MATTHEWS — INDEPENDENT WEBSITE DEMONSTRATION
=================================================

PROJECT OVERVIEW
----------------

This repository contains an independent, static website design
demonstration inspired by the Mona Matthews brand.

It is a frontend concept intended to demonstrate a possible
e-commerce experience. It is not an official Mona Matthews
website or a verified representation of the business's current
products, prices, services or operations.

TECHNOLOGY
----------

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

No frontend framework, package manager or build process is
required.

PROJECT STRUCTURE
-----------------

The project uses a flat root-level file structure:

Mona-matthews-demo/
|
|-- index.html
|-- shop.html
|-- cart.html
|-- bespoke.html
|-- style.css
|-- script.js
|-- README.txt

Do not move style.css or script.js into separate css/ or js/
directories unless the HTML asset references are updated too.

FUNCTIONALITY
-------------

Homepage:
- Brand-inspired landing page.
- Navigation to the shop, shopping bag and bespoke pages.

Shop:
- Demonstration product catalogue.
- Product category filtering.
- Add-to-bag interactions.

Shopping bag:
- Browser-based cart state using localStorage.
- Quantity adjustment and item removal.
- Demonstration cart totals.

Bespoke:
- Demonstration enquiry form.
- Client-side form validation and preview feedback.

IMPORTANT FUNCTIONAL LIMITATIONS
--------------------------------

This is a frontend-only demonstration.

- Product names, photographs and prices are illustrative.
- The catalogue is not a verified business inventory.
- The shopping bag is stored locally in the visitor's browser.
- There is no backend order processing.
- There is no payment gateway or real checkout.
- The bespoke form does not send or store enquiries.
- No inventory, customer account or order-management system
  is connected.
- No verified business contact integration is enabled.

Do not use this demonstration to accept real orders or payments.

EXTERNAL DEPENDENCIES
--------------------

Some photographs are loaded from Unsplash using external image
URLs. Google Fonts are also loaded externally.

These resources require an internet connection and may be
unavailable if their external providers change or remove them.

RUNNING LOCALLY
---------------

You can open index.html directly in a modern browser.

For a local HTTP server, run this command from the repository
root if Python is installed:

python -m http.server 8000

Then open:

http://localhost:8000

DEPLOYMENT
----------

This is a static website and does not require a compilation step.

For the existing Vercel deployment:
1. Connect the GitHub repository to the Vercel project.
2. Use the repository root as the project root.
3. Do not configure a build command for this plain static site.
4. Deploy the project and inspect the generated deployment URL.

If using another static hosting provider, publish the repository
root directory.

TESTING CHECKLIST
-----------------

Before considering a deployment ready, verify:

- All four HTML pages load.
- CSS and JavaScript load without 404 errors.
- Navigation links work between pages.
- Product category filters work.
- Products can be added to the shopping bag.
- Cart quantities can be changed.
- Cart items can be removed.
- Cart data behaves correctly after a page refresh.
- The bespoke form validates required fields.
- The demonstration limitations are visible.
- Layouts work on mobile and desktop.
- No unverified contact or payment links are exposed.

PROJECT STATUS
--------------

Independent frontend demonstration.

Not production-ready for real commerce, order collection,
payment processing or customer enquiry handling.
