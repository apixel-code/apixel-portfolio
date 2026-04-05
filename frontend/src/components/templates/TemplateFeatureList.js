import { CheckCircle } from 'lucide-react';

const TemplateFeatureList = ({ features }) => {
  return (
    <div className="card-glass">
      <p className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest mb-4">
        What&apos;s Included
      </p>
      <h2 className="font-syne font-bold text-3xl text-white mb-6">
        Core Sections and Conversion Blocks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features?.map((feature) => (
          <div key={feature} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
            <CheckCircle size={18} className="text-brand-gold mt-1 flex-shrink-0" />
            <p className="text-slate-300">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateFeatureList;
