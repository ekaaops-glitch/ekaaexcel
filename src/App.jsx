import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

const EMAIL = "hello@ekaaexcel.com";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeaeqqyb";
const RECAPTCHA_SITE_KEY = "6Lfl_uEtAAAAAN_PUuhA9_94HkkncGJcu_eRlP47";// <-- paste your v2 site key here

/* ---------- Icons (inline SVG, no package needed) ---------- */
const P = {
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18z|M12 7v5l3 2",
  calc: "M4 3h16v18H4z|M8 7h8|M8 12h2|M14 12h2|M8 16h2|M14 16h2",
  repeat: "M17 2l4 4-4 4|M3 11V9a3 3 0 013-3h15|M7 22l-4-4 4-4|M21 13v2a3 3 0 01-3 3H3",
  db: "M3 5c0 1.7 4 3 9 3s9-1.3 9-3-4-3-9-3-9 1.3-9 3z|M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5|M3 12c0 1.7 4 3 9 3s9-1.3 9-3",
  chart: "M3 3v18h18|M8 16v-5|M13 16V7|M18 16v-8",
  bulb: "M9 18h6|M10 22h4|M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z",
  userok: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2|M9 11a4 4 0 100-8 4 4 0 000 8z|M16 11l2 2 4-4",
  headset: "M3 14v-2a9 9 0 0118 0v2|M3 14h3v5H3z|M18 14h3v5h-3z",
  wallet: "M3 7h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h13|M17 14h2",
  coin: "M12 2v20|M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  sliders: "M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M1 14h6|M9 8h6|M17 16h6",
  hourglass: "M5 22h14|M5 2h14|M17 22v-4.2a2 2 0 00-.6-1.4L12 12l-4.4 4.4a2 2 0 00-.6 1.4V22|M7 2v4.2a2 2 0 00.6 1.4L12 12l4.4-4.4a2 2 0 00.6-1.4V2",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M8 13h8|M8 17h5",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z|M7 7h.01",
  mail: "M3 5h18v14H3z|M3 7l9 6 9-6",
  clip: "M9 2h6v4H9z|M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2|M8 12h8|M8 16h5",
  receipt: "M5 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2z|M9 7h6|M9 11h6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 11a4 4 0 100-8 4 4 0 000 8z|M23 21v-2a4 4 0 00-3-3.9|M16 3.1a4 4 0 010 7.8",
  code: "M16 18l6-6-6-6|M8 6l-6 6 6 6",
  check: "M22 11.1V12a10 10 0 11-5.9-9.1|M22 4L12 14l-3-3",
  send: "M22 2L11 13|M22 2l-7 20-4-9-9-4z",
  arrow: "M5 12h14|M12 5l7 7-7 7",
  table: "M3 3h18v18H3z|M3 9h18|M3 15h18|M9 3v18",
  pie: "M21 12A9 9 0 1112 3v9z|M15 3a9 9 0 016 6h-6z",
  dash: "M3 3h8v10H3z|M13 3h8v6h-8z|M13 11h8v10h-8z|M3 15h8v6H3z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z|M9 12l2 2 4-4",
  menu: "M3 6h18|M3 12h18|M3 18h18",
  x: "M18 6L6 18|M6 6l12 12",
  plus: "M12 5v14|M5 12h14",
  logo: "M3 3h8v8H3z|M13 3h8v8h-8z|M3 13h8v8H3z|M13 17h8",
};

