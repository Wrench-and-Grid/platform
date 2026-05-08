export default function ContactSection() {
  const particles = [
    { size: 5,   top: "18%", left: "22%", color: "var(--clr-orange)",   dur: "6s",  delay: "0s"    },
    { size: 3,   top: "35%", left: "68%", color: "var(--clr-aqua)",     dur: "9s",  delay: "1.2s"  },
    { size: 4,   top: "62%", left: "14%", color: "var(--clr-lavender)", dur: "7s",  delay: "0.4s"  },
    { size: 6,   top: "78%", left: "55%", color: "var(--clr-orange)",   dur: "11s", delay: "2.5s"  },
    { size: 3,   top: "50%", left: "82%", color: "var(--clr-aqua)",     dur: "8s",  delay: "0.9s"  },
    { size: 4,   top: "25%", left: "45%", color: "var(--clr-lavender)", dur: "10s", delay: "3.1s"  },
    { size: 2.5, top: "88%", left: "30%", color: "var(--clr-blue)",     dur: "7.5s",delay: "1.7s"  },
    { size: 5,   top: "10%", left: "72%", color: "var(--clr-lavender)", dur: "12s", delay: "0.2s"  },
    { size: 3,   top: "70%", left: "90%", color: "var(--clr-orange)",   dur: "9.5s",delay: "4s"    },
    { size: 2,   top: "42%", left: "5%",  color: "var(--clr-aqua)",     dur: "6.5s",delay: "2.8s"  },
    { size: 4,   top: "55%", left: "40%", color: "var(--clr-blue)",     dur: "13s", delay: "0.6s"  },
    { size: 3,   top: "92%", left: "75%", color: "var(--clr-lavender)", dur: "8.5s",delay: "3.5s"  },
  ];

  return (
    <section id="contact">
      <div className="contact-inner">
        {/* ── Left column ────────────────────────────────────── */}
        <div className="contact-left">
          {/* <div className="s-label">Contact</div> */}
          <h2>
            LET&apos;S MAKE
            <br />
            SOMETHING <em>real.</em>
          </h2>
          <p>
            Whether you&apos;re a nonprofit looking for a creative partner or an interested
            recruiter&nbsp;— I&apos;d love to hear from you.
          </p>
          <div className="contact-highlights" aria-label="Focus areas">
            <span>Community campaigns</span>
            <span>Mission-driven focus</span>
            <span>Outreach strategist</span>
          </div>
        </div>

        {/* ── Right column — signature over particles ──────────── */}
        <div className="contact-particles" aria-hidden="true">
          {particles.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                width:  p.size,
                height: p.size,
                top:    p.top,
                left:   p.left,
                background:       p.color,
                animationDuration: p.dur,
                animationDelay:   p.delay,
              }}
            />
          ))}
          <img
            src="/dg-sig.svg"
            alt="Daisy G. signature"
            className="contact-sig-img"
          />
        </div>
      </div>

      <footer className="contact-footer">
        <div className="footer-logo">&copy; {new Date().getFullYear()} Daisy G. | All rights reserved</div>
      </footer>
    </section>
  );
}
