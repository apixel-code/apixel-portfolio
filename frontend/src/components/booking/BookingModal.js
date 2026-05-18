import axios from 'axios';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Monitor, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

const timeSlots = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
];

const initialForm = {
  name: '',
  email: '',
  notes: '',
};

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
  const [timeSlot, setTimeSlot] = useState('');
  const [platform, setPlatform] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = startOfDay(new Date());
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);

    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [visibleMonth]);

  // Each step owns its own completion rule so navigation and final submit stay disabled until valid.
  const canContinue = useMemo(() => {
    if (step === 1) return selectedDate && timeSlot;
    if (step === 2) return platform;
    return formData.name.trim() && formData.email.trim() && formData.notes.trim();
  }, [formData, platform, selectedDate, step, timeSlot]);

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setVisibleMonth(startOfMonth(new Date()));
    setTimeSlot('');
    setPlatform('');
    setFormData(initialForm);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    resetModal();
    onClose();
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Persist the final booking request to the public bookings API.
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/bookings`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        notes: formData.notes.trim(),
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot,
        platform,
      });

      toast.success('Booking request submitted successfully!');
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit booking request.');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (canContinue) setStep((current) => Math.min(current + 1, 3));
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const steps = ['Schedule', 'Platform', 'Details'];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-3 sm:px-6">
            <motion.div
              className="flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#06101f] shadow-2xl shadow-black/60"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-title"
            >
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-gold" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan sm:text-sm">Book a Meeting</p>
                  <h2 id="booking-modal-title" className="mt-1 font-syne text-xl font-bold text-white sm:text-2xl">
                  Schedule Your Project Call
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                    Pick a time, choose your meeting platform, and tell us a little about the project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close booking modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-5 pt-5 sm:px-6">
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                {steps.map((label, index) => {
                  const itemStep = index + 1;
                  const isActive = step === itemStep;
                  const isDone = step > itemStep;

                  return (
                    <div
                      key={label}
                      className={`flex min-w-0 items-center justify-center gap-2 rounded-xl border px-2 py-2 text-center text-xs font-semibold transition sm:text-sm ${
                        isActive || isDone
                          ? 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan shadow-[0_0_18px_rgba(0,245,255,0.08)]'
                          : 'border-white/10 bg-white/5 text-slate-400'
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        isActive || isDone ? 'bg-brand-cyan text-brand-dark' : 'bg-white/10 text-slate-400'
                      }`}>
                        {itemStep}
                      </span>
                      <span className="truncate">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {step === 1 && (
                <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <CalendarDays size={18} className="text-brand-cyan" />
                      <h3 className="font-syne text-lg font-semibold">Choose Date</h3>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setVisibleMonth((current) => subMonths(current, 1))}
                          disabled={isSameMonth(visibleMonth, today)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Previous month"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <p className="font-syne text-sm font-semibold text-white">
                          {format(visibleMonth, 'MMMM yyyy')}
                        </p>
                        <button
                          type="button"
                          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
                          aria-label="Next month"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <span key={day} className="py-2">{day}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date) => {
                          const isDisabled = isBefore(date, today) || !isSameMonth(date, visibleMonth);
                          const isSelected = selectedDate && isSameDay(date, selectedDate);

                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedDate(date);
                                setTimeSlot('');
                              }}
                              className={`flex aspect-square min-h-[38px] items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed ${
                                isSelected
                                  ? 'bg-brand-cyan text-brand-dark'
                                  : isDisabled
                                    ? 'text-slate-700'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                              aria-pressed={Boolean(isSelected)}
                            >
                              {format(date, 'd')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3">
                      <h3 className="font-syne text-lg font-semibold text-white">Available Time Slots</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date to activate the slots.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          disabled={!selectedDate}
                          onClick={() => setTimeSlot(slot)}
                          className={`min-h-[48px] rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${
                            timeSlot === slot
                              ? 'border-brand-cyan bg-brand-cyan text-brand-dark'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-cyan/40 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {!selectedDate && (
                      <p className="mt-3 text-sm text-slate-500">Select a date first to choose a time slot.</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-5 flex items-center gap-2 text-white">
                    <Monitor size={18} className="text-brand-cyan" />
                    <h3 className="font-syne text-lg font-semibold">Choose Meeting Platform</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {['Zoom', 'Google Meet'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPlatform(option)}
                        className={`flex min-h-[150px] items-center justify-between gap-4 rounded-2xl border p-5 text-left transition ${
                          platform === option
                            ? 'border-brand-cyan bg-brand-cyan/10 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-cyan/40 hover:text-white'
                        }`}
                      >
                        <span>
                          <span className="block font-syne text-lg font-semibold">{option}</span>
                          <span className="mt-1 block text-sm text-slate-400">
                            {option === 'Zoom' ? 'Best for screen sharing and workshops.' : 'Quick browser-based meeting link.'}
                          </span>
                        </span>
                        {platform === option && <CheckCircle2 size={22} className="text-brand-cyan" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="booking-name" className="mb-2 block text-sm text-slate-400">
                      Full Name *
                    </label>
                    <input
                      id="booking-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-dark"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="mb-2 block text-sm text-slate-400">
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-dark"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-notes" className="mb-2 block text-sm text-slate-400">
                      Project Brief / Additional Notes *
                    </label>
                    <textarea
                      id="booking-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={5}
                      className="input-dark resize-none"
                      placeholder="Tell us what you want to build, promote, or improve..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                type="button"
                onClick={previousStep}
                disabled={step === 1 || isSubmitting}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canContinue}
                  className="btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canContinue || isSubmitting}
                  className="btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              )}
            </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BookingModal;
