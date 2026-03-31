---
name: 🖼️ daily-news-collage
description: Generate a cartoon-style illustrated news collage showing the biggest daily news stories. Use when the user wants to create a visual news summary, news illustration, illustrated news digest, or daily news image using nanobanana.
---

# Daily News Collage Generator

Generate a cartoon-style illustrated news collage showing the biggest daily news stories using the nanobanana MCP tool.

## When to use this Skill

Use this Skill when:
- User wants to generate a visual news summary
- User asks for an illustrated news digest or collage
- User wants a cartoon-style news image
- User mentions "daily news collage" or "news illustration"

## Instructions

### Step 1: Calculate yesterday's date

Determine yesterday's date in a readable format (e.g., "January 16, 2026") to include in the image.

### Step 2: Generate the news collage image

Use the `mcp__nanobanana__generate_image` tool with the following parameters:

**Prompt:**
```
Create a cartoon-style illustrated news collage showing the biggest daily news stories of the previous day.

The image should be divided into multiple rectangular comic-style panels (4–8 boxes), arranged like a newspaper front page or comic strip.

Each panel depicts a different major news theme, such as:

- global politics or diplomacy
- breaking world events or conflicts
- economy and markets
- technology or AI news
- climate or natural events
- culture, sports, or entertainment

Use simple, expressive cartoon illustrations, bold outlines, bright but balanced colors, and clear visual storytelling.

IMPORTANT: Each panel must have a small, clean caption bar at the bottom with a brief 2-5 word description of the specific news story being depicted (e.g., "US-China Trade Talks", "Tech Stocks Rally", "Climate Summit 2026", "AI Breakthrough", "World Cup Finals"). Use a simple sans-serif font, white or light background for the caption bar, dark text for readability.

Put yesterday's date ([INSERT YESTERDAY'S DATE HERE]) in the bottom right corner of the image.

Overall tone should feel like a modern illustrated news summary—informative, dynamic, and slightly playful, not childish.

High detail, clean composition, consistent art style across all panels, white or light background, editorial illustration quality.
```

**Recommended parameters:**
- `aspect_ratio`: "3:4" (portrait newspaper style)
- `model_tier`: "pro" (for higher quality)
- `resolution`: "high"
- `negative_prompt`: "childish, messy, blurry, low quality, photorealistic, 3D render, illegible text, hard to read captions"

### Step 3: Move the generated image to artifacts/images

After the image is generated, move it from the nanobanana temp folder to the project's `artifacts/images` directory with a descriptive filename.

Use PowerShell (Windows) or bash to move the file:

```powershell
# Windows PowerShell (relative to current project)
Move-Item -Path "<source_path>" -Destination ".\artifacts\images\news-collage-YYYY-MM-DD.png"
```

```bash
# Linux/Mac (relative to current project)
mv "<source_path>" "./artifacts/images/news-collage-YYYY-MM-DD.png"
```

**Note:** Ensure the `artifacts/images` directory exists in the current project before moving. Create it if needed:
```bash
mkdir -p ./artifacts/images
```

Replace `YYYY-MM-DD` with yesterday's date in ISO format.

### Step 4: Report completion

Inform the user:
1. The image has been generated successfully
2. The final file location in `artifacts/images/`
3. Image dimensions and file size
4. Offer to regenerate if adjustments are needed

## Example usage

**User:** "Generate today's news collage"

**Response:**
1. Calculate yesterday's date (e.g., January 16, 2026)
2. Call nanobanana with the news collage prompt including the date
3. Move the generated image to `artifacts/images/news-collage-2026-01-16.png`
4. Report success with file location

## Output

The skill produces:
- A high-quality PNG image (approximately 1408x768 or similar)
- Saved to `artifacts/images/news-collage-YYYY-MM-DD.png`
- Features 4-8 comic-style panels covering major news themes
- Includes yesterday's date in the bottom right corner

## Requirements

- nanobanana MCP server must be configured and running
- Write access to the `artifacts/images` directory
