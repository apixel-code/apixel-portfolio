import { Sparkles } from 'lucide-react';

const TemplateValueStrip = ({ items = [] }) => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item} className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-brand-cyan" />
              </div>
              <p className="text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateValueStrip;
