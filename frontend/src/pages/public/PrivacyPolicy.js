import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/ui/Footer';
import Navbar from '../../components/ui/Navbar';

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Privacy Policy',
      dateLabel: 'Effective date: April 24, 2026',
      intro:
        'At Apixel, we respect your privacy and are committed to protecting the personal information you share with us through our website and services.',
      sections: [
        {
          heading: '1. Information We Collect',
          body:
            'We may collect your name, email address, phone number, company details, project requirements, and any additional information you provide through forms, consultation requests, or direct communication.',
        },
        {
          heading: '2. How We Use Information',
          body:
            'We use your information to respond to inquiries, provide requested services, improve user experience, send important service-related updates, and maintain security of our platform.',
        },
        {
          heading: '3. Data Sharing',
          body:
            'We do not sell your personal data. Information may be shared only with trusted tools or service providers needed to operate our business, or when required by law.',
        },
        {
          heading: '4. Data Security',
          body:
            'We use reasonable technical and organizational safeguards to protect your data. While no online system is fully risk-free, we continuously work to improve our security practices.',
        },
        {
          heading: '5. Cookies and Analytics',
          body:
            'Our website may use cookies and analytics tools to understand traffic and improve performance. You can control cookies through your browser settings.',
        },
        {
          heading: '6. Your Rights',
          body:
            'You may request access, correction, or deletion of your personal information by contacting us. We will handle valid requests in a reasonable timeframe.',
        },
        {
          heading: '7. Contact',
          body: 'For privacy-related questions, contact us at',
        },
      ],
    },
    bn: {
      title: 'গোপনীয়তা নীতি',
      dateLabel: 'কার্যকর তারিখ: ২৪ এপ্রিল, ২০২৬',
      intro:
        'Apixel আপনার গোপনীয়তাকে সম্মান করে এবং আমাদের ওয়েবসাইট ও সেবার মাধ্যমে আপনি যে ব্যক্তিগত তথ্য শেয়ার করেন তা সুরক্ষিত রাখতে প্রতিশ্রুতিবদ্ধ।',
      sections: [
        {
          heading: '১. আমরা কী তথ্য সংগ্রহ করি',
          body:
            'আমরা আপনার নাম, ইমেইল, ফোন নম্বর, কোম্পানির তথ্য, প্রজেক্টের প্রয়োজনীয়তা এবং ফর্ম, পরামর্শ অনুরোধ বা সরাসরি যোগাযোগের মাধ্যমে দেওয়া অতিরিক্ত তথ্য সংগ্রহ করতে পারি।',
        },
        {
          heading: '২. তথ্য কীভাবে ব্যবহার করি',
          body:
            'আমরা আপনার তথ্য ব্যবহার করি আপনার জিজ্ঞাসার উত্তর দিতে, চাহিদামতো সেবা দিতে, ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে, গুরুত্বপূর্ণ সেবাসংক্রান্ত আপডেট পাঠাতে এবং প্ল্যাটফর্মের নিরাপত্তা বজায় রাখতে।',
        },
        {
          heading: '৩. তথ্য শেয়ারিং',
          body:
            'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। কেবল বিশ্বস্ত টুল/সেবা প্রদানকারীর সঙ্গে প্রয়োজন হলে বা আইনগত বাধ্যবাধকতায় তথ্য শেয়ার করা হতে পারে।',
        },
        {
          heading: '৪. তথ্য নিরাপত্তা',
          body:
            'আপনার তথ্য রক্ষায় আমরা যুক্তিসঙ্গত কারিগরি ও সাংগঠনিক সুরক্ষা ব্যবস্থা গ্রহণ করি। তবে অনলাইনে শতভাগ ঝুঁকিমুক্ত ব্যবস্থা নেই, তাই আমরা নিয়মিত নিরাপত্তা উন্নত করি।',
        },
        {
          heading: '৫. কুকিজ ও অ্যানালিটিক্স',
          body:
            'ওয়েবসাইটের ট্রাফিক বোঝা ও পারফরম্যান্স উন্নত করতে আমরা কুকিজ ও অ্যানালিটিক্স টুল ব্যবহার করতে পারি। আপনি ব্রাউজার সেটিংস থেকে কুকিজ নিয়ন্ত্রণ করতে পারবেন।',
        },
        {
          heading: '৬. আপনার অধিকার',
          body:
            'আপনি আপনার ব্যক্তিগত তথ্য দেখার, সংশোধনের বা মুছে ফেলার অনুরোধ করতে পারেন। আমরা যুক্তিসঙ্গত সময়ের মধ্যে বৈধ অনুরোধের ব্যবস্থা নেব।',
        },
        {
          heading: '৭. যোগাযোগ',
          body: 'গোপনীয়তা বিষয়ে প্রশ্ন থাকলে যোগাযোগ করুন:',
        },
      ],
    },
  };

  const currentContent = content[language];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Apixel</title>
        <meta
          name="description"
          content="Read Apixel's Privacy Policy to understand how we collect, use, and protect your information."
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
                        : 'text-slate-300 hover:text-white'
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
                        : 'text-slate-300 hover:text-white'
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

export default PrivacyPolicy;
