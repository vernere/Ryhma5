import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ErrorSwap() {
  if (import.meta.env.PROD) return null;

  const { t } = useTranslation();

  useEffect(() => {
    const replaceInTextNodes = (root) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      const re = /User\s+"([^"]+)"\s+not\s+found/i;  
      while ((node = walker.nextNode())) {
        const m = node.nodeValue && node.nodeValue.match(re);
        if (m) {
          const username = m[1];
          node.nodeValue = t("errors.userNotFound", { username });
        }
      }
    };

    const run = () => replaceInTextNodes(document.body);

    const obs = new MutationObserver(() => run());
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    run();
    return () => obs.disconnect();
  }, [t]);

  return null;
}
