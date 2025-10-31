import { Link } from "react-router-dom";
import Logo from "../assets/crea-logo.svg";

type IconProps = { className?: string };

const LinkedInIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.119 20.452H3.56V9h3.559v11.452zM5.34 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM20.452 20.452h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667h-3.556V9h3.414v1.561h.048c.476-.9 1.639-1.852 3.374-1.852 3.605 0 4.263 2.37 4.263 5.452v6.291z" />
  </svg>
);

const FacebookIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.69v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.919c-1.504 0-1.796.716-1.796 1.765v2.316h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
  </svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M22.46 0h-4.87l-4.83 7.06L8.24 0H1l8.62 12.73L1.14 24h4.87l4.95-7.24L15.76 24h7.24l-8.86-12.91L22.46 0z" />
  </svg>
);

const exploreLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Forum", to: "/forum" },
  { label: "Documents", to: "/documents" },
  { label: "Membership", to: "/apply-membership" },
  { label: "Body Details", to: "/body-details" },
  { label: "Suggestions", to: "/suggestions" },
  { label: "Mutual Transfers", to: "/mutual-transfers" },
];


const supportLinks = [
  { label: "Help Desk", href: "mailto:helpdesk@crea.org" },
  { label: "Membership Support", href: "tel:+911234567890" },
  { label: "Suggestion Box", to: "/suggestions" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    // handle: "@crea-official",
    href: "https://www.linkedin.com",
    Icon: LinkedInIcon,
    badgeClass: "bg-[#0A66C2]",
  },
  {
    label: "Facebook",
    // handle: "/crea.community",
    href: "https://www.facebook.com",
    Icon: FacebookIcon,
    badgeClass: "bg-[#1877F2]",
  },
  {
    label: "Instagram",
    // handle: "@crea.engineers",
    href: "https://www.instagram.com",
    Icon: InstagramIcon,
    badgeClass: "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  {
    label: "X",
    // handle: "@crea_rail",
    href: "https://twitter.com",
    Icon: XIcon,
    badgeClass: "bg-black",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t bg-white/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-5 text-sm text-gray-600">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center gap-2">
                <img src={Logo} alt="CREA logo" className="h-7 w-auto" />
                <h2 className="text-sm font-semibold text-[var(--primary)]">
                  Central Railway Engineers Association
                </h2>
              </div>
              <p className="mt-1 text-gray-500">
                Strengthening the engineering fraternity with knowledge, community,<br />and timely support.
              </p>
            </div>
            <div className="space-y-1 text-gray-500">
              <div>HQ: DRM Office Compound, Mumbai</div>
              <div>Working hours: Mon–Sat, 09:30–18:00</div>
            </div>

            <div className="pt-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Connect
              </h3>
              <div className="mt-2 grid grid-cols-8 gap-5">
                {socialLinks.map(({ label, href, Icon, badgeClass }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-md bg-gray-100/60 px-2.5 py-1.5 text-[11px] text-gray-600 transition hover:bg-gray-50 hover:text-[var(--primary)]"
                  >
                    <span className="sr-only">{label}</span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm ${badgeClass}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {/* <span className="text-[11px] text-gray-400">{handle}</span> */}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Explore
            </h3>
            <ul className="mt-2 grid grid-cols-2 gap-y-2 gap-x-10">
              {exploreLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-500 transition hover:text-[var(--primary)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
              

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Stay Connected
            </h3>
            <ul className="mt-2 space-y-1.5">
              {supportLinks.map(({ label, href, to }) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      className="text-gray-500 transition hover:text-[var(--primary)]"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-gray-500 transition hover:text-[var(--primary)]"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-gray-500">
              Follow our updates on social channels and stay informed about events and circulars.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} CREA — Central Railway Engineers Association. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#" className="transition hover:text-[var(--primary)]">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-[var(--primary)]">
              Terms of Use
            </a>
            <a href="mailto:secretary@crea.org" className="transition hover:text-[var(--primary)]">
              secretary@crea.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
