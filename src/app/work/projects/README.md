# Work Project Content Structure

Use one stable slug for the same project, then add language variants when needed.

## Flat files

```text
DeveloperEvalutionSystem.ja.mdx
DeveloperEvalutionSystem.en.mdx
DeveloperEvalutionSystem.zh.mdx
```

## Folder files

```text
DeveloperEvalutionSystem/
  ja.mdx
  en.mdx
  zh.mdx
```

Both structures create the same public routes:

```text
/work/DeveloperEvalutionSystem
/work/DeveloperEvalutionSystem/en
/work/DeveloperEvalutionSystem/zh
```

The default `/work/DeveloperEvalutionSystem` version is selected in this order:

1. `DeveloperEvalutionSystem.mdx` or `DeveloperEvalutionSystem/index.mdx`
2. English
3. Japanese
4. Chinese

Add `language: en`, `language: ja`, or `language: zh` to frontmatter when a file name does not include the language code.

Recommended project sections:

```mdx
## Context
## My Role
## Technical Design
## Key Decisions
## Challenges
## Behavior Story
## Impact
## Lessons Learned
## Interview Pitch
```
