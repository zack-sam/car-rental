import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { CONTACT } from "@/lib/contact";
import LanguageSwitcher from "./LanguageSwitcher";

const SiteLayout = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/cars", label: t("nav.fleet") },
    { to: "/booking", label: t("nav.book") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".site-main section, .site-main article, .site-main aside, .site-main form > div, .site-main .grid > div, footer .container",
      ),
    );

    candidates.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.setProperty("--motion-delay", `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    candidates.forEach((element) => observer.observe(element));

    requestAnimationFrame(() => {
      candidates.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      });
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <header className="fixed top-0 inset-x-0 z-50 animate-header-drop">
        <div className="container max-w-7xl pt-3 sm:pt-5">
          <div className="relative">
            <div className="flex h-14 items-center justify-between rounded-2xl border border-primary/20 bg-background/42 px-3 sm:px-4 shadow-[0_18px_70px_-42px_hsl(var(--primary)/0.85)] backdrop-blur-2xl ring-1 ring-white/10">
              <Link to="/" className="flex min-w-0 items-center gap-2 transition-smooth hover:scale-[1.02]">
                <img src="/logo.svg" alt="Alaoui Car Rental logo" className="w-8 h-8 shrink-0 object-contain logo-float" />
                <span className="truncate font-display text-base sm:text-xl leading-none tracking-tight">Alaoui Car Rental</span>
              </Link>
              <nav className="hidden md:flex items-center gap-7">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `font-mono-label nav-motion transition-smooth hover:text-primary ${
                        isActive ? "text-primary" : "text-foreground/70"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <Link
                  to="/booking"
                  className="hidden sm:inline-flex font-mono-label rounded-xl border border-white/10 bg-foreground/95 px-5 py-3 text-background shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25)] hover:bg-primary hover:text-primary-foreground hover:shadow-glow transition-smooth hover:-translate-y-0.5"
                >
                  {t("nav.reserve")}
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/55 text-foreground md:hidden"
                  aria-label="Toggle navigation"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="absolute inset-x-0 top-[calc(100%+0.65rem)] rounded-2xl border border-primary/20 bg-background/90 p-3 shadow-elegant backdrop-blur-2xl md:hidden">
                <nav className="grid gap-1">
                  {navLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        `rounded-xl px-4 py-3 font-mono-label transition-smooth ${
                          isActive ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </nav>
                <Link
                  to="/booking"
                  className="mt-3 flex items-center justify-center rounded-xl bg-gradient-amber px-5 py-3 font-mono-label text-primary-foreground"
                >
                  {t("nav.reserve")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="site-main flex-1 pt-24">
        <Outlet />
      </main>
      <footer className="mt-32 border-t border-border/40 bg-background/55">
        <div className="container max-w-7xl py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-display text-3xl mb-4">Alaoui Car Rental</div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              {t("hero.sub")}
            </p>
          </div>
          <div>
            <div className="font-mono-label text-primary mb-4">{t("footer.explore")}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-foreground transition-smooth">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono-label text-primary mb-4">{t("footer.contact")}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={CONTACT.emailHref} className="contact-ltr inline-block hover:text-foreground transition-smooth">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="contact-ltr inline-block hover:text-foreground transition-smooth">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="hover:text-foreground transition-smooth">
                  WhatsApp
                </a>
                {" · "}
                <a href={CONTACT.instagramHref} target="_blank" rel="noreferrer" className="hover:text-foreground transition-smooth">
                  Instagram
                </a>
              </li>
              <li>{t("footer.locations")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40">
          <div className="container max-w-7xl py-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Alaoui Car Rental.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
