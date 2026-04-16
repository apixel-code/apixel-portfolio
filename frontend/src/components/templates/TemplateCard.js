import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, Star } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl';

const BADGES = [
  { label: 'Most Popular', icon: Flame, bg: 'bg-orange-500/90', text: 'text-white' },
  { label: 'Best Seller', icon: Star, bg: 'bg-brand-gold/90', text: 'text-brand-dark' },
  { label: 'Trending', icon: Flame, bg: 'bg-rose-500/90', text: 'text-white' },
];

const TemplateCard = ({ template, index = 0 }) => {
  const badge = BADGES[index % BADGES.length];
  const BadgeIcon = badge.icon;
  const visitUrl = template.demoUrl || '#';
  const hasDemo = !!template.demoUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group h-full flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
      data-testid={`template-card-${index}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-brand-dark relative">
        <img
          src={resolveImageUrl(template.thumbnailUrl)}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-dm-sans font-bold ${badge.bg} ${badge.text} shadow-lg`} data-testid={`template-badge-${index}`}>
          <BadgeIcon size={12} />
          {badge.label}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <span className="text-brand-cyan text-xs font-dm-sans font-medium mb-2">
          {template.category}
        </span>

        <h2 className="font-syne font-semibold text-lg text-white mb-2 group-hover:text-brand-cyan transition-colors line-clamp-1">
          {template.title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {template.excerpt}
        </p>

        <a
          href={visitUrl}
          target={hasDemo ? '_blank' : '_self'}
          rel={hasDemo ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-1.5 text-brand-cyan text-sm font-medium group-hover:gap-2.5 transition-all mt-auto"
          data-testid={`template-visit-${index}`}
        >
          Visit Site
          <ArrowUpRight size={14} />
        </a>
      </div>
    </motion.article>
  );
};

export default TemplateCard;
