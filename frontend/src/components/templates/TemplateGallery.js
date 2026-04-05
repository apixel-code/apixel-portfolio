import { motion } from 'framer-motion';
import { resolveImageUrl } from '../../utils/imageUrl';

const TemplateGallery = ({ title, heroImage, gallery = [] }) => {
  return (
    <>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-[16/9] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
            <img
              src={resolveImageUrl(heroImage)}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-[4/3]"
              >
                <img
                  src={resolveImageUrl(image)}
                  alt={`${title} preview ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TemplateGallery;
