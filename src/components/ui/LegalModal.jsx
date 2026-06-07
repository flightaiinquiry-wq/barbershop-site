import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 2026',
    content: [
      {
        heading: 'Information We Collect',
        body: `When you book an appointment, we collect your name, email address, and phone number. We use this information solely to confirm your booking, send reminders, and follow up after your visit. We do not sell, rent, or share your personal information with third parties.`,
      },
      {
        heading: 'How We Use Your Information',
        body: `Your contact information is used to:\n• Confirm and manage your appointments\n• Send booking reminders\n• Follow up after your service\n• Respond to your inquiries\n\nWe will never contact you for unrelated marketing purposes without your explicit consent.`,
      },
      {
        heading: 'Data Storage',
        body: `Your booking information is stored securely in our internal system. We retain records for up to 2 years for business purposes. You may request deletion of your data at any time by contacting us directly.`,
      },
      {
        heading: 'Cookies',
        body: `This website uses minimal cookies required for the booking system to function. We do not use tracking or advertising cookies.`,
      },
      {
        heading: 'Your Rights',
        body: `You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us at the information provided below.`,
      },
      {
        heading: 'Contact',
        body: `For any privacy-related questions, contact Top Barbershop at 6722 San Pedro Ave, San Antonio, TX 78216 or call +1 (210) 548-6613.`,
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    updated: 'June 2026',
    content: [
      {
        heading: 'Booking & Appointments',
        body: `By booking an appointment you agree to arrive on time. Late arrivals of more than 15 minutes may result in a shortened service or rescheduling at the discretion of the barber. Appointments are reserved exclusively for you — last-minute gaps cannot always be filled.`,
      },
      {
        heading: 'Cancellation Policy',
        body: `We require at least 24 hours notice to cancel or reschedule an appointment. Cancellations with less than 24 hours notice, or no-shows, may result in a cancellation fee or a required deposit for future bookings.\n\nWe understand that emergencies happen — please contact us as early as possible if you need to make a change.`,
      },
      {
        heading: 'Service Results',
        body: `We take pride in delivering high-quality cuts tailored to each client. If you are unsatisfied with your service, please let us know before leaving the shop or contact us within 24 hours. We will do our best to make it right at no additional charge.`,
      },
      {
        heading: 'Health & Safety',
        body: `Please inform us of any scalp conditions, skin sensitivities, or recent head injuries before your appointment. We reserve the right to decline a service if we believe it may cause harm. Clients with active scalp infections should reschedule.`,
      },
      {
        heading: 'Senior Citizen Discount',
        body: `A $5 discount is offered on all services for clients aged 65 and older. Please mention your eligibility at the time of booking or upon arrival. This discount cannot be combined with other offers.`,
      },
      {
        heading: 'Liability',
        body: `Top Barbershop is not liable for any allergic reactions to products used during a service where the client has not disclosed known sensitivities. Clients are responsible for providing accurate health information prior to their appointment.`,
      },
      {
        heading: 'Changes to Terms',
        body: `We reserve the right to update these terms at any time. Continued use of our booking services constitutes acceptance of any updated terms.`,
      },
    ],
  },

  cancellation: {
    title: 'Cancellation Policy',
    updated: 'June 2026',
    content: [
      {
        heading: '24-Hour Notice Required',
        body: `We ask that all cancellations and rescheduling requests be made at least 24 hours before your scheduled appointment. This allows us to offer the slot to another client.`,
      },
      {
        heading: 'Late Cancellations & No-Shows',
        body: `Cancellations made with less than 24 hours notice, or failure to show up without notice, may result in:\n• A cancellation fee applied to your next booking\n• A required deposit to secure future appointments\n\nRepeated no-shows may result in being unable to book future appointments.`,
      },
      {
        heading: 'How to Cancel',
        body: `To cancel or reschedule, contact us as early as possible by calling +1 (210) 548-6613 or through the booking system. We will always do our best to accommodate changes when given adequate notice.`,
      },
      {
        heading: 'Barber Cancellations',
        body: `In the rare event we need to cancel your appointment, we will notify you as soon as possible and prioritize rescheduling you at the next available time.`,
      },
      {
        heading: 'Emergencies',
        body: `We understand that unexpected situations arise. If you have an emergency, please contact us as soon as you are able. We handle all situations with care and flexibility.`,
      },
    ],
  },
}

export default function LegalModal({ doc, onClose }) {
  const data = DOCS[doc]

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!data) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: '#f8f6f0', border: '1px solid rgba(202,138,4,0.2)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(202,138,4,0.15)' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1408', fontFamily: "'Bodoni Moda',serif", margin: 0 }}>{data.title}</h2>
              <p style={{ fontSize: 11, color: '#9A8050', marginTop: 2, fontFamily: "'Jost',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Last updated: {data.updated}</p>
            </div>
            <button onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(202,138,4,0.1)', border: '1px solid rgba(202,138,4,0.2)', cursor: 'pointer', fontSize: 16, color: '#CA8A04', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Jost,sans-serif' }}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-6 py-6" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.content.map((section, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1408', marginBottom: 8, fontFamily: "'Jost',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {section.heading}
                </h3>
                <p style={{ fontSize: 14, color: '#5A4020', lineHeight: 1.75, whiteSpace: 'pre-line', fontFamily: "'Jost',sans-serif", margin: 0 }}>
                  {section.body}
                </p>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#9A8050', paddingTop: 16, borderTop: '1px solid rgba(202,138,4,0.12)', fontFamily: "'Jost',sans-serif" }}>
              © 2020 Top Barbershop — 6722 San Pedro Ave, San Antonio, TX 78216
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
