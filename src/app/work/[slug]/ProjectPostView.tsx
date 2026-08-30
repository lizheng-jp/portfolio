import { notFound } from "next/navigation";
import { getPost, getPostLanguageParams, getPosts, ContentLanguage } from "@/utils/utils";
import {
  Meta,
  Schema,
  AvatarGroup,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Media,
  Text,
  SmartLink,
  Row,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";
import { LanguageSwitcher } from "@/components/content/LanguageSwitcher";

const WORK_POSTS_PATH = ["src", "app", "work", "projects"];

export function getSlugPath(slug: string | string[]) {
  return Array.isArray(slug) ? slug.join("/") : slug || "";
}

export function getProjectPostStaticParams(): { slug: string }[] {
  const posts = getPosts(WORK_POSTS_PATH);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function getProjectPostLanguageStaticParams(): { slug: string; lang: ContentLanguage }[] {
  return getPostLanguageParams(WORK_POSTS_PATH);
}

type ProjectPostPathOptions = {
  basePath?: string;
  pathSlug?: string;
};

function getCurrentPath(
  slug: string,
  language?: ContentLanguage,
  { basePath = work.path, pathSlug = slug }: ProjectPostPathOptions = {},
) {
  const base = pathSlug ? `${basePath}/${pathSlug}` : basePath;
  return language ? `${base}/${language}` : base;
}

export async function getProjectPostMetadata(
  slugPath: string,
  language?: ContentLanguage,
  pathOptions?: ProjectPostPathOptions,
): Promise<Metadata> {
  const post = getPost(WORK_POSTS_PATH, slugPath, language);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: getCurrentPath(post.slug, language, pathOptions),
  });
}

export async function ProjectPostView({
  slugPath,
  language,
  basePath = work.path,
  pathSlug,
  parentHref = work.path,
  parentLabel = "Projects",
  showRelatedProjects = true,
}: {
  slugPath: string;
  language?: ContentLanguage;
  basePath?: string;
  pathSlug?: string;
  parentHref?: string;
  parentLabel?: string;
  showRelatedProjects?: boolean;
}) {
  const post = getPost(WORK_POSTS_PATH, slugPath, language);

  if (!post) {
    notFound();
  }

  const currentPath = getCurrentPath(post.slug, language, { basePath, pathSlug });
  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={currentPath}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={
              post.metadata.image ||
              `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
            }
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href={parentHref}>
              <Text variant="label-strong-m">{parentLabel}</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Heading variant="display-strong-m">{post.metadata.title}</Heading>
            {post.metadata.subtitle && (
              <Text
                variant="body-default-l"
                onBackground="neutral-weak"
                align="center"
                style={{ fontStyle: "italic" }}
              >
                {post.metadata.subtitle}
              </Text>
            )}
            <LanguageSwitcher
              basePath={basePath}
              slug={pathSlug ?? post.slug}
              currentLanguage={post.language}
              variants={post.variants}
            />
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="s" />}
              <Text variant="label-default-m" onBackground="brand-weak">
                {post.metadata.team?.map((member, idx) => (
                  <span key={idx}>
                    {idx > 0 && (
                      <Text as="span" onBackground="neutral-weak">
                        ,{" "}
                      </Text>
                    )}
                    <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
                  </span>
                ))}
              </Text>
            </Row>
          </Row>
          {post.metadata.images.length > 0 && (
            <Media
              priority
              aspectRatio="16 / 9"
              radius="m"
              alt="image"
              src={post.metadata.images[0]}
            />
          )}
          <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
            <CustomMDX source={post.content} />
          </Column>
          {showRelatedProjects && (
            <Column fillWidth gap="40" horizontal="center" marginTop="40">
              <Line maxWidth="40" />
              <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
                Related projects
              </Heading>
              <Projects exclude={[post.slug]} range={[2]} />
            </Column>
          )}
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight header={false} />
      </Column>
    </Row>
  );
}
