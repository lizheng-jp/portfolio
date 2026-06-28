import { Button, Row, Text } from "@once-ui-system/core";
import { ContentLanguage, PostVariant } from "@/utils/utils";

type LanguageSwitcherProps = {
  basePath: string;
  slug?: string;
  currentLanguage?: ContentLanguage;
  variants: PostVariant[];
};

function getVariantHref(basePath: string, slug: string | undefined, variant: PostVariant) {
  const baseHref = slug ? `${basePath}/${slug}` : basePath;

  if (variant.isDefault || !variant.language) {
    return baseHref;
  }

  return `${baseHref}/${variant.language}`;
}

function isSelected(currentLanguage: ContentLanguage | undefined, variant: PostVariant) {
  if (!currentLanguage && !variant.language) {
    return true;
  }

  return currentLanguage === variant.language;
}

export function LanguageSwitcher({
  basePath,
  slug,
  currentLanguage,
  variants,
}: LanguageSwitcherProps) {
  if (variants.length < 2) {
    return null;
  }

  return (
    <Row fillWidth horizontal="center" vertical="center" gap="8" wrap marginTop="8">
      <Text variant="label-default-s" onBackground="neutral-weak">
        Language
      </Text>
      <Row data-border="rounded" gap="8" horizontal="center" wrap>
        {variants.map((variant) => (
          <Button
            key={variant.language || "default"}
            href={getVariantHref(basePath, slug, variant)}
            variant={isSelected(currentLanguage, variant) ? "primary" : "secondary"}
            size="s"
            label={variant.nativeLabel}
          />
        ))}
      </Row>
    </Row>
  );
}
