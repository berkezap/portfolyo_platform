import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Template Preview',
  description: 'Preview of portfolio template',
  robots: 'noindex, nofollow', // Preview sayfaları index'lenmemeli
};

interface TemplatePreviewLayoutProps {
  children: React.ReactNode;
}

export default function TemplatePreviewLayout({ children }: TemplatePreviewLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Preview modunda linkleri devre dışı bırak */
            a {
              pointer-events: none !important;
              cursor: default !important;
            }
            
            /* Anchor linklerin çalışmasını engellemek için */
            a[href^="#"] {
              pointer-events: none !important;
            }
            
            /* Butonların da tıklanmasını engelleyelim */
            button {
              pointer-events: none !important;
              cursor: default !important;
            }
            
            /* Form elemanlarını da devre dışı bırakalım */
            input, textarea, select {
              pointer-events: none !important;
              cursor: default !important;
            }
            
            /* Preview için smooth scroll devre dışı */
            * {
              scroll-behavior: auto !important;
            }
          `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
