---
author: Mike
category: Business
date_created: YYYY-MM-DD
subcategory: Marketing
tags:
- email
- marketing
title: Prompt Title
---

# My Prompt Library -- Project Specification

## Overview

Build a web application that functions as a **prompt library** for
managing and accessing frequently used prompts stored in a Git
repository. The application and prompts will live in the **same
repository**.

The app should allow easy browsing, searching, and management of prompts
organized by **categories and subcategories**.

------------------------------------------------------------------------

## 1. Prompt Library Web Application

## Core Requirements

### Sidebar Navigation

The left-hand sidebar will contain a menu listing all **prompt
categories**.

-   Each **category** should expand into **subcategories** when clicked.
-   Subcategories represent folders inside the repository.

### Theme Selector

In the **top-right corner**, add a **theme dropdown selector**.

Requirements: - Provide **7--8 different themes** - Allow users to
customize the look and feel of the page - The UI style should be
**modern, rich, and glass-like**

### Prompt Storage Structure

repo/ prompts/ Category_Name/ Subcategory_Name/ prompt-name.md

Each prompt will be stored as **a single Markdown file**.

### Standard Prompt Format

# Prompt

Prompt text here...

# Usage Notes

Optional usage instructions.

------------------------------------------------------------------------

The metadata will allow the app to: - Determine category/subcategory -
Index prompts - Support filtering and search

------------------------------------------------------------------------

## 2. Documentation Updates

Update:

-   README.md
-   All files inside the /docs directory

Documentation must explain:

-   Repository structure
-   Prompt format
-   How the web application loads prompts
-   How to create new prompts

This ensures **other agents or contributors can work on the project
easily**.

------------------------------------------------------------------------

## 3. Favorites and Recently Viewed

Modify sidebar behavior.

Sections: - Favorites - Recently Viewed

Requirements:

-   Convert both sections to **collapsible dropdowns**
-   Default state should be **collapsed**
-   Users can click to expand

------------------------------------------------------------------------

## 4. Mobile Optimization

Fix mobile UI issues.

Current problem: Buttons such as:

-   Favorite
-   Delete
-   Copy

are **overlapping prompt content**.

Required fixes:

-   Improve responsive layout
-   Ensure buttons do not overlay prompt text
-   Optimize for touch interaction

------------------------------------------------------------------------

## 5. Add System Prompts and Agent Guides

Add two new buttons to the top navigation:

-   System Prompts
-   Agent Guides

Paths:

System Prompts
/home/mike/.openclaw/workspace/projects/my-prompt-library/repo/prompts/System_Prompts

Agent Guides
/home/mike/.openclaw/workspace/projects/my-prompt-library/repo/prompts/Agent_Guides

Notes:

-   These directories already contain files
-   Display them the same way as other prompts
-   Agent Guides are guides rather than prompts but should render
    identically

------------------------------------------------------------------------

## 6. Sidebar Category Update

Use the categories shown in the attached image for the sidebar.

Additional update:

-   Improve theme styling to be **modern, rich, and glass-inspired**

------------------------------------------------------------------------

## 7. Sidebar and Main Page Behavior

When a **subcategory is selected**:

-   Do not list prompts in the sidebar
-   Display all prompts from that subcategory on the **main page**

Example:

Finance → Analysis

All prompts in that subcategory appear on the main page.

Layout:

-   Display prompts in **3-column grid**
-   Remove extra dropdown menus after subcategories

------------------------------------------------------------------------

## 8. Add "All" Subcategory

Each category should include an **All** option.

Example:

Finance All Analysis Forecasting

Selecting **All** shows every prompt in the category.

------------------------------------------------------------------------

## 9. Theme Improvements

Add additional themes similar to:

/home/mike/.openclaw/workspace/projects/my-agents/repo/Docs/Prompt_Library/Prompt_Library_App/Prompt_Library_Final.html

Examples:

-   Dark
-   Light
-   Glass
-   High contrast
-   Additional variants

------------------------------------------------------------------------

## 10. Default Landing Page

Default page should be:

All Prompts

------------------------------------------------------------------------

## 11. Favicon

Add a **prompt-related favicon**.

Style: - Minimal - Modern - AI themed

------------------------------------------------------------------------

## 12. Remove README Files

Delete all:

readme.md

files located inside subcategory folders.

