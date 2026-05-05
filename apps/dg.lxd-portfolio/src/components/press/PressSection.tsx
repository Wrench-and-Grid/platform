import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import PressCard from "./PressCard";
import PressArticleModal, { type ActiveArticle } from "./PressArticleModal";

const tickerItems = [
  "Vivir En El Poblado",
  "May 2025",
  "Creative Direction & Design",
  "Medellín, Colombia",
  "July 2025",
  "Learning Experience Design",
  "Editorial Feature",
  "Community Impact",
  "New York, NY",
];

const pressItems = [
  {
    title: "Daisy Gonzalez | Creative Direction & Design",
    source: "Vivir En El Poblado",
    date: "July 2025",
    excerpt:
      "A conversation on building a creative practice rooted in community, purpose, and the craft of designing experiences that truly connect with people.",
    image: "/images/espacio-siete-article.png",
    href: "https://vivirenelpoblado.com/espacio-7-para-lo-cultural-y-social/",
  },
  {
    title: "Creative Work Rooted in Purpose",
    source: "Vivir En El Poblado",
    date: "May 2025",
    excerpt:
      "How Daisy Gonzalez translates design thinking into community-driven learning experiences that shift how people see themselves and their ideas.",
    image: "/images/garabato-article.png",
    href: "https://vivirenelpoblado.com/cancha-renovada-con-talento-en-garabato/",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

export default function PressSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeArticle, setActiveArticle] = useState<ActiveArticle | null>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Subtle parallax — GPU-friendly, transform only, ±6px over full section scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yLeft  = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0,  6]);

  return (
    <>
      <section id="press" ref={sectionRef}>
        <div className="s-label">Press</div>

        <h2>
          AS SEEN IN <em>print.</em>
        </h2>

        <motion.div
          className="press-ticker"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          aria-hidden="true"
        >
          <div className="press-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="press-ticker-item">{item}</span>
            ))}
          </div>
        </motion.div>

        <div className="relative flex flex-col md:flex-row gap-12 items-start">
          {/* Decorative background quotation mark */}
          <span className="press-bg-mark" aria-hidden="true">"</span>

          {/* Left card — parallax drifts up */}
          <motion.div style={{ y: yLeft }} className="relative">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
            >
              <PressCard
                {...pressItems[0]}
                rotate="md:rotate-[-1.5deg]"
                onClick={() => setActiveArticle({
                  url: pressItems[0].href,
                  title: pressItems[0].title,
                  source: pressItems[0].source,
                })}
              />
            </motion.div>
          </motion.div>

          {/* Right card — parallax drifts down, vertical offset on md+ */}
          <motion.div style={{ y: yRight }} className="md:mt-10 relative">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.15}
            >
              <PressCard
                {...pressItems[1]}
                rotate="md:rotate-[1.5deg]"
                onClick={() => setActiveArticle({
                  url: pressItems[1].href,
                  title: pressItems[1].title,
                  source: pressItems[1].source,
                })}
              />
            </motion.div>
          </motion.div>

          {/* Editorial sidebar — fills trailing whitespace on wide layouts */}
          <motion.aside
            className="press-editorial"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            aria-hidden="true"
          >
            <span className="press-editorial-rule" />
            <p className="press-editorial-kicker">Editorial Feature</p>
            <blockquote className="press-editorial-quote">
              "Design thinking translated into experiences that shift how communities see themselves and their ideas."
            </blockquote>
            <p className="press-editorial-attribution">— Vivir En El Poblado, 2025</p>
            <span className="press-editorial-rule" />
          </motion.aside>
        </div>
      </section>

      <PressArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />
    </>
  );
}
