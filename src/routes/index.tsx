import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import hero from "@/assets/hero.jpg";
import golden from "@/assets/golden.jpg";
import owner from "@/assets/owner.jpg";
import assorted from "@/assets/assorted.jpg";

const TITLE = "CROISSANTÉ - Croissant Fresh Premium di Cimahi";
const DESC = "Croissant premium dipanggang fresh setiap hari di Cimahi. 13 varian, Golden Croissant 24K, dan paket box. Pesan sekarang via WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const WA = "6289668211725";
const waLink = (t: string) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

type Cat = "Classic" | "Sweet" | "Savory" | "Seasonal";
const IMG: [string, string][] = [
  [hero, "60% 50%"], [assorted, "25% 25%"], [hero, "20% 50%"], [assorted, "80% 25%"], [assorted, "25% 80%"],
  [assorted, "30% 30%"], [hero, "75% 60%"], [assorted, "85% 30%"], [hero, "40% 60%"], [assorted, "80% 80%"],
  [assorted, "75% 20%"], [assorted, "35% 20%"], [hero, "55% 40%"],
];
const MENU: { n: string; c: Cat; p: number; d: string }[] = [
  { n: "Classic Butter", c: "Classic", p: 18000, d: "Laminasi butter Prancis 24 lapis, renyah keemasan" },
  { n: "Chocolate", c: "Sweet", p: 22000, d: "Dark chocolate Belgia meleleh" },
  { n: "Cheese", c: "Savory", p: 24000, d: "Gruyère meleleh dengan butter karamel" },
  { n: "Matcha Velvet", c: "Seasonal", p: 26000, d: "Matcha uji + red velvet lembut" },
  { n: "Almond", c: "Sweet", p: 24000, d: "Almond panggang + gula halus" },
  { n: "Pain au Chocolat", c: "Classic", p: 23000, d: "Dua batang dark chocolate Prancis" },
  { n: "Ham & Cheese", c: "Savory", p: 25000, d: "Ham sapi + mozzarella" },
  { n: "Spinach Feta", c: "Savory", p: 24000, d: "Bayam segar + feta Yunani" },
  { n: "Cinnamon Roll", c: "Sweet", p: 22000, d: "Kayu manis + glaze gula" },
  { n: "Raspberry", c: "Sweet", p: 25000, d: "Selai raspberry homemade" },
  { n: "Pistachio", c: "Sweet", p: 27000, d: "Krim pistachio Sisilia" },
  { n: "Tiramisu", c: "Sweet", p: 26000, d: "Mascarpone + espresso" },
  { n: "Croffle", c: "Seasonal", p: 24000, d: "Croissant waffle crispy" },
];
const BUNDLES = [
  { e: "🥐", n: "Box Personal", i: "Isi 2-3 pcs", p: 55000, d: "Untuk camilan pribadi" },
  { e: "🎁", n: "Box Sharing", i: "Isi 6 pcs", p: 110000, d: "Untuk keluarga & teman", best: true },
  { e: "🧺", n: "Box Hampers", i: "Isi 12 pcs", p: 210000, d: "Untuk acara & corporate" },
];
const NAV = [["Home", "home"], ["Menu", "menu"], ["Golden", "golden"], ["Bundling", "bundling"], ["Tentang", "tentang"], ["Kontak", "kontak"]];

