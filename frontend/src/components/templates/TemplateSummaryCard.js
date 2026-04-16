import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const TemplateSummaryCard = ({ template }) => {
  return (
    <div className="card-glass">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Starting Price</p>
      <p className="font-syne font-bold text-4xl text-brand-gold mb-6">{template.priceLabel}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Status</p>
          <p className={template.status === 'Available' ? 'text-green-400' : 'text-yellow-400'}>
            {template.status}
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Delivery</p>
          <p className="text-slate-200">Fast customization</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Build Stack</p>
        <div className="flex flex-wrap gap-2">
          {template.techStack?.map((item) => (
            <span key={item} className="px-3 py-1 bg-white/5 rounded-full text-sm text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/contact"
          className="btn-primary inline-flex items-center justify-center gap-2"
          data-testid="template-details-contact-btn"
        >
          {template.ctaLabel}
          <ArrowRight size={18} />
        </Link>
        <Link
          to="/contact"
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          Talk to Us
          <ArrowRight size={16} />
        </Link>
        {template.demoUrl ? (
          <a
            href={template.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
          >
            Live Demo
            <ExternalLink size={16} />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default TemplateSummaryCard;
