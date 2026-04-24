import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/ui/Footer';
import Navbar from '../../components/ui/Navbar';

const TermsOfService = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Terms of Service',
      dateLabel: 'Effective date: April 24, 2026',
      intro:
        "These Terms of Service govern your access to and use of Apixel's website and digital services. By using our website, you agree to these terms.",
      sections: [
        {
          heading: '1. Services',
          body:
            'Apixel provides digital services including software development, design, marketing, and technical support as agreed in project scope documents or service agreements.',
        },
        {
          heading: '2. Acceptable Use',
          body:
            'You agree not to misuse our website, attempt unauthorized access, disrupt normal operation, or use the platform for unlawful activities.',
        },
        {
          heading: '3. Intellectual Property',
          body:
            'All website content, branding, and materials provided by Apixel remain our property unless otherwise stated in a written agreement.',
        },
        {
          heading: '4. Payments and Project Delivery',
          body:
            'Payment schedules, deliverables, revisions, and ownership transfer are defined per project contract. Delays caused by missing client feedback or materials may affect delivery timelines.',
        },
        {
          heading: '5. Limitation of Liability',
          body:
            'Apixel is not liable for indirect or consequential losses. Our maximum liability, where applicable, is limited to the amount paid for the specific service in dispute.',
        },
        {
          heading: '6. Termination',
          body:
            'We may suspend or terminate access if terms are violated. Either party may end a project engagement according to the terms set in the signed agreement.',
        },
        {
          heading: '7. Changes to Terms',
          body:
            'We may update these terms from time to time. Continued use of our website after updates means you accept the revised terms.',
        },
        {
          heading: '8. Contact',
          body: 'Questions about these terms can be sent to',
        },
      ],
    },
    bn: {
      title: 'সেবার শর্তাবলি',
      dateLabel: 'কার্যকর তারিখ: ২৪ এপ্রিল, ২০২৬',
      intro:
        'এই সেবার শর্তাবলি Apixel-এর ওয়েবসাইট ও ডিজিটাল সেবা ব্যবহারের নিয়ম নির্ধারণ করে। আমাদের ওয়েবসাইট ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন।',
      sections: [
        {
          heading: '১. সেবা',
          body:
            'Apixel সফটওয়্যার ডেভেলপমেন্ট, ডিজাইন, মার্কেটিং এবং টেকনিক্যাল সাপোর্টসহ বিভিন্ন ডিজিটাল সেবা প্রদান করে, যা প্রজেক্ট স্কোপ ডকুমেন্ট বা সার্ভিস চুক্তি অনুযায়ী নির্ধারিত হয়।',
        },
        {
          heading: '২. গ্রহণযোগ্য ব্যবহার',
          body:
            'আপনি ওয়েবসাইটের অপব্যবহার করবেন না, অননুমোদিত প্রবেশের চেষ্টা করবেন না, স্বাভাবিক কার্যক্রমে বাধা দেবেন না এবং অবৈধ কাজে প্ল্যাটফর্ম ব্যবহার করবেন না।',
        },
        {
          heading: '৩. মেধাস্বত্ব',
          body:
            'Apixel-এর ওয়েবসাইটের সব কনটেন্ট, ব্র্যান্ডিং ও উপকরণ লিখিত চুক্তিতে ভিন্নভাবে উল্লেখ না থাকলে আমাদের সম্পত্তি হিসেবে বিবেচিত হবে।',
        },
        {
          heading: '৪. পেমেন্ট ও প্রজেক্ট ডেলিভারি',
          body:
            'পেমেন্ট শিডিউল, ডেলিভারেবল, রিভিশন এবং মালিকানা হস্তান্তরের বিষয়গুলো প্রজেক্ট চুক্তিতে নির্ধারিত থাকে। ক্লায়েন্টের ফিডব্যাক বা প্রয়োজনীয় তথ্য দেরিতে পেলে ডেলিভারি সময় প্রভাবিত হতে পারে।',
        },
        {
          heading: '৫. দায়বদ্ধতার সীমা',
          body:
            'Apixel পরোক্ষ বা পরিণতিজনিত ক্ষতির জন্য দায়ী নয়। প্রযোজ্য ক্ষেত্রে আমাদের সর্বোচ্চ দায় সংশ্লিষ্ট সেবার জন্য পরিশোধিত অর্থের মধ্যে সীমাবদ্ধ থাকবে।',
        },
        {
          heading: '৬. সমাপ্তি',
          body:
            'শর্তাবলি লঙ্ঘন হলে আমরা সেবা স্থগিত বা বন্ধ করতে পারি। উভয় পক্ষ স্বাক্ষরিত চুক্তির শর্ত অনুযায়ী প্রজেক্ট সমাপ্ত করতে পারবে।',
        },
        {
          heading: '৭. শর্তাবলির পরিবর্তন',
          body:
            'আমরা সময়ে সময়েই এই শর্তাবলি হালনাগাদ করতে পারি। পরিবর্তনের পর ওয়েবসাইট ব্যবহার অব্যাহত রাখলে তা সংশোধিত শর্তাবলি গ্রহণ হিসেবে গণ্য হবে।',
        },
        {
          heading: '৮. যোগাযোগ',
          body: 'এই শর্তাবলি সম্পর্কে প্রশ্ন থাকলে ইমেইল করুন:',
        },
      ],
    },
  };

  const currentContent = content[language];

  return (
    <>
      <Helmet>
        <title>Terms of Service - Apixel</title>
        <meta
          name="description"
          content="Review Apixel's Terms of Service for the rules and conditions governing use of our website and services."
        />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        <section className="py-20 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">
                Legal
              </span>
              <h1 className="font-syne font-bold text-4xl md:text-5xl text-white mt-4 mb-4">
                {currentContent.title}
              </h1>
              <p className="text-slate-300 text-base md:text-lg">
                {currentContent.dateLabel}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-glass space-y-8"
            >
              <div className="flex items-center justify-end">
                <div className="bg-white/5 rounded-xl p-1 inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      language === 'en'
                        ? 'bg-brand-purple text-white'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      language === 'bn'
                        ? 'bg-brand-purple text-white'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {currentContent.intro}
              </p>

              {currentContent.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-syne font-semibold text-2xl text-white mb-3">{section.heading}</h2>
                  <p className="text-slate-300 leading-relaxed">
                    {section.body}
                    {section.heading.includes('Contact') || section.heading.includes('যোগাযোগ') ? (
                      <>
                        {' '}
                        <a href="mailto:contact.apixel@gmail.com" className="text-brand-cyan hover:text-brand-gold transition-colors">
                          contact.apixel@gmail.com
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
              ))}
            </motion.article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TermsOfService;
