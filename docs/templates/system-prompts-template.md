---
title: "📝 [System Name]"
tags: ["system-prompt", "llm", "instructions", "platform-name"]
category: "LLM Instructions"
subcategory: "[Platform_Name]"  # e.g., V0.dev, Claude, ChatGPT, Cursor, Gemini
---

# 📝 [System Name]

[Opening description of what this system does and its primary purpose. Explain the AI's role, capabilities, and design philosophy.]

## System Identity

```xml
<system_info>
[System name] is [description of what it is and who created it].
[System name] is designed to [primary purpose and capabilities].
[System name] is always [key characteristics like up-to-date, accurate, friendly, etc.].
[System name] responds using [output format, e.g., MDX, Markdown, JSON] and has access to [specialized components or tools].
[System name] aims to deliver [key values like clarity, efficiency, innovation] while maintaining [tone characteristics].

[System name]'s knowledge spans [domains of expertise].
</system_info>
```

## Core Capabilities

### [Capability Category 1]

```xml
<capability_name>
[Detailed description of what this capability enables the system to do]

#### Structure
[How this capability is structured or implemented]

#### Rules
1. [Rule or constraint 1]
2. [Rule or constraint 2]
3. [Rule or constraint 3]

#### Examples
[Provide concrete examples of this capability in use]

</capability_name>
```

### [Capability Category 2]

```xml
<capability_name>
[Description of this capability]

#### Use Cases
1. [Use case 1]: [Description]
2. [Use case 2]: [Description]
3. [Use case 3]: [Description]

#### Constraints
[Limitations or boundaries of this capability]

</capability_name>
```

## Response Formatting

### [Format Type 1]

[When and how to use this format]

```
[Example of format structure]
```

**Rules:**
- [Rule 1]
- [Rule 2]
- [Rule 3]

### [Format Type 2]

[When and how to use this format]

```
[Example of format structure]
```

**Rules:**
- [Rule 1]
- [Rule 2]
- [Rule 3]

## Domain Knowledge

```xml
<domain_knowledge>
[Specific domain knowledge that informs responses]

### [Domain Area 1]
[Detailed knowledge about this domain]

### [Domain Area 2]
[Detailed knowledge about this domain]

### Sources
<sources>
[Source references numbered 1-X for citations]
</sources>

</domain_knowledge>
```

## Response Guidelines

```xml
<forming_correct_responses>

### 1. Thinking Process
[System name] ALWAYS uses [thinking method] BEFORE providing a response to [reasoning purpose].

NOTE: [Critical thinking requirements]

### 2. Step-by-Step Reasoning
When presented with [problem type], [system name] thinks through it step by step before giving its final answer.

### 3. [Guideline Category]
[Detailed guideline and when it applies]

### 4. [Guideline Category]
[Detailed guideline and when it applies]

#### [Subcategory 1]
[Specific instructions]

1. [Instruction 1]
2. [Instruction 2]
3. [Instruction 3]

#### [Subcategory 2]
[Specific instructions]

#### Citations
[How to cite sources and format references]

<Example>
  <UserQuery>[Example user question]</UserQuery>
  <AssistantResponse>[Example proper response with citations]</AssistantResponse>
</Example>

#### Refusals
[When and how to refuse requests]

REFUSAL_MESSAGE = "[Standard refusal message]"

1. [Refusal condition 1]
2. [Refusal condition 2]
3. [Refusal condition 3]

#### Warnings
[When to add warnings to responses]

WARNING_MESSAGE = "[Standard warning format]"

[Conditions that trigger warnings]

</forming_correct_responses>
```

## Example Interactions

```xml
<examples>

<example>
<doc_string>[What this example demonstrates]</doc_string>
<user_query>[User's question or request]</user_query>
<assistant_response>
[How the system should respond, including:]
- Thinking process (if applicable)
- Actual response
- Code examples (if applicable)
- Explanations
</assistant_response>
</example>

<example>
<doc_string>[What this example demonstrates]</doc_string>
<user_query>[User's question or request]</user_query>
<assistant_response>
[System's proper response]
</assistant_response>
</example>

<example>
<doc_string>[What this example demonstrates - refusal case]</doc_string>
<user_query>[Inappropriate request]</user_query>
<assistant_response>
<Thinking>[Why this should be refused]</Thinking>
[Refusal message]
</assistant_response>
</example>

</examples>
```

## Special Components

### [Component Type 1]

[When and how to use this component]

**Properties:**
- `property1`: [Description and type]
- `property2`: [Description and type]
- `property3`: [Description and type]

**Example:**
```
[Component usage example]
```

### [Component Type 2]

[When and how to use this component]

**Syntax:**
```
[Syntax format]
```

**Rules:**
- [Rule 1]
- [Rule 2]

## Advanced Features

### [Feature 1]
[Description of advanced feature]

**Implementation:**
```
[How to implement or use this feature]
```

### [Feature 2]
[Description of advanced feature]

**Use Cases:**
1. [Use case 1]
2. [Use case 2]
3. [Use case 3]

## Constraints & Limitations

### What [System Name] CAN Do
- [Capability 1]
- [Capability 2]
- [Capability 3]

### What [System Name] CANNOT Do
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

### Safety Boundaries
1. [Safety rule 1]
2. [Safety rule 2]
3. [Safety rule 3]

## Best Practices

### For Users
1. [Best practice 1]
2. [Best practice 2]
3. [Best practice 3]

### For Developers
1. [Implementation best practice 1]
2. [Implementation best practice 2]
3. [Implementation best practice 3]

## Error Handling

### Common Issues

**Issue 1: [Problem]**
- **Cause:** [Why it happens]
- **Response:** [How system should handle]

**Issue 2: [Problem]**
- **Cause:** [Why it happens]
- **Response:** [How system should handle]

## Configuration Options

### Environment Variables
- `VARIABLE_NAME`: [Description and default value]
- `VARIABLE_NAME`: [Description and default value]

### Feature Flags
- `flag-name`: [What it enables/disables]
- `flag-name`: [What it enables/disables]

## Version Information

**Version:** [X.Y.Z]  
**Last Updated:** [Date]  
**Platform:** [Platform name and URL]

### Changelog
- **v[X.Y]** ([Date]): [Major changes]
- **v[X.Y]** ([Date]): [Major changes]

## References

- [Documentation link 1]
- [API reference link 2]
- [Community resource 3]

---

**Note:** Replace all [bracketed placeholders] with your specific content. Remember to:
- Use XML-style tags (`<tag></tag>`) for structured system instructions
- Include 📝 emoji or appropriate icon at the start of title
- Match subcategory to the AI platform (V0.Dev, Claude, ChatGPT, etc.)
- Provide concrete examples of correct and incorrect responses
- Document all capabilities, constraints, and special formatting rules
- Include thinking process examples wrapped in `<Thinking>` tags
- Define clear refusal and warning conditions
- Use proper citation and source formatting
- Structure domain knowledge in dedicated sections
- Keep examples realistic and detailed
