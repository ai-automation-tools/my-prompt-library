---
name: ai-news-digest
description: Generate and send a weekly AI news digest email by searching multiple tech blogs for the past week and compiling results into a formatted HTML email. Use when the user asks to create a news digest, send AI news summary, compile tech news, or run the weekly news workflow.
tags: ["featured"]
---

# Weekly AI News Digest

Searches 11 AI/ML blog sources for the past week, compiles findings into a categorized HTML digest, and sends it via email.

## Quick Start

When the user asks to run this workflow:
1. Search all news sources using Serper
2. Compile results into HTML email
3. Send via available email MCP tool

## Instructions

### Step 1: Get recipient email

Ask the user for the recipient email address if not provided. Default to asking rather than assuming.

### Step 2: Search AI News Sources (Past Week)

Use the Serper MCP tools (`mcp__serper__google_search`) to search for AI news from the past week from these 11 sources. Use `num: "10"` for 10 results per source to have enough candidates after date filtering.

> **CRITICAL DATE FILTERING**: The `tbs: "w"` parameter is unreliable and often returns old content. You MUST:
> 1. Calculate the date 7 days ago from today (e.g., if today is Jan 18, 2026, use `after:2026-01-11`)
> 2. Add the `after:YYYY-MM-DD` operator to EVERY search query
> 3. After receiving results, ONLY include articles that have a `date` field showing a date within the past 7 days
> 4. Discard any results without a date field or with dates older than 7 days

**Sources to search (run in parallel for speed):**

For each source, append `after:YYYY-MM-DD` with the date 7 days ago. Example for Jan 18, 2026:

```
site:openai.com/news AI after:2026-01-11
site:deepmind.google AI after:2026-01-11
site:research.google AI after:2026-01-11
site:news.mit.edu artificial intelligence after:2026-01-11
site:machinelearningmastery.com after:2026-01-11
site:marktechpost.com AI after:2026-01-11
site:towardsai.net after:2026-01-11
site:tldr.tech AI after:2026-01-11
site:topbots.com AI after:2026-01-11
site:sidbharath.com AI after:2026-01-11
site:digitalocean.com AI machine learning after:2026-01-11
```

**Post-Search Filtering (REQUIRED):**

After collecting all search results, filter them strictly:
1. Check each result's `date` field (e.g., "Jan 15, 2026", "3 days ago")
2. Parse the date and verify it's within the last 7 days
3. **DISCARD** any result that:
   - Has no `date` field
   - Has a date older than 7 days
   - Has only a year (e.g., "2025") without specific date
4. If a source returns no recent results, that's okay - don't include old content just to fill the digest

### Step 3: Compile the Digest

Organize search results into these categories:

1. **Executive Summary** - 2-3 sentences summarizing key themes
2. **Research Breakthroughs** - Academic and lab research news
3. **Industry News** - Business, products, market developments
4. **Tutorials & Guides** - How-to content, learning resources
5. **Tools & Resources** - New tools, platforms, open source projects

