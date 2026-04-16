import { motion } from 'framer-motion';
import { ArrowRight, Flame, Layers3, Star, Tag } from 'lucide-react';
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
      {/* Image */}
      <div className="aspect-[2/1] w-full overflow-hidden bg-brand-dark relative">
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

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category + Status Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple/20 text-brand-cyan text-xs font-dm-sans font-medium rounded-full">
            <Layers3 size={12} />
            {template.category}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-dm-sans font-medium ${
            template.status === 'Available'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {template.status}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-syne font-semibold text-lg text-white mb-1.5 group-hover:text-brand-cyan transition-colors line-clamp-1">
          {template.title}
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
          {template.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {template.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300"
            >
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Visit Site */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Starting At</p>
            <p className="font-syne font-bold text-brand-gold text-lg">{template.priceLabel}</p>
          </div>
          <a
            href={visitUrl}
            target={hasDemo ? '_blank' : '_self'}
            rel={hasDemo ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 text-brand-cyan text-sm font-medium group-hover:gap-2.5 transition-all"
            data-testid={`template-visit-${index}`}
          >
            Visit Site
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default TemplateCard;
