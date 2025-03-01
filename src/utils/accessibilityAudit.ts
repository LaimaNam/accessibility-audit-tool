import axe from "axe-core";

export const accessibilityAudit = async (iframe: HTMLIFrameElement) => {
  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) return [];

  const results = await axe.run(iframeDocument.body);
  return results.violations;
};