Format as clean HTML with:
- Professional styling (Arial font, max-width 700px, white background card)
- Clickable links to source articles
- Color-coded section headers (#1a73e8 blue)
- Footer with source attribution

### Step 4: Determine Email Tool

Check for available email MCP tools in this order of preference:

1. **Google Super (Rube)** - Check for `GOOGLESUPER_SEND_EMAIL` via `mcp__rube__RUBE_SEARCH_TOOLS`
2. **Gmail (Rube)** - Check for `GMAIL_SEND_EMAIL` via `mcp__rube__RUBE_SEARCH_TOOLS`
3. **Direct Gmail MCP** - Check for `mcp__gmail__send_email` if available

**To check Rube tools:**
```
Use mcp__rube__RUBE_SEARCH_TOOLS with:
- queries: [{"use_case": "send an email", "known_fields": "recipient_email: <email>"}]
- session: {"generate_id": true}
```

Look at `toolkit_connection_statuses` in the response:
- If `googlesuper` has `has_active_connection: true` → Use `GOOGLESUPER_SEND_EMAIL`
- If `gmail` has `has_active_connection: true` → Use `GMAIL_SEND_EMAIL`
- If neither is connected → Prompt user to connect via `mcp__rube__RUBE_MANAGE_CONNECTIONS`

### Step 5: Send the Email

Use the available email tool with these parameters:

```json
{
  "recipient_email": "<user-provided-email>",
  "subject": "Weekly AI News Digest - Week of <date range>",
  "body": "<compiled HTML content>",
  "is_html": true
}
```

**Subject line format**: "Weekly AI News Digest - Week of Jan 13-17, 2026"

For Rube tools, use `mcp__rube__RUBE_MULTI_EXECUTE_TOOL` with the appropriate tool_slug.

### Step 6: Confirm Success

Report to the user:
- Email sent successfully
- Message ID (if returned)
- Summary of what was included (counts per category)

## HTML Email Template

```html
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;'>
<div style='background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>

<h1 style='color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;'>Weekly AI News Digest</h1>
<p style='color: #666; font-size: 14px;'>Week of [DATE RANGE] | Past 7 Days in AI</p>

<h2 style='color: #333; margin-top: 25px;'>Executive Summary</h2>
<p style='line-height: 1.6;'>[SUMMARY]</p>

<h2 style='color: #1a73e8; margin-top: 30px;'>Research Breakthroughs</h2>
<ul style='line-height: 1.8;'>
  <li><strong><a href='[URL]' style='color: #1a73e8;'>[Title]</a></strong> - [Description] ([Source])</li>
</ul>

<h2 style='color: #1a73e8; margin-top: 30px;'>Industry News</h2>
<ul style='line-height: 1.8;'>
  <li><strong><a href='[URL]' style='color: #1a73e8;'>[Title]</a></strong> - [Description] ([Source])</li>
</ul>

<h2 style='color: #1a73e8; margin-top: 30px;'>Tutorials & Guides</h2>
<ul style='line-height: 1.8;'>
  <li><strong><a href='[URL]' style='color: #1a73e8;'>[Title]</a></strong> - [Description] ([Source])</li>
</ul>

<h2 style='color: #1a73e8; margin-top: 30px;'>Tools & Resources</h2>
<ul style='line-height: 1.8;'>
  <li><strong><a href='[URL]' style='color: #1a73e8;'>[Title]</a></strong> - [Description] ([Source])</li>
</ul>

<hr style='margin-top: 30px; border: none; border-top: 1px solid #ddd;'>
<p style='color: #999; font-size: 12px; margin-top: 20px;'>
Generated by Claude Code Weekly AI News Digest Skill<br>
Sources: OpenAI, DeepMind, Google Research, MIT News, Machine Learning Mastery, MarkTechPost, Towards AI, TLDR Tech, TOPBOTS, Sid Bharath, DigitalOcean
</p>

</div>
</body>
</html>
```

## Customization Options

Users can customize:
- **Recipients**: Provide different email addresses
- **Sources**: Request additional or different blog sources
- **Categories**: Request different categorization schemes
- **Time Range**: Default is past 7 days (using `after:` date operator), can adjust to 14 or 30 days
- **Frequency**: Designed for weekly delivery, can be scheduled via external scheduler

## Requirements

- **Serper MCP** - For Google search (`mcp__serper__google_search`)
- **Email MCP** - One of:
  - Rube with Google Super connected
  - Rube with Gmail connected
  - Direct Gmail MCP server

## Troubleshooting

**No email tool available:**
- Check if Rube MCP is configured
- Use `RUBE_MANAGE_CONNECTIONS` to connect Gmail or Google Super
- User must complete OAuth flow via provided link

**Search returns no results or very few recent articles:**
- Some sources may not have published in the past week - that's normal
- Try expanding to 14 days by adjusting the `after:` date
- Check if Serper MCP is configured and has credits
- The digest may be shorter some weeks - quality over quantity

**Email not received:**
- Check spam folder
- Verify recipient email address
- Check message ID in response for tracking
