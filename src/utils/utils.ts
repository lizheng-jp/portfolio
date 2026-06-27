import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export const contentLanguages = {
  zh: {
    label: "Chinese",
    nativeLabel: "中文",
    shortLabel: "中",
  },
  ja: {
    label: "Japanese",
    nativeLabel: "日本語",
    shortLabel: "日",
  },
  en: {
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
  },
} as const;

export type ContentLanguage = keyof typeof contentLanguages;

const contentLanguageOrder: ContentLanguage[] = ["en", "ja", "zh"];
const languageAliases: Record<string, ContentLanguage> = {
  cn: "zh",
  ch: "zh",
  chinese: "zh",
  zh: "zh",
  jp: "ja",
  japanese: "ja",
  ja: "ja",
  english: "en",
  eng: "en",
  en: "en",
};

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

export type PostMetadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  language?: ContentLanguage;
};

export type PostVariant = {
  language?: ContentLanguage;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  title: string;
  isDefault: boolean;
};

export type Post = {
  metadata: PostMetadata;
  slug: string;
  content: string;
  language?: ContentLanguage;
  availableLanguages: ContentLanguage[];
  variants: PostVariant[];
  isDefaultLanguage: boolean;
};

type ParsedMDXFile = {
  filePath: string;
  slug: string;
  languageHint?: ContentLanguage;
};

type RawPostVariant = {
  metadata: PostMetadata;
  slug: string;
  content: string;
  language?: ContentLanguage;
  variantKey: ContentLanguage | "default";
  filePath: string;
};

export function normalizeContentLanguage(value: unknown): ContentLanguage | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return languageAliases[value.trim().toLowerCase()];
}

function parseFlatMDXFile(dir: string, file: string): ParsedMDXFile | undefined {
  if (path.extname(file) !== ".mdx") {
    return undefined;
  }

  const basename = path.basename(file, ".mdx");
  const parts = basename.split(".");
  const languageHint =
    parts.length > 1 ? normalizeContentLanguage(parts[parts.length - 1]) : undefined;
  const slug = languageHint ? parts.slice(0, -1).join(".") : basename;

  return {
    filePath: path.join(dir, file),
    slug,
    languageHint,
  };
}

function parseFolderMDXFile(dir: string, folder: string, file: string): ParsedMDXFile | undefined {
  if (path.extname(file) !== ".mdx") {
    return undefined;
  }

  const basename = path.basename(file, ".mdx");
  const languageHint = normalizeContentLanguage(basename);

  if (basename !== "index" && basename !== "default" && !languageHint) {
    return undefined;
  }

  return {
    filePath: path.join(dir, folder, file),
    slug: folder,
    languageHint,
  };
}

function getMDXFiles(dir: string): ParsedMDXFile[] {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: ParsedMDXFile[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    if (entry.isFile()) {
      const parsed = parseFlatMDXFile(dir, entry.name);
      if (parsed) {
        files.push(parsed);
      }
      continue;
    }

    if (entry.isDirectory()) {
      const folderPath = path.join(dir, entry.name);
      const folderFiles = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((file) => file.isFile());

      for (const file of folderFiles) {
        const parsed = parseFolderMDXFile(dir, entry.name, file.name);
        if (parsed) {
          files.push(parsed);
        }
      }
    }
  }

  return files.sort((a, b) => {
    if (a.slug !== b.slug) {
      return a.slug.localeCompare(b.slug);
    }

    return a.filePath.localeCompare(b.filePath);
  });
}

function readMDXFile(filePath: string, languageHint?: ContentLanguage) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  const language = normalizeContentLanguage(data.language) ?? languageHint;

  const metadata: PostMetadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "",
    team: data.team || [],
    link: data.link || "",
    language,
  };

  return { metadata, content, language };
}

function groupVariants(variants: RawPostVariant[]) {
  const groups = new Map<string, RawPostVariant[]>();

  for (const variant of variants) {
    const group = groups.get(variant.slug) || [];
    const duplicateIndex = group.findIndex((item) => item.variantKey === variant.variantKey);

    if (duplicateIndex >= 0) {
      group[duplicateIndex] = variant;
    } else {
      group.push(variant);
    }

    groups.set(variant.slug, group);
  }

  return groups;
}