------------------------------------------------------------------------

## 13. Add AI Tool Prompts

Copy prompts from:

/home/mike/.openclaw/workspace/projects/my-agents/repo/Obsidian/Prompts/AI_Tool_Prompts

To:

/home/mike/.openclaw/workspace/projects/my-prompt-library/repo/prompts/AI_Tools

Requirements:

-   Reformat according to project prompt format
-   Ensure categories/subcategories appear correctly in the web UI

------------------------------------------------------------------------

## 14. Major Repository Structure Update

Sidebar top options should be:

My Prompts Collections

New structure:

prompts/ My_Prompts/ Collections/

Changes:

-   Move all existing prompts to **My_Prompts**
-   Collections will be added later

Behavior:

Selecting **My Prompts** → Load prompts only from My_Prompts

Selecting **Collections** → Load prompts only from Collections

Update documentation and configuration accordingly.

------------------------------------------------------------------------

## 15. Collections Import

Copy prompts from:

/home/mike/.openclaw/workspace/projects/my-agents/repo/Obsidian/Prompts/Prompt_Catagories

To:

/home/mike/.openclaw/workspace/projects/my-prompt-library/repo/prompts/Collections

Example structure:

Collections/ AI/ Business/

------------------------------------------------------------------------

## 16. README Updates

Update the repository README to include:

-   Project overview
-   Folder structure
-   Prompt format
-   Web application usage

Also create:

PROMPT_EDITOR_GUIDE.md

This guide should explain:

-   Creating prompts
-   Updating prompts
-   Editing prompts
-   Proper folder placement
-   Metadata requirements

The README should link to this guide.

Purpose: To train AI agents and contributors to create prompts
correctly.

------------------------------------------------------------------------

## 17. Social Media Prompts

Create **10 new prompts** in:

prompts/My_Prompts/Social_Media

Requirements:

-   Place prompts in subfolders (create if necessary)
-   Each prompt should target **social media marketing campaigns**

Focus areas:

-   SaaS
-   AI tools
-   Technology services
-   Web applications

------------------------------------------------------------------------

## 18. Marketing Email Prompts

Create **10 additional prompts** in:

prompts/My_Prompts/Business/Marketing/Email

Each prompt should represent a **unique email marketing campaign**.

Target:

-   Online businesses
-   SaaS companies
-   AI companies
-   Technology services

------------------------------------------------------------------------

## 19. Automated Prompt Import (Cron Job)

Create a cron job for the **my-prompt-library project**.

Schedule:

Daily at 3:30 AM

Process:

1.  Pull sources from:
    /home/mike/.openclaw/workspace/projects/my-prompt-library/openclaw/Docs/Prompt_Libraries.md

2.  Download **3 new prompts**

3.  Format using:
    /home/mike/.openclaw/workspace/projects/my-prompt-library/repo/PROMPT_EDITOR_GUIDE.md

4.  Add to:
    /home/mike/.openclaw/workspace/projects/my-prompt-library/repo/prompts/My_Prompts

5.  Create folders if necessary

Git workflow:

-   Sync with main
-   Commit changes to branch:

mike_desktop

------------------------------------------------------------------------

## 20. Prompt Focus

New prompts should prioritize:

-   IT
-   Cybersecurity
-   Engineering
-   AI agents
-   AI collaboration
-   Startup growth
-   Finance
-   Business strategy

Prompts should be useful for someone who:

-   Works in **IT / Security / Engineering**
-   Is a **partner in an AI startup**
-   Builds **AI agents and automation systems**
-   

------------------------------------------------------------------------

## 21. Redesign UI

I want to do a bit of an overhaul of the file structure and what the ui shows.   Everything that is in "My Prompts" I want moved to "Collections".  So collections will be a giant collection of all of my prompts.  And then for the my prompts section on the ui and folder, I will manually copy or move over the ones I want in the my prompts UI.  So for now there should be no prompts at all in my prompts. UI or folder.  However, I want to leave the folder structure in place. That is currently there, so it'll just be all empty folders.

------------------------------------------------------------------------

## 22. Add button to add to "My Prompts"

ok, can we do this. Whenever a prompt is clicked into from the "Collections" section and we land on the prompts full output page, can we add a button there only to add this to "My Prompts". I dont want a shortcut like the favorites button, only when clicked through can you see this one.
