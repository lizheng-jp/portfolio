# Blog Content Structure

Use one stable slug for the same post, then add language variants when needed.

## Flat files

```text
My-Post.en.mdx
My-Post.ja.mdx
My-Post.zh.mdx
```

## Folder files

```text
My-Post/
  en.mdx
  ja.mdx
  zh.mdx
```

Both structures create the same public routes:

```text
/blog/My-Post
/blog/My-Post/ja
/blog/My-Post/zh
```

The default `/blog/My-Post` version is selected in this order:

1. `My-Post.mdx` or `My-Post/index.mdx`
2. English
3. Japanese
4. Chinese

Add `language: en`, `language: ja`, or `language: zh` to frontmatter when a file name does not include the language code.