function selectDefaultVariant(variants: RawPostVariant[]) {
  const original = variants.find((variant) => variant.variantKey === "default");

  if (original) {
    return original;
  }

  for (const language of contentLanguageOrder) {
    const variant = variants.find((item) => item.language === language);
    if (variant) {
      return variant;
    }
  }

  return variants[0];
}

function selectVariant(variants: RawPostVariant[], language?: ContentLanguage) {
  if (language) {
    const selected = variants.find((variant) => variant.language === language);
    if (selected) {
      return selected;
    }
  }

  return selectDefaultVariant(variants);
}

function getVariantLabel(language?: ContentLanguage) {
  if (!language) {
    return {
      label: "Original",
      nativeLabel: "Original",
      shortLabel: "A",
    };
  }

  return contentLanguages[language];
}

function sortVariants(variants: RawPostVariant[], defaultVariant: RawPostVariant) {
  return [...variants].sort((a, b) => {
    if (a.variantKey === defaultVariant.variantKey) {
      return -1;
    }

    if (b.variantKey === defaultVariant.variantKey) {
      return 1;
    }

    if (!a.language) {
      return -1;
    }

    if (!b.language) {
      return 1;
    }

    return contentLanguageOrder.indexOf(a.language) - contentLanguageOrder.indexOf(b.language);
  });
}

function buildPost(variants: RawPostVariant[], language?: ContentLanguage): Post {
  const defaultVariant = selectDefaultVariant(variants);
  const selectedVariant = selectVariant(variants, language);
  const sortedVariants = sortVariants(variants, defaultVariant);
  const availableLanguages = sortedVariants
    .map((variant) => variant.language)
    .filter((item): item is ContentLanguage => Boolean(item));

  return {
    metadata: selectedVariant.metadata,
    slug: selectedVariant.slug,
    content: selectedVariant.content,
    language: selectedVariant.language,
    availableLanguages,
    variants: sortedVariants.map((variant) => {
      const labels = getVariantLabel(variant.language);

      return {
        language: variant.language,
        label: labels.label,
        nativeLabel: labels.nativeLabel,
        shortLabel: labels.shortLabel,
        title: variant.metadata.title,
        isDefault: variant.variantKey === defaultVariant.variantKey,
      };
    }),
    isDefaultLanguage: selectedVariant.variantKey === defaultVariant.variantKey,
  };
}

function getMDXData(dir: string, language?: ContentLanguage) {
  const mdxFiles = getMDXFiles(dir);
  const variants = mdxFiles.map((file) => {
    const { metadata, content, language } = readMDXFile(file.filePath, file.languageHint);
    const variantKey: RawPostVariant["variantKey"] = language || "default";

    return {
      metadata,
      slug: file.slug,
      content,
      language,
      variantKey,
      filePath: file.filePath,
    };
  });
  const groups = groupVariants(variants);

  return Array.from(groups.values()).map((group) => buildPost(group, language));
}

function getContentDir(customPath: string[]) {
  const pathParts = customPath.filter(Boolean);

  if (pathParts[0] === "src" && pathParts[1] === "app") {
    return path.join(process.cwd(), "src", "app", ...pathParts.slice(2));
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), ...pathParts);
}

export function getPosts(customPath = ["", "", "", ""], language?: ContentLanguage) {
  const postsDir = getContentDir(customPath);
  return getMDXData(postsDir, language);
}

export function getPost(customPath = ["", "", "", ""], slug: string, language?: ContentLanguage) {
  return getPosts(customPath, language).find((post) => post.slug === slug);
}

export function getPostLanguageParams(customPath = ["", "", "", ""]) {
  return getPosts(customPath).flatMap((post) =>
    post.availableLanguages.map((language) => ({
      slug: post.slug,
      lang: language,
    })),
  );
}
