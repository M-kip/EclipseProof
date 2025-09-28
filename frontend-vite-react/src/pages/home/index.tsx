import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Fingerprint,
  Globe,
  Lock,
  ShieldCheck,
  Sparkles,
  Wallet2,
  Zap,
} from "lucide-react";
import { useAssets, useWallet } from "@meshsdk/midnight-react";

type Stat = {
  readonly label: string;
  readonly suffix?: string;
  readonly base: number;
  readonly formatter?: (value: number) => string;
};

type Step = {
  readonly title: string;
  readonly description: string;
  readonly detail: string;
};

type Feature = {
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
};

type UseCase = {
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
};

type NetworkSignal = {
  readonly label: string;
  readonly value: string;
  readonly accent: string;
};

const stats: Stat[] = [
  { label: "Zero-Knowledge Proofs", base: 42809, suffix: "+" },
  { label: "Active Users", base: 1846, suffix: "+" },
  { label: "Privacy Protected", base: 99.9, suffix: "%" },
];

const features: Feature[] = [
  {
    title: "Private by Design",
    description: "Your financial data never leaves your device. Zero-knowledge proofs verify income without revealing details.",
    icon: <Lock className="h-6 w-6 text-emerald-300" />,
  },
  {
    title: "Instant Verification", 
    description: "Generate proofs in seconds. Verifiers get immediate confirmation without accessing sensitive information.",
    icon: <Zap className="h-6 w-6 text-cyan-300" />,
  },
  {
    title: "Blockchain Security",
    description: "Built on Midnight Network with cryptographic guarantees and decentralized verification.",
    icon: <ShieldCheck className="h-6 w-6 text-purple-300" />,
  },
];

const steps: Step[] = [
  {
    title: "Connect Wallet",
    description: "Link your Midnight wallet",
    detail: "Connect securely using your Lace wallet to authenticate your identity.",
  },
  {
    title: "Generate Proof",
    description: "Create income verification",
    detail: "Upload your payslip data locally and generate a zero-knowledge proof.",
  },
  {
    title: "Share Safely",
    description: "Verify without revealing",
    detail: "Share your proof with verifiers while keeping all personal data private.",
  },
];



