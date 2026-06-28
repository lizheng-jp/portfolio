import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import { LanguageSwitcher } from "@/components/content/LanguageSwitcher";
import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ContentLanguage, getPost, getPostLanguageParams, getPosts } from "@/utils/utils";
import { Metadata } from "next";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";

const BLOG_POSTS_PATH = ["src", "app", "blog", "posts"];

export function getSlugPath(slug: string | string[]) {
  return Array.isArray(slug) ? slug.join("/") : slug || "";
}

export function getBlogPostStaticParams(): { slug: string }[] {
  const posts = getPosts(BLOG_POSTS_PATH);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function getBlogPostLanguageStaticParams(): { slug: string; lang: ContentLanguage }[] {
  return getPostLanguageParams(BLOG_POSTS_PATH);
}

function getCurrentPath(slug: string, language?: ContentLanguage) {
  return language ? `${blog.path}/${slug}/${language}` : `${blog.path}/${slug}`;
}

export async function getBlogPostMetadata(
  slugPath: string,
  language?: ContentLanguage,
): Promise<Metadata> {
  const post = getPost(BLOG_POSTS_PATH, slugPath, language);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: getCurrentPath(post.slug, language),
  });
}

export async function BlogPostView({
  slugPath,
  language,
}: {
  slugPath: string;
  language?: ContentLanguage;
}) {
  const post = getPost(BLOG_POSTS_PATH, slugPath, language);

  if (!post) {
    notFound();
  }

  const currentPath = getCurrentPath(post.slug, language);

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
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
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
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
              basePath={blog.path}
              slug={post.slug}
              currentLanguage={post.language}
              variants={post.variants}
            />
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>

          <ShareSection title={post.metadata.title} url={`${baseURL}${currentPath}`} />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Heading>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
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
