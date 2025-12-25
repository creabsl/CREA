import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/crea-logo.svg";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";

type IconProps = { className?: string };

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

const YouTubeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
  { label: "Association Body Details", to: "/body-details" },
  { label: "Suggestions", to: "/suggestions" },
  { label: "Mutual Transfers", to: "/mutual-transfers" },
  { label: "Donations", to: "/donations" },
];

const supportLinks = [
  { label: "Help Desk", href: "mailto:creabsl@gmail.com" },
  { label: "Meet the Developers", to: "/developers" },
  { label: "Membership Support", href: "tel:+9195503011162" },
  { label: "Suggestion Box", to: "/suggestions" },
  { label: "Privacy Policy", action: "privacy" },
  { label: "Terms of Service", action: "terms" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    Icon: FacebookIcon,
    badgeClass: "bg-[#1877F2]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    Icon: YouTubeIcon,
    badgeClass: "bg-[#FF0000]",
  },
  {
    label: "X",
    href: "https://twitter.com",
    Icon: XIcon,
    badgeClass: "bg-black",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <footer className="mt-8 border-t bg-white/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-6 md:gap-5">
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center gap-2">
                <img src={Logo} alt="CREA logo" className="h-6 sm:h-7 w-auto" />
                <h2 className="text-xs sm:text-sm font-semibold text-[var(--primary)]">
                  Central Railway Engineers Association
                </h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Strengthening the engineering fraternity with knowledge,
                community,
                <br className="hidden sm:block" /> and timely support.
              </p>
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-gray-500">
              <div>
                HQ: "Dutt Bhawan", New Ashok Nagar (Near Chilla Regulator),
                P.O.-Vasundhara Enclave, Delhi-110096
              </div>
              <div>Working hours: Mon–Sat, 09:30–18:00</div>
            </div>

            <div className="pt-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Connect
              </h3>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-8 gap-3 sm:gap-5 max-w-xs sm:max-w-none">
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
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white shadow-sm ${badgeClass}`}
                    >
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Explore
            </h3>
            <ul className="mt-2 grid grid-cols-2 gap-y-2 gap-x-6 sm:gap-x-10">
              {exploreLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs sm:text-sm text-gray-500 transition hover:text-[var(--primary)]"
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
              {supportLinks.map(({ label, href, to, target, action }: any) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      className="text-xs sm:text-sm text-gray-500 transition hover:text-[var(--primary)]"
                    >
                      {label}
                    </Link>
                  ) : action === "privacy" ? (
                    <button
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-xs sm:text-sm text-[var(--primary)] transition hover:text-[var(--accent)] text-left"
                    >
                      {label}
                    </button>
                  ) : action === "terms" ? (
                    <button
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-xs sm:text-sm text-[var(--primary)] transition hover:text-[var(--accent)] text-left"
                    >
                      {label}
                    </button>
                  ) : (
                    <a
                      href={href}
                      target={target}
                      rel={
                        target === "_blank" ? "noopener noreferrer" : undefined
                      }
                      className="text-xs sm:text-sm text-gray-500 transition hover:text-[var(--primary)]"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs sm:text-sm text-gray-500">
              Follow our updates on social channels and stay informed about
              events and circulars.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:gap-1 border-t border-gray-200 pt-3 text-[10px] sm:text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} CREA — Central Railway Engineers Association. All rights
            reserved.
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-[var(--primary)] transition hover:text-[var(--accent)]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="text-[var(--primary)] transition hover:text-[var(--accent)]"
            >
              Terms of Use
            </button>
            <a
              href="mailto:creabsl@gmail.com"
              className="transition hover:text-[var(--primary)]"
            >
              creabsl@gmail.com
            </a>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
    </footer>
  );
}