const useCases: UseCase[] = [
  {
    title: "Rental Applications",
    description: "Prove income eligibility to landlords without sharing payslips or bank statements.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Loan Approvals",
    description: "Get credit approvals faster while keeping your financial details completely private.",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    title: "Background Checks", 
    description: "Verify employment and income for background checks without document sharing.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
];



const networkSignals: NetworkSignal[] = [
  { label: "Network Status", value: "Midnight · Operational", accent: "text-emerald-300" },
  { label: "Average Proof Time", value: "412ms", accent: "text-cyan-300" },
  { label: "Gas Estimation", value: "0.004 MID", accent: "text-indigo-300" },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { hasConnectedWallet, walletName, address } = useAssets();
  const { setOpen, disconnect } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [statValues, setStatValues] = useState(() => stats.map((item) => item.base));
  const [networkPulse, setNetworkPulse] = useState(0);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatValues((prev) =>
        prev.map((value, index) =>
          value + Math.max(1, Math.floor(Math.random() * (index === 1 ? 120 : 12))),
        ),
      );
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNetworkPulse((prev) => (prev + 1) % networkSignals.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (hasConnectedWallet && connecting) {
      setConnecting(false);
    }
  }, [hasConnectedWallet, connecting]);

  useEffect(() => {
    if (!portalRef.current) {
      return undefined;
    }

    const element = portalRef.current;
    const handle = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--mouse-x", `${x}%`);
      element.style.setProperty("--mouse-y", `${y}%`);
    };

    element.addEventListener("mousemove", handle);
    return () => element.removeEventListener("mousemove", handle);
  }, []);

  useEffect(() => {
    if (hasConnectedWallet) {
      const redirectTimer = window.setTimeout(() => {
        navigate("/app", { replace: true });
      }, 900);
      return () => window.clearTimeout(redirectTimer);
    }

    return undefined;
  }, [hasConnectedWallet, navigate]);

  const ctaLabel = useMemo(() => {
    if (connecting) {
      return "Connecting...";
    }
    return hasConnectedWallet ? "Launch dApp" : "Connect Wallet";
  }, [connecting, hasConnectedWallet]);

  const truncatedAddress = useMemo(() => {
    if (!address) {
      return undefined;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const handleCTA = () => {
    if (hasConnectedWallet) {
      navigate("/app");
      return;
    }

    setConnecting(true);
    setOpen(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050510] text-white">
      <style>
        {`
          @keyframes particleFloat {
            0% { transform: translateY(0px) translateX(0px); opacity: 0.75; }
            50% { transform: translateY(-12px) translateX(6px); opacity: 1; }
            100% { transform: translateY(0px) translateX(0px); opacity: 0.75; }
          }
          @keyframes auroraWave {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(70,35,190,0.3),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(3,143,214,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 animate-[auroraWave_18s_ease-in-out_infinite] bg-[length:200%_200%] bg-[linear-gradient(120deg,_rgba(139,92,246,0.28)_0%,_rgba(0,217,255,0.18)_50%,_rgba(0,255,136,0.25)_100%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(16,24,48,0.92)_0%,_rgba(5,8,25,0.98)_65%,_rgba(5,8,25,1)_100%)]" />
        {[...Array(45)].map((_, index) => (
          <div
            key={`particle-${index}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400/40 shadow-[0_0_12px_rgba(0,217,255,0.6)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particleFloat ${8 + Math.random() * 8}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#0a0a23]/80 via-[#050510]/70 to-transparent" />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold uppercase tracking-[0.35em] text-purple-300">
            EclipseProof
          </span>
          <div className="hidden h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 md:block" />
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
          <a href="#protocol" className="transition hover:text-white">
            Protocol
          </a>
          <a href="#technology" className="transition hover:text-white">
            Technology
          </a>
          <a href="#developers" className="transition hover:text-white">
            Developers
          </a>
          <a href="#ecosystem" className="transition hover:text-white">
            Ecosystem
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {hasConnectedWallet && (
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-200 backdrop-blur md:flex">
              <span className="font-mono text-slate-100">
                {walletName ? `${walletName} · ` : ""}
                {truncatedAddress}
              </span>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300 transition hover:text-emerald-200"
                onClick={handleDisconnect}
              >
                Logout
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleCTA}
            disabled={connecting}
            className="group relative overflow-hidden rounded-full border border-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,217,255,0.35)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center gap-2">
              {connecting ? "Authenticating" : ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 translate-y-full bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_0%,_transparent_70%)] transition duration-500 group-hover:translate-y-0" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24">
        <section
          id="hero"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 pb-12 pt-16 shadow-[0_25px_60px_rgba(8,8,40,0.55)] backdrop-blur-xl"
        >
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Private Income Verification
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Prove your income without revealing your data
              </h1>
              <p className="max-w-xl text-base text-slate-200/90 sm:text-lg">
                EclipseProof uses zero-knowledge technology to verify your income while keeping all sensitive information completely private.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleCTA}
                  disabled={connecting}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,217,255,0.25),_transparent_70%)] opacity-0 transition group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Wallet2 className="h-4 w-4 text-cyan-300" />
                    {ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200/80">
                  Powered by Midnight × Lace Wallet
                </div>
              </div>
              <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#08091e]/80 p-5 text-xs text-slate-200/80 sm:grid-cols-2">
                {networkSignals.map((signal, index) => (
                  <div key={signal.label} className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.35em] text-[10px] text-slate-400">
                      {signal.label}
                    </span>
                    <span
                      className={`font-semibold ${
                        networkPulse === index ? `${signal.accent} drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]` : "text-slate-100"
                      }`}
                    >
                      {signal.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-cyan-400/10 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#09091f]/85 p-6 shadow-[0_20px_60px_rgba(10,10,38,0.6)]">
                <div className="flex items-center justify-between text-xs text-slate-200/70">
                  <span>Zero-knowledge proof simulator</span>
                  <span className="inline-flex items-center gap-1 text-cyan-300">
                    <Fingerprint className="h-3.5 w-3.5" /> zk-SNARK
                  </span>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-slate-200/90">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-purple-300">Prover Input</span>
                    <span className="text-white/90">Alice · Payslip #8921</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>net_pay</span>
                      <span className="text-emerald-300">£3,420.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>threshold</span>
                      <span className="text-cyan-300">£2,800.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>commitment</span>
                      <span className="truncate text-white/80">0x89a4...fed2</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-[#0c0c28]/80 p-4 text-[11px] text-slate-200">
                  <div className="flex items-center gap-3 text-cyan-300">
                    <Sparkles className="h-4 w-4" /> Proof Generation Pipeline
                  </div>
                  <div className="grid gap-2">
                    <p className="flex justify-between text-slate-400">
                      <span>Poseidon Hash</span>
                      <span>3.1ms</span>
                    </p>
                    <p className="flex justify-between text-slate-400">
                      <span>Merkle Inclusion</span>
                      <span>5.4ms</span>
                    </p>
                    <p className="flex justify-between text-white">
                      <span>Groth16 Prover</span>
                      <span>412ms</span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
                    Verification Result: TRUE · meets_threshold → YES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((item, index) => {
            const value = item.formatter
              ? item.formatter(statValues[index])
              : `${statValues[index].toLocaleString()}${item.suffix ?? ""}`;
            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/60 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,217,255,0.18),_transparent_65%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300/70">
                    {item.label}
                  </p>
                  <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section id="features" className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_25px_60px_rgba(6,8,35,0.6)] backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-white">How EclipseProof works</h2>
            <p className="text-sm text-slate-300">
              Three simple steps to verify your income privately and securely.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#090921]/90 p-6 backdrop-blur transition hover:border-emerald-400/60"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(34,197,94,0.18),_transparent_65%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white/90">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-300/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-semibold text-white">Simple. Secure. Private.</h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              EclipseProof lets you prove your income meets requirements without revealing sensitive financial details to anyone.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a24]/90 p-6">
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-400 via-cyan-400 to-emerald-400" />
                <div className="ml-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-200">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-300/90">{step.description}</p>
                  <p className="text-xs text-slate-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>





        <section id="use-cases" className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-semibold text-white">Perfect for any income verification need</h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              From rental applications to loan approvals, prove your income privately and instantly.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {useCases.slice(0, 3).map((useCase) => (
              <div
                key={useCase.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c23]/90 p-6 backdrop-blur transition hover:border-purple-400/60"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(139,92,246,0.2),_transparent_65%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                    {useCase.icon}
                    <span>{useCase.title}</span>
                  </div>
                  <p className="text-xs text-slate-300/80">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>



        <section className="text-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f132b]/90 via-[#080b1f]/95 to-[#060616]/95 p-10 shadow-[0_30px_80px_rgba(4,6,20,0.65)]">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold text-white">Get started with EclipseProof</h2>
            <p className="text-sm text-slate-300">
              Connect your wallet and start verifying income privately in minutes.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleCTA}
                disabled={connecting}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 px-8 py-3 text-base font-semibold text-white shadow-[0_0_30px_rgba(94,234,212,0.35)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Wallet2 className="h-5 w-5" />
                  {ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </button>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-300" /> Private & Secure
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-300" /> Instant Verification
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto mt-16 flex w-full max-w-6xl flex-col gap-4 px-6 pb-16 text-xs text-slate-400">
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-slate-300/70 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/60">
            EclipseProof Protocol · 2025
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.25em]">
            <a href="https://twitter.com/eclipseproof" target="_blank" rel="noreferrer noopener" className="transition hover:text-white">
              Twitter
            </a>
            <a href="https://github.com/eclipseproof" target="_blank" rel="noreferrer noopener" className="transition hover:text-white">
              GitHub
            </a>
            <a href="https://discord.gg/eclipseproof" target="_blank" rel="noreferrer noopener" className="transition hover:text-white">
              Discord
            </a>
            <span className="text-slate-500/70">© 2025 EclipseProof. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
