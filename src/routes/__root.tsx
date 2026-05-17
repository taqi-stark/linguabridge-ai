import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm">
        <h1 className="text-7xl font-display text-bg-primary text-primary-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This page wandered off the map.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-primary-foreground font-medium"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComp({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm">
        <h2 className="text-xl font-display">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-primary-foreground font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
      },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "theme-color", content: "#171717" },
      { title: "LinguaBridge AI — AI Translation between Italian, English & Urdu" },
      {
        name: "description",
        content:
          "Translate text, speech, images, and documents between Italian, English, and Urdu with AI. Voice mode, OCR, live conversations.",
      },
      { property: "og:title", content: "LinguaBridge AI" },
      { property: "og:description", content: "AI-powered multilingual translation assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children: `try{var t=localStorage.getItem('lb-theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComp,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
