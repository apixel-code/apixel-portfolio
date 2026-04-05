import { motion } from 'framer-motion';
import { ArrowRight, Layers3, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/imageUrl';

const TemplateCard = ({ template, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="card-glass group h-full flex flex-col"
      data-testid={`template-card-${index}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl mb-6 bg-brand-dark">
        <img
          src={resolveImageUrl(template.thumbnailUrl)}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/20 text-brand-cyan text-xs font-dm-sans rounded-full">
          <Layers3 size={14} />
          {template.category}
        </span>
        <span className={`text-xs px-3 py-1 rounded-full font-dm-sans ${
          template.status === 'Available'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {template.status}
        </span>
      </div>

      <h2 className="font-syne font-semibold text-2xl text-white mb-3 group-hover:text-brand-cyan transition-colors">
        {template.title}
      </h2>
      <p className="text-slate-400 leading-relaxed mb-6 flex-1">{template.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {template.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-full text-xs text-slate-300"
          >
            <Tag size={12} />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-white/10">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Starting At</p>
          <p className="font-syne font-semibold text-brand-gold text-xl">{template.priceLabel}</p>
        </div>
        <Link
          to={`/templates/${template.slug}`}
          className="inline-flex items-center gap-2 text-brand-cyan font-medium group-hover:gap-3 transition-all"
        >
          View Store Item
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
};

export default TemplateCard;