function Icon({ n, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[n].split("|").map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/* ---------- Content ---------- */

const nav = [
  ["Home", "#home"],
  ["Services", "#services"],
  ["Why Us", "#why"],
  ["How It Works", "#process"],
  ["About", "#about"],
  ["FAQs", "#faq"],
  ["Contact", "#contact"],
];

const problems = [
  ["clock", "Spending hours on reports?"],
  ["calc", "Struggling with formulas?"],
  ["repeat", "Doing the same tasks every day?"],
  ["db", "Stuck with messy spreadsheets?"],
  ["chart", "Hard to turn data into insights?"],
];

const services = [
  {
    ic: "table",
    t: "Basic Excel Solutions",
    d: "Data cleaning, formatting, sorting and formulas like VLOOKUP, XLOOKUP, IF, COUNTIF and SUMIF for everyday work.",
  },
  {
    ic: "chart",
    t: "Intermediate Excel Dashboards",
    d: "Pivot Tables, charts, slicers, interactive reports and KPI tracking to understand your data and decide faster.",
  },
  {
    ic: "dash",
    t: "Custom & Power BI Dashboards",
    d: "Custom Excel and Power BI dashboards with automated reports and interactive visuals to track business performance.",
  },
];

const why = [
  ["userok", "Expert Guidance", "Expert Excel help when you need it."],
  ["headset", "On-Demand Support", "Help whenever you need it."],
  ["wallet", "No Fixed Cost", "Pay only for what you need."],
  ["coin", "Save Resource Costs", "No need for a full-time Excel hire."],
  ["sliders", "Customized Solutions", "Built around your business needs."],
  ["hourglass", "Save Time", "Automate repeated work and do more."],
  ["file", "Professional Reports", "Clean, clear and easy to use."],
  ["tag", "Flexible Pricing", "Options that fit your needs."],
];

const steps = [
  ["mail", "Contact Us", "Tell us what you need."],
  ["clip", "Scope Review", "We understand your needs and set the scope."],
  ["receipt", "Get a Quote", "Get a clear, custom price."],
  ["users", "Engagement Formalities", "Complete simple onboarding steps."],
  ["code", "Build & Develop", "Our experts build your solution."],
  ["check", "Review & Refine", "We review and improve it."],
  ["send", "Deliver", "Get your ready-to-use Excel file."],
];

const faqs = [
  [
    "What Excel services do you provide?",
    "We provide customized Excel solutions including dashboards, reports, automation, formulas, data analysis, templates, and more.",
  ],
  [
    "How does your On-Demand Excel service work?",
    "Simply share your requirement with us. We review the scope, provide a quotation, complete the engagement formalities, build the solution, review it with you, and deliver the final output.",
  ],
  [
    "How much does an Excel project cost?",
    "Pricing depends on the scope, complexity, and effort involved. We provide a customized quotation based on your specific requirement.",
  ],
  [
    "Can you work with my existing Excel files?",
    "Yes. We can fix, improve, automate, redesign, or enhance your existing Excel workbooks.",
  ],
  [
    "How quickly can you complete my Excel project?",
    "The timeline depends on the project complexity and scope. We provide an estimated delivery timeline before starting the work.",
  ],
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  need: "",
};

/* ---------- Page ---------- */

export default function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  };

  /* ---------- FORMSPREE SUBMISSION (with reCAPTCHA) ---------- */

  const submit = async (e) => {
    e.preventDefault();

    if (status === "sending") return;

    // Captcha must be solved on every submission
    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }

    setCaptchaError(false);
    setStatus("sending");

    try {
      const body = new FormData(e.target);
      body.set("g-recaptcha-response", captchaToken);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body,
      });

      const data = await response.json();

      console.log("Formspree response:", data);

      if (response.ok) {
        setStatus("sent");
        setForm(emptyForm);
      } else {
        console.error("Formspree error:", data);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    } finally {
      // Tokens are single-use: always force a fresh captcha next time
      resetCaptcha();
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap nav-in">
          <a href="#home" className="logo-img">
            <img src="/logo.jpeg" alt="Ekaaexcel - Excel Services" />
          </a>

          <nav className={open ? "open" : ""}>
            {nav.map(([n, h]) => (
              <a key={n} href={h} onClick={() => setOpen(false)}>
                {n}
              </a>
            ))}
          </nav>

          <a className="btn dark-btn nav-cta" href="#contact">
            Request a Callback <Icon n="arrow" size={16} />
          </a>

          <button
            className="burger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <Icon n={open ? "x" : "menu"} />
          </button>
        </div>
      </header>

      {/* HERO: content on the left, image on the right */}
      <section id="home" className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text reveal">
            <span className="chip">
              <i /> Excel • Reporting • Dashboards • Data Analytics
            </span>

            <h1>
              Are You Looking for an <em>On-Demand Excel Expert?</em>
            </h1>

            <p className="lead">
              Get expert Excel help whenever you need it.
            </p>

            <div className="row">
              <a className="btn dark-btn" href="#about">
                Know More <Icon n="arrow" size={16} />
              </a>

              <a className="btn ghost" href="#services">
                Explore Services
              </a>
            </div>
          </div>

          <img
            className="hero-banner"
            src="/banner.jpeg"
            alt="Excel dashboards, reporting and data analytics"
          />
        </div>
      </section>

      {/* CHALLENGE */}
      <section className="section">
        <div className="wrap two top">
          <div className="reveal">
            <span className="eyebrow">The Challenge</span>

            <h2>
              Is Excel Taking <em>More Time</em> Than It Should?
            </h2>

            <div className="callout">
              <span className="ico big">
                <Icon n="bulb" size={26} />
              </span>

              <p>
                <b>You don't need another employee.</b>{" "}
                You need Excel help when you need it.
              </p>

              <span>That's where we come in.</span>
            </div>
          </div>

          <ul className="problems">
            {problems.map(([ic, t], i) => (
              <li
                className="reveal"
                key={t}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="ref">A{i + 1}</span>

                <span className="ico">
                  <Icon n={ic} size={20} />
                </span>

                <b>{t}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section soft">
        <div className="wrap two">
          <div className="reveal">
            <span className="eyebrow">Who We Are</span>

            <h2>Your Trusted On-Demand Excel Experts</h2>

            <p>
              We are a team of Excel experts. We help businesses simplify
              spreadsheets, automate repeated tasks, and turn data into clear
              insights.
            </p>

            <p>
              Need help with one task or ongoing support? We are here when you
              need us, with no full-time hire needed.
            </p>

            <div className="goal">
              <Icon n="check" size={22} />

              <span>
                <b>Our goal is simple:</b> Make Excel work better for your
                business.
              </span>
            </div>

            <a className="btn dark-btn" href="#services">
              Explore Our Services <Icon n="arrow" size={16} />
            </a>
          </div>

          <div className="panel reveal">
            <span className="panel-tag">Who We Are</span>

            <h3>
              Excel Experts.
              <br />
              Smarter Solutions.
              <br />
              <em>Better Results.</em>
            </h3>

            <p>
              We help businesses simplify and automate Excel, on demand.
            </p>

            <span className="pill">Your Excel. Our Expertise.</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow">What We Offer</span>

            <h2>Our Excel Services</h2>

            <p>
              From everyday Excel tasks to advanced dashboards, we deliver
              simple, practical solutions.
            </p>
          </div>

          <div className="bento">
            {services.map((s, i) => (
              <article
                key={s.t}
                className="bcard reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="btop">
                  <span className="ico big">
                    <Icon n={s.ic} size={26} />
                  </span>

                  <span className="bn">0{i + 1}</span>
                </div>

                <h3>{s.t}</h3>

                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap">
        <div className="cta reveal">
          <div>
            <h2>Ready to improve your Excel work?</h2>

            <p>
              Tell us what you need and get a custom solution from our experts.
            </p>
          </div>

          <a className="btn light" href="#contact">
            Get a Quote <Icon n="arrow" size={16} />
          </a>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="section">
        <div className="wrap why">
          <div className="why-left reveal">
            <span className="eyebrow">Why Choose Us?</span>

            <h2>More Than Just Excel Support</h2>

            <p>
              Practical, reliable and affordable solutions that save you time.
            </p>

            <a className="btn dark-btn" href="#contact">
              Get a Quote <Icon n="arrow" size={16} />
            </a>
          </div>

          <div className="why-list">
            {why.map(([ic, t, d], i) => (
              <div
                className="witem reveal"
                key={t}
                style={{ transitionDelay: `${(i % 2) * 80}ms` }}
              >
                <span className="ico">
                  <Icon n={ic} size={22} />
                </span>

                <div>
                  <h4>{t}</h4>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section soft">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow">How Our Process Works</span>

            <h2>A Simple, Transparent Process</h2>

            <p>A simple, clear process from request to delivery.</p>
          </div>

          <div className="steps">
            {steps.map(([ic, t, d], i) => (
              <div
                className={`step reveal ${
                  i === steps.length - 1 ? "last" : ""
                }`}
                key={t}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="stop">
                  <span className="ico">
                    <Icon n={ic} size={20} />
                  </span>

                  <span className="sn">0{i + 1}</span>
                </div>

                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}

            <a
              className="step cta-tile reveal"
              href="#contact"
              style={{ transitionDelay: "560ms" }}
            >
              <h4>Ready to start?</h4>

              <p>Tell us what you need.</p>

              <span className="go">
                Get a Quote <Icon n="arrow" size={16} />
              </span>
            </a>
          </div>

          <div className="flow reveal">
            {[
              "Contact",
              "Review",
              "Quote",
              "Engage",
              "Build",
              "Review",
              "Deliver",
            ].map((s, i, a) => (
              <span key={i}>
                {s}

                {i < a.length - 1 && <em>→</em>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section id="faq" className="section">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow">FAQs</span>

            <h2>Frequently Asked Questions</h2>

            <p>Quick answers to common questions.</p>
          </div>

          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <details
                className="faq-item reveal"
                key={q}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <summary>
                  <span>
                    {i + 1}. {q}
                  </span>

                  <span className="faq-ico">
                    <Icon n="plus" size={18} />
                  </span>
                </summary>

                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section soft">
        <div className="wrap two">
          <div className="reveal">
            <span className="eyebrow">Contact</span>

            <h2>Tell Us What You Need</h2>

            <p>
              Share your Excel need and we'll send you a clear quote.
            </p>

            <a className="mail" href={`mailto:${EMAIL}`}>
              <Icon n="mail" size={20} />
              {EMAIL}
            </a>
          </div>

          <div className="reveal">
            {status === "sent" ? (
              <div className="form form-ok" role="status">
                <span className="ico big">
                  <Icon n="check" size={28} />
                </span>

                <h3>Thank you!</h3>

                <p>
                  Your request is submitted. We will get back to you soon.
                </p>

                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setCaptchaToken(null);
                    setCaptchaError(false);
                    setStatus("idle");
                  }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <label>
                  <span>Full Name</span>

                  <input
                    name="name"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={change}
                  />
                </label>

                <div className="form-row">
                  <label>
                    <span>Email ID</span>

                    <input
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={form.email}
                      onChange={change}
                    />
                  </label>

                  <label>
                    <span>Phone Number</span>

                    <input
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      pattern="[0-9+\s()\-]{7,18}"
                      title="Enter a valid phone number"
                      value={form.phone}
                      onChange={change}
                    />
                  </label>
                </div>

                <label>
                  <span>Message</span>

                  <textarea
                    name="need"
                    rows="5"
                    placeholder="Describe your Excel requirement"
                    required
                    value={form.need}
                    onChange={change}
                  />
                </label>

                {/* reCAPTCHA */}
                <div className="captcha">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                      setCaptchaToken(token);
                      if (token) setCaptchaError(false);
                    }}
                    onExpired={() => setCaptchaToken(null)}
                    onErrored={() => setCaptchaToken(null)}
                  />
                </div>

                {captchaError && (
                  <p className="form-err" role="alert">
                    Please tick "I'm not a robot" before submitting.
                  </p>
                )}

                {status === "error" && (
                  <p className="form-err" role="alert">
                    Something went wrong. Please try again, or email us at{" "}
                    {EMAIL}.
                  </p>
                )}

                <button
                  className="btn dark-btn"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Submit
                      <Icon n="arrow" size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot">
          <a href="#home" className="logo-img">
            <img src="/logo.jpeg" alt="Ekaaexcel - Excel Services" />
          </a>

          <span>
            © {new Date().getFullYear()} Ekaaexcel. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}