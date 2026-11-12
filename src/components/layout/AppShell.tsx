import type { ReactNode } from "react";
import { Heart } from "lucide-react";

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

const COPYRIGHT_YEAR = new Date().getFullYear();

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {header}
      <main className="flex-1 pb-4 sm:pb-6">{children}</main>
      <footer className="mt-8 border-t border-line bg-surface sm:mt-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:gap-5 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-md space-y-2">
              <p className="font-display text-lg text-ink">Family Games</p>
              <p className="text-sm leading-relaxed text-muted">
                A shared collection of games we play together - for familiar,
                fun gatherings.
              </p>
            </div>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-like text-like" aria-hidden />
              <span>
                by <span className="text-ink">Dhanish</span>
              </span>
            </p>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-xs tracking-[0.06em] text-muted/80">
              © {COPYRIGHT_YEAR} Ibrahim · Alimamma Family Collection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