/* ---------- helpers ---------- */
function ripple(e: MouseEvent<HTMLElement>) {
  const b = e.currentTarget, r = b.getBoundingClientRect(), s = document.createElement("span");
  const d = Math.max(r.width, r.height);
  s.className = "ripple";
  Object.assign(s.style, { width: d + "px", height: d + "px", left: e.clientX - r.left - d / 2 + "px", top: e.clientY - r.top - d / 2 + "px" });
  b.appendChild(s); setTimeout(() => s.remove(), 600);
}
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([en]) => { if (en?.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (x: number, y: number) => {
    const el = ref.current; if (!el) return; const r = el.getBoundingClientRect();
    const rx = ((y - r.top) / r.height - 0.5) * -10, ry = ((x - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className={`lux-card ${className}`} onMouseMove={(e) => move(e.clientX, e.clientY)} onMouseLeave={reset}
      onTouchMove={(e) => move(e.touches[0]!.clientX, e.touches[0]!.clientY)} onTouchEnd={reset}>{children}</div>
  );
}
function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en?.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1200); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{rp(v)}</span>;
}
function Title({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <Reveal className="mb-14 text-center">
      {kicker && <p className="mb-3 font-cinzel text-xs tracking-[0.4em] text-gold">{kicker}</p>}
      <h2 className="font-playfair text-3xl md:text-5xl">{children}</h2>
      <div className="mx-auto mt-5 h-px w-24 bg-gold-gradient" />
    </Reveal>
  );
}
const Logo = ({ s = 28 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className="text-gold">
    <path d="M6 40c4-14 14-24 26-24s22 10 26 24c-6 4-12 4-16 0-2-8-6-12-10-12s-8 4-10 12c-4 4-10 4-16 0z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M22 30l4 12M42 30l-4 12M32 22v20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ---------- page ---------- */
function Index() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"Semua" | Cat>("Semua");
  const [sy, setSy] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    try { setCart(JSON.parse(localStorage.getItem("croissante-cart") || "{}")); } catch { /* ignore */ }
    const on = () => { setScrolled(window.scrollY > 40); setSy(window.scrollY); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", on); };
  }, []);
  const saveCart = (c: Record<string, number>) => { setCart(c); localStorage.setItem("croissante-cart", JSON.stringify(c)); };
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2400); };
  const add = (n: string) => { saveCart({ ...cart, [n]: (cart[n] || 0) + 1 }); notify(`${n} ditambahkan ke keranjang`); };
  const priceOf = (n: string) => MENU.find((m) => m.n === n)?.p ?? BUNDLES.find((b) => b.n === n)?.p ?? 0;
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const total = items.reduce((s, [n, q]) => s + priceOf(n) * q, 0);
  const count = items.reduce((s, [, q]) => s + q, 0);

  return (
    <div id="home">
      {/* Loading */}
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${loading ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-gold" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animation: `floaty ${2 + (i % 3)}s ease-in-out infinite`, opacity: 0.6 }} />
          ))}
        </div>
        <div className="text-5xl" style={{ animation: "spinz 1.5s linear infinite" }}>🥐</div>
        <p className="mt-6 font-cinzel text-3xl tracking-[0.2em] text-gold-gradient">CROISSANTÉ</p>
      </div>

      {/* Navbar */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass border-x-0 border-t-0 py-3" : "py-6"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <a href="#home" className="group flex items-center gap-2 [perspective:600px]">
            <span className="transition-transform duration-700 group-hover:[transform:rotateY(360deg)]"><Logo /></span>
            <span className="font-cinzel text-xl font-semibold tracking-[0.15em] text-gold-gradient">CROISSANTÉ</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map(([l, id]) => <a key={id} href={`#${id}`} className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-gold">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setCartOpen(true)} className="glass relative rounded-full px-3 py-2 text-sm" aria-label="Keranjang">
              🛒{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground">{count}</span>}
            </button>
            <button onClick={() => setLogin(true)} className="glass hidden rounded-full px-5 py-2 text-sm transition hover:text-gold sm:block">Login</button>
            <a href="#kontak" onClick={ripple} className="btn-gold hidden rounded-full px-5 py-2 text-sm font-semibold md:block">Pesan Sekarang</a>
            <button className="glass rounded-full px-3 py-2 lg:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu">☰</button>
          </div>
        </div>
        {mobile && (
          <div className="glass mx-4 mt-3 flex flex-col gap-1 rounded-2xl p-4 lg:hidden">
            {NAV.map(([l, id]) => <a key={id} href={`#${id}`} onClick={() => setMobile(false)} className="rounded-lg px-3 py-2 hover:text-gold">{l}</a>)}
            <button onClick={() => { setLogin(true); setMobile(false); }} className="rounded-lg px-3 py-2 text-left hover:text-gold">Login</button>
            <a href="#kontak" onClick={() => setMobile(false)} className="btn-gold mt-2 rounded-full px-5 py-2 text-center font-semibold">Pesan Sekarang</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={hero}>
          <source src="https://videos.pexels.com/video-files/6127386/6127386-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70" />
        <div className="aurora absolute -inset-20 opacity-70" style={{ transform: `translateY(${sy * 0.3}px)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative z-10 px-5 text-center">
          <div className="glass mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest" style={{ animation: "floaty 4s ease-in-out infinite" }}>
            <span className="blink h-2 w-2 rounded-full bg-gold" /> Fresh from the oven
          </div>
          <h1 className="font-cinzel font-bold tracking-[0.1em] text-gold-gradient drop-shadow-[0_0_30px_oklch(0.76_0.12_88/0.45)]" style={{ fontSize: "clamp(3rem, 11vw, 7rem)" }}>
            {"CROISSANTÉ".split(" ").map((w, i) => <span key={i} className="word" style={{ animationDelay: `${1.6 + i * 0.15}s` }}>{w}</span>)}
          </h1>
          <p className="mt-4 font-italiana text-2xl md:text-4xl">
            {"Croissant Fresh, Renyah di Luar, Lembut di Dalam.".split(" ").map((w, i) => <span key={i} className="word mr-[0.3em]" style={{ animationDelay: `${1.8 + i * 0.15}s` }}>{w}</span>)}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">Croissant premium, dipanggang fresh setiap hari. Kini hadir di Cimahi.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#menu" onClick={ripple} className="btn-gold rounded-full px-8 py-4 font-semibold">Lihat Menu</a>
            <a href={waLink("Halo CROISSANTÉ, saya ingin pesan croissant.")} target="_blank" rel="noreferrer" onClick={ripple} className="btn-outline-gold rounded-full px-8 py-4 font-semibold">Pesan via WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mx-auto max-w-7xl px-5 py-28">
        <Title kicker="KEUNGGULAN">Kenapa <span className="font-cinzel text-gold-gradient">CROISSANTÉ</span>?</Title>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[["✦", "Varian Beragam", "Varian produk beragam & jelas untuk setiap selera."], ["♨", "Selalu Fresh", "Jaminan dipanggang fresh di hari pengambilan."], ["❖", "Bundling Hemat", "Paket bundling praktis & hemat untuk semua momen."], ["◈", "Harga Transparan", "Tanpa biaya tersembunyi, harga jelas dari awal."]].map(([i, t, d], k) => (
            <Reveal key={t} delay={k * 100}>
              <Tilt className="glass h-full rounded-2xl p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 text-2xl text-gold">{i}</div>
                <h3 className="font-playfair text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-7xl px-5 py-28">
        <Title kicker="13 VARIAN">Varian Croissant</Title>
        <Reveal className="mb-12 flex flex-wrap justify-center gap-3">
          {(["Semua", "Classic", "Sweet", "Savory", "Seasonal"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-5 py-2 text-sm transition ${filter === f ? "btn-gold font-semibold" : "glass hover:text-gold"}`}>{f}</button>
          ))}
        </Reveal>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {MENU.map((m, i) => ({ m, i })).filter(({ m }) => filter === "Semua" || m.c === filter).map(({ m, i }) => (
            <Reveal key={m.n}>
              <Tilt className="glass h-full overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={IMG[i]![0]} alt={`Croissant ${m.n}`} loading="lazy" className="h-full w-full scale-150 object-cover transition-transform duration-700 hover:scale-[1.7]" style={{ objectPosition: IMG[i]![1] }} />
                </div>
                <div className="p-6">
                  <p className="text-[10px] tracking-[0.3em] text-gold">{m.c.toUpperCase()}</p>
                  <h3 className="mt-1 font-cinzel text-lg">{m.n}</h3>
                  <p className="mt-2 min-h-10 text-sm text-muted-foreground">{m.d}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm"><span className="text-muted-foreground">Mulai dari </span><span className="font-semibold text-gold"><CountUp to={m.p} /></span></p>
                    <button onClick={(e) => { ripple(e); add(m.n); }} aria-label={`Tambah ${m.n}`} className="btn-gold flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold">+</button>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <Golden />

      {/* Bundling */}
      <section id="bundling" className="mx-auto max-w-6xl px-5 py-28">
        <Title kicker="PAKET BOX">Pilih Paket Box Favoritmu</Title>
        <div className="grid gap-6 md:grid-cols-3">
          {BUNDLES.map((b, k) => (
            <Reveal key={b.n} delay={k * 120}>
              <Tilt className={`glass relative h-full rounded-3xl p-10 text-center ${b.best ? "border-gold/60" : ""}`}>
                {b.best && <span className="shimmer absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-primary-foreground">Best Value</span>}
                <div className="text-6xl">{b.e}</div>
                <h3 className="mt-5 font-cinzel text-2xl">{b.n}</h3>
                <p className="mt-1 text-sm text-gold">{b.i}</p>
                <p className="mt-6 font-playfair text-4xl text-gold-gradient">{rp(b.p)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
                <button onClick={(e) => { ripple(e); add(b.n); }} className="btn-gold mt-8 w-full rounded-full py-3 font-semibold">Pesan Paket</button>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Alur */}
      <section className="mx-auto max-w-7xl px-5 py-28">
        <Title kicker="ALUR">Cara Pesan Mudah</Title>
        <div className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-4 lg:grid-cols-7">
          <div className="absolute left-[7%] right-[7%] top-8 hidden h-px bg-gold-gradient lg:block" />
          {["Kunjungi Website", "Pilih Varian", "Pilih Paket", "Cek Harga", "Order Online", "Konfirmasi Admin", "Siap Dinikmati"].map((s, i) => (
            <Reveal key={s} delay={i * 90} className="relative flex flex-col items-center text-center">
              <div className="group flex h-16 w-16 cursor-default items-center justify-center rounded-full border border-gold bg-background font-cinzel text-gold transition duration-300 hover:scale-[1.12] hover:bg-gold hover:text-primary-foreground hover:shadow-[0_0_30px_oklch(0.76_0.12_88/0.7)]">{String(i + 1).padStart(2, "0")}</div>
              <p className="mt-4 px-2 text-sm">{s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Target */}
      <section className="mx-auto max-w-7xl px-5 py-28">
        <Title kicker="UNTUK ANDA">Untuk Siapa <span className="font-cinzel text-gold-gradient">CROISSANTÉ</span>?</Title>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[["🎓", "Pelajar & Mahasiswa"], ["💼", "Pekerja Kantoran"], ["👨‍👩‍👧", "Keluarga & Teman"], ["🥐", "Pecinta Pastry"]].map(([e, t], k) => (
            <Reveal key={t} delay={k * 100}><Tilt className="glass rounded-2xl p-8 text-center"><div className="text-5xl">{e}</div><p className="mt-4 font-playfair text-lg">{t}</p></Tilt></Reveal>
          ))}
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="mx-auto max-w-6xl px-5 py-28">
        <Title kicker="TENTANG KAMI">Cerita <span className="font-cinzel text-gold-gradient">CROISSANTÉ</span></Title>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold-gradient opacity-20 blur-2xl" />
            <img src={owner} alt="Hendra Lesmana, Founder & Head Baker" loading="lazy" width={768} height={1024} className="relative rounded-3xl border border-gold/30" />
          </Reveal>
          <Reveal delay={150}>
            <p className="text-lg leading-relaxed text-muted-foreground">CROISSANTÉ lahir dari kecintaan mendalam pada croissant Prancis asli, dipanggang dalam batch kecil di Cimahi setiap hari.</p>
            <blockquote className="my-10 border-l-2 border-gold pl-6 font-italiana text-3xl leading-snug">"Setiap croissant kami adalah hasil dari cinta, ketelitian, dan dedikasi."</blockquote>
            <p className="font-cormorant text-5xl italic text-gold-gradient">Hendra Lesmana</p>
            <p className="mt-2 text-sm tracking-[0.25em] text-muted-foreground">FOUNDER & HEAD BAKER</p>
          </Reveal>
        </div>
      </section>

      {/* Testimoni */}
      <section className="mx-auto max-w-7xl px-5 py-28">
        <Title kicker="TESTIMONI">Kata Mereka</Title>
        <div className="grid gap-6 md:grid-cols-3">
          {[["Rina A.", "Bandung", "Lapisannya renyah banget, butter-nya wangi. Rasanya kayak beli di Paris!"], ["Dimas P.", "Cimahi", "Box Sharing jadi andalan buat meeting kantor. Semua orang suka."], ["Sarah K.", "Jakarta", "Pistachio-nya juara. Packaging-nya juga mewah, cocok buat hadiah."]].map(([n, c, q], k) => (
            <Reveal key={n} delay={k * 120}>
              <div className="glass lux-card h-full rounded-2xl p-8">
                <div className="flex gap-1 text-xl text-gold">{[0, 1, 2, 3, 4].map((s) => <span key={s} className="spin-3d inline-block">★</span>)}</div>
                <p className="mt-5 font-playfair italic leading-relaxed">"{q}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient font-cinzel font-bold text-primary-foreground">{n?.[0]}</div>
                  <div><p className="font-semibold">{n}</p><p className="text-xs text-muted-foreground">{c}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Contact />

      {/* Footer */}
      <footer className="border-t border-gold/20 px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2"><Logo /><span className="font-cinzel text-xl tracking-[0.15em] text-gold-gradient">CROISSANTÉ</span></div>
            <p className="mt-4 font-italiana text-xl">Choose your flavor. Choose your box. Enjoy your croissant.</p>
            <p className="mt-4 font-cormorant text-3xl italic text-gold-gradient">Hendra Lesmana</p>
          </div>
          <div>
            <p className="mb-4 font-cinzel text-sm tracking-widest text-gold">MENU CEPAT</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">{NAV.map(([l, id]) => <a key={id} href={`#${id}`} className="hover:text-gold">{l}</a>)}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-4 font-cinzel text-sm tracking-widest text-gold">INFO</p>
            <p>Owner: Hendra Lesmana</p><p>CP: 0896 6821 1725</p><p>Cimahi, Jawa Barat</p>
            <div className="mt-4 flex gap-3">
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="btn-outline-gold rounded-full px-4 py-2 text-xs">WhatsApp</a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="btn-outline-gold rounded-full px-4 py-2 text-xs">TikTok</a>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center text-xs text-muted-foreground">© 2026 CROISSANTÉ. All rights reserved.</p>
      </footer>

      {/* Floating WA */}
      <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="pulse-wa fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-primary-foreground transition hover:scale-110">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.2-1.5-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" /></svg>
      </a>

      {/* Toast */}
      <div className={`glass fixed bottom-24 left-1/2 z-[150] -translate-x-1/2 rounded-full px-6 py-3 text-sm transition-all duration-500 ${toast ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>✦ {toast}</div>

      {/* Login */}
      {login && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-5 backdrop-blur" onClick={() => setLogin(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); setLogin(false); notify("Selamat datang kembali!"); }} className="glass w-full max-w-sm rounded-3xl p-8">
            <h3 className="text-center font-cinzel text-2xl text-gold-gradient">Login</h3>
            <div className="mt-6 space-y-4">
              <input required type="email" placeholder="Email" className="input-3d" />
              <input required type="password" placeholder="Password" className="input-3d" />
              <button onClick={ripple} className="btn-gold w-full rounded-full py-3 font-semibold">Masuk</button>
            </div>
          </form>
        </div>
      )}

      {/* Cart */}
      <div className={`fixed inset-0 z-[110] bg-background/70 transition-opacity ${cartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setCartOpen(false)} />
      <aside className={`glass fixed bottom-0 right-0 top-0 z-[115] flex w-full max-w-sm flex-col p-6 transition-transform duration-500 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between"><h3 className="font-cinzel text-xl text-gold-gradient">Keranjang</h3><button onClick={() => setCartOpen(false)} aria-label="Tutup">✕</button></div>
        <div className="mt-6 flex-1 space-y-3 overflow-auto">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Keranjang masih kosong.</p>}
          {items.map(([n, q]) => (
            <div key={n} className="flex items-center justify-between rounded-xl border border-gold/20 p-3">
              <div><p className="text-sm">{n}</p><p className="text-xs text-gold">{rp(priceOf(n) * q)}</p></div>
              <div className="flex items-center gap-2">
                <button className="glass h-7 w-7 rounded-full" onClick={() => saveCart({ ...cart, [n]: q - 1 })}>−</button>
                <span className="w-5 text-center text-sm">{q}</span>
                <button className="glass h-7 w-7 rounded-full" onClick={() => saveCart({ ...cart, [n]: q + 1 })}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gold/20 pt-4">
          <div className="flex justify-between"><span>Total</span><span className="font-semibold text-gold">{rp(total)}</span></div>
          <a href={waLink(`Halo CROISSANTÉ, saya ingin pre-order croissant:\n${items.map(([n, q]) => `- ${n} x${q}`).join("\n")}\nTotal: ${rp(total)}. Terima kasih!`)}
            target="_blank" rel="noreferrer" className={`btn-gold mt-4 block rounded-full py-3 text-center font-semibold ${items.length ? "" : "pointer-events-none opacity-40"}`}>Checkout via WhatsApp</a>
        </div>
      </aside>
    </div>
  );
}

function Golden() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const n = new Date(); const end = new Date(n.getFullYear(), n.getMonth() + 1, 0);
    setDays(end.getDate() - n.getDate() + 1);
  }, []);
  const msg = "Halo CROISSANTÉ, saya ingin pre-order Golden Croissant (Rp275.000). Terima kasih!";
  return (
    <section id="golden" className="relative overflow-hidden border-y border-gold/40 py-28">
      <div className="aurora absolute inset-0" />
      <div className="glow-pulse absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.76_0.12_88/0.25),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <Reveal><img src={golden} alt="Golden Croissant berlapis emas 24K" loading="lazy" width={1024} height={1024} className="rounded-3xl border border-gold/40 shadow-[0_30px_80px_-20px_oklch(0.76_0.12_88/0.5)]" /></Reveal>
        <Reveal delay={150}>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold tracking-widest">
            <span className="shimmer rounded-full px-3 py-1 text-primary-foreground">LIMITED 1X PER BULAN</span>
            <span className="rounded-full border border-gold px-3 py-1 text-gold">24K EDIBLE GOLD</span>
            <span className="rounded-full border border-gold px-3 py-1 text-gold">MEMBER ONLY</span>
          </div>
          <h2 className="mt-6 font-cinzel text-4xl font-bold tracking-[0.1em] text-gold-gradient md:text-6xl">GOLDEN CROISSANT</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">Croissant 24 lapis butter Prancis, dilapisi edible 24K gold leaf, diisi truffle butter & crème de marrons, ditaburi sea salt Guérande. Disajikan dalam box hitam matte dengan wax seal emas.</p>
          <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/30">
            {[["Harga", "Rp 275.000"], ["Sisa Bulan Ini", "7/20"], ["Pengambilan", "H+3 s/d H+7"], ["Sertifikat", "Emas + Serial"]].map(([k, v], i) => (
              <div key={k} className={`p-5 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""} border-gold/30`}>
                <p className="text-xs tracking-widest text-muted-foreground">{k?.toUpperCase()}</p>
                <p className="mt-1 font-cinzel text-lg text-gold">{v}</p>
                {k === "Sisa Bulan Ini" && <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full w-[35%] rounded-full bg-gold-gradient" /></div>}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm">⏳ Bulan ini tersisa <span className="font-semibold text-gold">{days ?? "–"} hari</span></p>
          <a href={waLink(msg)} target="_blank" rel="noreferrer" onClick={ripple} className="btn-gold mt-6 inline-block rounded-full px-10 py-4 font-semibold shadow-[0_0_40px_oklch(0.76_0.12_88/0.5)]">Pesan Golden Croissant</a>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [range, setRange] = useState({ min: "", max: "" });
  useEffect(() => {
    const f = (d: number) => { const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); };
    setRange({ min: f(1), max: f(7) });
  }, []);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget); const g = (k: string) => String(d.get(k) || "-");
    const t = `Halo CROISSANTÉ, saya ingin pre-order croissant: Nama: ${g("nama")}, No. HP: ${g("hp")}, Varian: ${g("varian")}, Jumlah Box: ${g("jumlah")}, Tanggal Ambil: ${g("tanggal")}, Catatan: ${g("catatan")}. Terima kasih!`;
    window.open(waLink(t), "_blank");
  };
  const info = [["📞", "Contact Person", "0896 6821 1725"], ["📍", "Lokasi", "Cimahi, Jawa Barat"], ["👤", "Owner", "Hendra Lesmana"], ["🎵", "TikTok", "@croissante"]];
  return (
    <section id="kontak" className="mx-auto max-w-6xl px-5 py-28">
      <Title kicker="KONTAK">Pesan Sekarang, Croissant Fresh Menantimu</Title>
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal className="space-y-4">
          {info.map(([i, k, v]) => (
            <div key={k} className="glass lux-card flex items-center gap-4 rounded-2xl p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/50 text-xl">{i}</div>
              <div><p className="text-xs tracking-widest text-muted-foreground">{k?.toUpperCase()}</p><p className="font-playfair text-lg">{v}</p></div>
            </div>
          ))}
        </Reveal>
        <Reveal delay={150}>
          <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-8">
            <input name="nama" required placeholder="Nama" className="input-3d" />
            <input name="hp" required type="tel" placeholder="No. HP" className="input-3d" />
            <select name="varian" required className="input-3d" defaultValue="">
              <option value="" disabled>Pilih Varian</option>
              {MENU.map((m) => <option key={m.n}>{m.n}</option>)}
              <option>Golden Croissant</option>
              {BUNDLES.map((b) => <option key={b.n}>{b.n}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input name="jumlah" required type="number" min={1} defaultValue={1} placeholder="Jumlah Box" className="input-3d" />
              <input name="tanggal" required type="date" min={range.min} max={range.max} className="input-3d" />
            </div>
            <textarea name="catatan" rows={3} placeholder="Catatan" className="input-3d" />
            <button onClick={ripple} className="btn-gold w-full rounded-full py-4 font-semibold">Kirim Pesanan via WhatsApp</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
