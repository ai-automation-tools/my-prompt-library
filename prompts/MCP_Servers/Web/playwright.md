# Playwright Skill Prompt List
_Focus: scraping data, pulling images, and technical analysis of websites_

## Setup & Navigation
- Use the Playwright skill to Open [url] in a headless browser
- Use the Playwright skill to Open [url] with a desktop Chrome user agent
- Use the Playwright skill to Open [url] with a mobile device emulation
- Use the Playwright skill to Wait for the page to fully load on [url]
- Use the Playwright skill to Navigate to [url] and capture a screenshot

## Page Scraping (Text / Structured Data)
- Use the Playwright skill to Scrape all visible text from [url]
- Use the Playwright skill to Extract the main article content from [url]
- Use the Playwright skill to Scrape all headings (h1–h6) from [url]
- Use the Playwright skill to Scrape all links from [url] and return them as JSON
- Use the Playwright skill to Scrape all tables from [url] into structured rows/columns
- Use the Playwright skill to Extract all product names and prices from [url]
- Use the Playwright skill to Extract all FAQ questions and answers from [url]
- Use the Playwright skill to Scrape all metadata (title, description, canonical, OG tags) from [url]
- Use the Playwright skill to Extract schema.org JSON-LD structured data from [url]

## Scrape Dynamic / JS-Rendered Content
- Use the Playwright skill to Load [url], scroll to the bottom, and scrape all loaded items
- Use the Playwright skill to Click the "Load more" button repeatedly on [url] until done, then scrape results
- Use the Playwright skill to Wait for selector [css selector] on [url] then scrape its content
- Use the Playwright skill to Scrape content from [url] after interacting with the page (clicking tabs/filters)
- Use the Playwright skill to Capture data from an infinite scroll page at [url]

## Forms & Interaction (for scraping workflows)
- Use the Playwright skill to Search for [query] on [url] and scrape the results page
- Use the Playwright skill to Fill in the login form on [url] using credentials (if available) and scrape post-login content
- Use the Playwright skill to Apply filter [filter name/value] on [url] and extract filtered results
- Use the Playwright skill to Select dropdown option [option] on [url] and scrape updated content

## Pull Images & Media
- Use the Playwright skill to Extract all image URLs from [url]
- Use the Playwright skill to Download all images from [url] into a local folder
- Use the Playwright skill to Extract only high-resolution images from [url]
- Use the Playwright skill to Extract all SVG icons from [url]
- Use the Playwright skill to Extract all video sources (mp4/stream URLs) from [url]
- Use the Playwright skill to Screenshot the full page of [url]
- Use the Playwright skill to Screenshot only the element matching selector [css selector] on [url]

## Network & API Analysis
- Use the Playwright skill to Capture all network requests made by [url]
- Use the Playwright skill to Identify XHR/fetch API endpoints used by [url]
- Use the Playwright skill to Export network logs (HAR) for [url]
- Use the Playwright skill to Track requests and responses and extract JSON payloads from [url]
- Use the Playwright skill to Detect third-party trackers and analytics scripts on [url]

## Performance & Technical Auditing
- Use the Playwright skill to Measure page load time and core navigation timing for [url]
- Use the Playwright skill to Identify render-blocking resources on [url]
- Use the Playwright skill to List all external scripts and stylesheets used on [url]
- Use the Playwright skill to Check for console errors and warnings on [url]
- Use the Playwright skill to Analyze responsiveness by testing breakpoints on [url]
- Use the Playwright skill to Detect broken images and missing assets on [url]

## SEO & Content Checks
- Use the Playwright skill to Validate the presence of title/meta description on [url]
- Use the Playwright skill to Check heading hierarchy (h1/h2/h3) on [url]
- Use the Playwright skill to Find duplicate internal links on [url]
- Use the Playwright skill to Identify pages missing canonical tags on [url]
- Use the Playwright skill to Extract OpenGraph and Twitter card metadata from [url]

## Security & Compliance Signals (Lightweight Checks)
- Use the Playwright skill to Check if [url] enforces HTTPS and redirects properly
- Use the Playwright skill to Detect mixed-content issues on [url]
- Use the Playwright skill to Check for common insecure headers missing on [url]
- Use the Playwright skill to Identify all cookies set by [url] and their attributes
- Use the Playwright skill to Detect if [url] loads resources from suspicious domains

## Multi-Page Crawling
- Use the Playwright skill to Crawl [url] and scrape all internal links up to depth [n]
- Use the Playwright skill to Crawl a sitemap at [sitemap url] and extract page titles + meta descriptions
- Use the Playwright skill to Visit each page in this list [urls] and extract [fields] into JSON
- Use the Playwright skill to Crawl category pages starting at [url] and scrape all product cards

## Exporting Results
- Use the Playwright skill to Scrape [url] and export results as JSON
- Use the Playwright skill to Scrape [url] and export results as CSV
- Use the Playwright skill to Scrape [url] and save screenshots + HTML snapshots for analysis
