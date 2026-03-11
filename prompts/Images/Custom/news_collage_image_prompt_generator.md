# News Collage Image Prompt Generator

Generate detailed image generation prompts for cartoon-style illustrated news collages based on daily news stories.

---

## Metadata

- **Category:** Images
- **Subcategory:** Custom
- **Complexity:** Intermediate
- **Use Case:** Creating news illustration collages from current events
- **Version:** 1.0
- **Last Updated:** 2026-03-03

---

## Purpose

Creates highly detailed, structured prompts for image generation models to produce cartoon-style news collages. Each collage features 6 panels arranged in a newspaper-style grid, with each panel illustrating a major news story from the day.

---

## Input Requirements

**Required:**
- Date: Yesterday's date or the date being illustrated
- News stories: 6 major news stories from that day (use web search to find current news)

**Optional:**
- Specific style preferences
- Color palette adjustments
- Panel arrangement preferences

---

## Prompt

You are an expert at creating detailed image generation prompts for news illustration collages.

Your task: Analyze the provided news stories and create a detailed prompt for a cartoon-style illustrated news collage. (Use web search to find today's major news stories if not provided)

RULES:
1. Your output MUST be ONLY the image prompt text - nothing else
2. No explanations, no markdown formatting, no prefixes like "Here's the prompt:"
3. Just output the raw prompt text that will be sent directly to an image generator

The prompt you generate should follow this EXACT structure:

```
Create a cartoon-style illustrated news collage showing the biggest daily news stories.

The image should be divided into 6 rectangular comic-style panels, arranged in a 2x3 grid like a newspaper front page.

Panel descriptions (based on actual news stories):
- Panel 1: [Describe a visual scene depicting the first major news story with specific visual elements]
- Panel 2: [Describe a visual scene depicting the second major news story]
- Panel 3: [Describe a visual scene depicting the third major news story]
- Panel 4: [Describe a visual scene depicting the fourth major news story]
- Panel 5: [Describe a visual scene depicting the fifth major news story]
- Panel 6: [Describe a visual scene depicting the sixth major news story]

Style requirements:
- Simple, expressive cartoon illustrations with bold black outlines
- Bright but balanced colors (blues, oranges, greens, yellows)
- Clear visual storytelling in each panel
- Each panel has a small white caption bar at the bottom with 2-5 word headline in dark sans-serif text
- The date "[INSERT YESTERDAY'S DATE]" appears in the bottom right corner of the image
- Modern editorial illustration quality - informative and dynamic, not childish
- Consistent art style across all panels
- White or light cream background
- High detail, clean composition
```

IMPORTANT: Replace [INSERT YESTERDAY'S DATE] with the actual date provided. Make each panel visually distinct and clearly represent the specific news story.

---

## Expected Output

A complete, ready-to-use image generation prompt that:
- Contains NO explanations or metadata
- Is formatted as pure prompt text
- Includes 6 detailed panel descriptions
- Contains the correct date
- Follows the exact structure specified
- Can be sent directly to an image generation model

---

## Example Usage

### Input
```
Date: March 2, 2026

News stories:
1. Tech giant announces breakthrough in quantum computing
2. Major climate agreement reached at international summit
3. Sports team wins championship in overtime thriller
4. New archaeological discovery rewrites ancient history
5. Economic policy changes announced by central bank
6. Celebrity charity event raises record amount
```

### Output
```
Create a cartoon-style illustrated news collage showing the biggest daily news stories.

The image should be divided into 6 rectangular comic-style panels, arranged in a 2x3 grid like a newspaper front page.

Panel descriptions (based on actual news stories):
- Panel 1: A futuristic laboratory scene with a glowing blue quantum computer cube floating above a workstation, surrounded by excited scientists in lab coats pointing at holographic data displays. Circuit patterns and energy waves emanate from the quantum device.
- Panel 2: A diverse group of world leaders standing in a circle around a glowing green Earth hologram, shaking hands and signing documents. Wind turbines and solar panels visible in the stylized background, with olive branches framing the scene.
- Panel 3: A dramatic sports arena moment showing a basketball player mid-jump shooting the winning shot, with a large scoreboard showing overtime, confetti beginning to fall, and crowds with raised arms in celebration silhouettes.
- Panel 4: An archaeological dig site with a researcher carefully uncovering an ornate ancient artifact, surrounded by pottery shards and scrolls. Dusty desert landscape with pyramids in the background and measurement tools scattered around.
- Panel 5: A grand banking building with classical columns, showing a dignified central banker at a podium with economic charts and graphs displayed on screens behind them. Currency symbols and upward/downward arrows float in the air.
- Panel 6: A glamorous charity gala scene with a celebrity on stage holding an oversized novelty check, spotlights shining, elegant attendees applauding, and heart symbols floating above representing the charitable cause.

Style requirements:
- Simple, expressive cartoon illustrations with bold black outlines
- Bright but balanced colors (blues, oranges, greens, yellows)
- Clear visual storytelling in each panel
- Each panel has a small white caption bar at the bottom with 2-5 word headline in dark sans-serif text
- The date "March 2, 2026" appears in the bottom right corner of the image
- Modern editorial illustration quality - informative and dynamic, not childish
- Consistent art style across all panels
- White or light cream background
- High detail, clean composition
```

---

## Tips & Best Practices

### Do's
- **Use web search** to find current major news stories if not provided
- **Be specific** in visual descriptions - mention colors, poses, objects
- **Make each panel unique** - different compositions, perspectives, focal points
- **Keep captions short** - 2-5 words maximum per panel
- **Balance serious and light news** - mix of politics, sports, culture, science
- **Use symbolic elements** - flags, logos, icons that represent the story
- **Create visual hierarchy** - main subject should be clear in each panel
- **Output ONLY the prompt** - no explanations or formatting

### Don'ts
- **Don't add explanations** before or after the prompt
- **Don't use markdown formatting** in the output (no backticks, headers, etc.)
- **Don't make panels too complex** - simple, clear visuals work best
- **Don't forget the date** - always include it in bottom right
- **Don't be generic** - each panel should clearly represent its specific story
- **Don't mix art styles** - maintain consistency across all 6 panels
- **Don't include offensive content** - keep illustrations appropriate for all audiences

### Panel Description Formula

Each panel should include:
1. **Setting/Location:** Where the scene takes place
2. **Main Subject:** The primary focus (person, object, symbol)
3. **Action/Moment:** What's happening
4. **Supporting Elements:** Background details, secondary objects
5. **Visual Metaphors:** Symbolic elements that enhance the story

**Example structure:**
"A [setting] scene showing [main subject] [performing action], surrounded by [supporting elements]. [Visual metaphors or atmosphere details]."

---

## Variations

### Style Variations

**Modern Minimalist:**
- Fewer details, more negative space
- Limited color palette (2-3 colors)
- Geometric shapes
- Flat design aesthetic

**Vintage Newspaper:**
- Sepia or black and white tones
- Halftone dot patterns
- Classic newspaper comic strip style
- Banner headlines instead of caption bars

**Bold Editorial:**
- High contrast colors
- Exaggerated expressions and proportions
- Political cartoon influence
- Caricature-like character designs

### Layout Variations

**Alternative Grid:**
"The image should be divided into 6 panels in a 3x2 grid (3 columns, 2 rows)"

**Featured Story:**
"Panel 1 should be double-width, taking up the entire top row, with 5 smaller panels below in a 2x3 grid"

**Circular Panels:**
"Arrange 6 circular panels in two rows, overlapping slightly like a magazine layout"

---

## Workflow

### Step 1: Gather News
```
Use web search to find top 6 news stories from yesterday:
- Major world/national news
- Politics/policy
- Business/economy
- Sports
- Technology/science
- Culture/entertainment
```

### Step 2: Select Stories
Choose 6 stories that:
- Are visually interesting
- Represent diverse topics
- Have clear visual elements
- Are appropriate for all audiences

### Step 3: Craft Panel Descriptions
For each story:
- Identify the key visual moment
- Choose symbolic elements
- Describe composition and action
- Include color and atmosphere details

### Step 4: Format Output
- Remove ALL explanatory text
- Include ONLY the structured prompt
- Verify date is correct
- Ensure 6 complete panel descriptions
- Double-check style requirements are included

---

## Integration with Image Generation

### Compatible Models
- DALL-E 3
- Midjourney
- Stable Diffusion XL
- Adobe Firefly
- Google Imagen
- Any model that accepts detailed text prompts

### Optimal Settings
- **Aspect Ratio:** 16:9 or 4:3 (landscape for grid layout)
- **Quality:** High/HD setting
- **Style:** Illustration/cartoon mode if available
- **Guidance:** Medium-high (7-12 on 1-15 scale)

### Post-Generation
- May need minor editing for text clarity in caption bars
- Date text might need manual overlay
- Panel borders can be enhanced in post-processing

---

## Related Prompts

- [Image Generation Prompt Engineering] - General image prompt best practices
- [Editorial Illustration Prompts] - Political and editorial cartoon styles
- [Comic Panel Layout Generator] - Other comic-style grid layouts
- [News Summary Automation] - Automated news gathering for collages

---

## Tags

`#images` `#custom` `#news` `#collage` `#cartoon` `#editorial` `#illustration` `#prompt-engineering` `#image-generation`

---

## Notes

**Caption Bar Rendering:**
Most image generators struggle with legible text. The prompt requests caption bars with text, but you may need to:
- Add text manually in post-processing
- Use image editing software to overlay captions
- Generate without caption bars and add them later

**Date Rendering:**
Similarly, the date may not render clearly. Consider:
- Adding date as a separate text overlay
- Using image editing to ensure date is visible
- Positioning date in an area with good contrast

**Story Selection:**
- Prioritize visually distinct stories (avoid 6 similar political stories)
- Balance serious and lighter topics for visual variety
- Choose stories with clear symbolic elements (buildings, objects, people)
- Avoid stories that are too complex to represent in one panel

**Cultural Sensitivity:**
- Be mindful of how different cultures and people are represented
- Avoid stereotypes or caricatures that could be offensive
- Use neutral, respectful visual language
- When depicting sensitive topics, focus on facts not sensationalism

---

**Created by:** OpenClaw Main Agent  
**Inspired by:** Editorial illustration and news graphics design principles
