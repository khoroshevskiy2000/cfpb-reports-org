import { Shield, CheckCircle, FileText, Phone, Mail, MapPin, DollarSign, Users, Scale, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [caseNumber, setCaseNumber] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckStatus = () => {
    if (caseNumber.trim()) {
      setIsCheckingStatus(true);
      setTimeout(() => {
        navigate(`/case/${caseNumber}`);
      }, 1500);
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.id]: e.target.value
    });
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => {
          setIsContactFormOpen(false);
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden md:flex md:items-center md:justify-between py-4">
            <img src="/logo_237x50.c7c2ba6c929f copy.png" alt="CFPB Logo" className="h-12" />
            <nav className="flex gap-6">
              <a href="#home" className="text-base text-gray-700 hover:text-green-600 transition font-medium">Home</a>
              <a href="#about" className="text-base text-gray-700 hover:text-green-600 transition font-medium">About us</a>
              <button onClick={() => setIsContactFormOpen(true)} className="text-base text-gray-700 hover:text-green-600 transition font-medium">Contact us</button>
            </nav>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter case number"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700 text-base w-48"
              />
              <button
                onClick={handleCheckStatus}
                disabled={isCheckingStatus}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {isCheckingStatus ? 'Checking in progress...' : 'Check Status of Your Case'}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden py-3">
            <div className="flex items-center justify-between">
              <img src="/logo_237x50.c7c2ba6c929f copy.png" alt="CFPB Logo" className="h-7" />

              {/* Mobile Case Check Section */}
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Case #"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-24 border-2 border-gray-300 focus:border-green-600 focus:outline-none px-3 py-2 rounded-lg text-gray-700 text-sm"
                />
                <button
                  onClick={handleCheckStatus}
                  disabled={isCheckingStatus}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isCheckingStatus ? 'Checking...' : 'Check'}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 p-2"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-3">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-700 hover:text-green-600 transition font-medium">Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-700 hover:text-green-600 transition font-medium">About us</a>
              <button onClick={() => { setIsContactFormOpen(true); setIsMobileMenuOpen(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-green-600 transition font-medium">Contact us</button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                  Understanding the CFPB
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 md:mb-6">
                  The Consumer Financial Protection Bureau (CFPB) is a U.S. government agency that protects consumers from unfair, deceptive, or abusive financial practices.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  It ensures that banks, lenders, and other financial companies treat people honestly and fairly — and gives everyday Americans the tools and protection they need to make smart financial choices.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/5.png"
                  alt="CFPB Building"
                  className="rounded-lg shadow-xl w-full max-w-md object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Created Section */}
      <section id="about" className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Scale className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Why the CFPB Was Created</h3>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Before the CFPB existed, financial regulation was scattered across several agencies, leaving room for predatory lending, hidden fees, and misleading contracts.
              </p>
              <p>
                After the 2008 financial crisis, millions of Americans lost their savings and homes due to unclear loan terms and deceptive financial products. In response, Congress passed the <strong>Dodd-Frank Wall Street Reform and Consumer Protection Act of 2010</strong>, creating the CFPB to restore trust, accountability, and transparency in the financial system.
              </p>
              <p className="text-green-700 font-semibold">
                The CFPB began operations in 2011 — and since then, it has become one of the strongest consumer watchdogs in the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Responsibilities */}
      <section id="responsibilities" className="py-10 md:py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              The CFPB's Main Responsibilities
            </h3>

            <div className="space-y-6 md:space-y-8">
              {/* Responsibility 1 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border-l-4 border-green-600">
                <div className="flex items-start gap-3 md:gap-4">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">1. Protect Consumers from Unfair Practices</h4>
                    <p className="text-gray-700 mb-4">
                      The CFPB enforces federal laws that stop financial institutions from taking advantage of customers. It investigates and penalizes companies that mislead, overcharge, or discriminate.
                    </p>
                    <p className="font-semibold text-gray-800 mb-2">Common areas they monitor:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Hidden fees or misleading loan terms</li>
                      <li>Harassment by debt collectors</li>
                      <li>Errors in credit reports</li>
                      <li>Discriminatory lending based on race, gender, or age</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Responsibility 2 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border-l-4 border-green-600">
                <div className="flex items-start gap-3 md:gap-4">
                  <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">2. Help Consumers Retrieve Their Funds</h4>
                    <p className="text-gray-700 mb-4">
                      One of the most powerful impacts of the CFPB is its ability to help people get their money back when they've been wronged by a financial company.
                    </p>
                    <p className="text-lg font-bold text-green-700 mb-4">
                      Since its founding, the CFPB has helped millions of Americans recover more than $17 billion in refunds, canceled debts, and compensation through enforcement actions and settlements.
                    </p>
                    <p className="font-semibold text-gray-800 mb-2">These recoveries often come from:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                      <li>Illegal credit card fees</li>
                      <li>Unauthorized bank charges</li>
                      <li>Mortgage overpayments</li>
                      <li>Fraudulent or misleading financial products</li>
                    </ul>
                    <p className="text-gray-700">
                      Through its complaint system and legal authority, the CFPB gives consumers a real chance to get justice and retrieve lost funds from the financial market.
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsibility 3 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border-l-4 border-green-600">
                <div className="flex items-start gap-3 md:gap-4">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">3. Educate and Empower Consumers</h4>
                    <p className="text-gray-700 mb-4">
                      The CFPB provides tools, guides, and financial education resources to help people understand their rights and make informed decisions.
                    </p>
                    <p className="font-semibold text-gray-800 mb-2">Topics include:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                      <li>How to check and improve your credit score</li>
                      <li>How to compare loan offers</li>
                      <li>What to do if you're a victim of financial fraud</li>
                      <li>Steps to protect yourself from scams</li>
                    </ul>
                    <p className="text-gray-700">
                      You can access these free tools at <a href="mailto:Inquiries@cfpb-reports.com" className="text-green-600 font-semibold hover:text-green-700">Inquiries@cfpb-reports.com</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsibility 4 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border-l-4 border-green-600">
                <div className="flex items-start gap-3 md:gap-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">4. Supervise Financial Institutions</h4>
                    <p className="text-gray-700 mb-4">
                      The Bureau conducts regular reviews and audits of banks, lenders, credit bureaus, and other financial companies to ensure they're following federal consumer protection laws.
                    </p>
                    <p className="text-gray-700">
                      When a company breaks the rules, the CFPB can take enforcement actions such as fines, orders to refund customers, or even lawsuits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsibility 5 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border-l-4 border-green-600">
                <div className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">5. Handle Consumer Complaints</h4>
                    <p className="text-gray-700 mb-4">
                      If you've had a bad experience with a financial company, the CFPB allows you to file a complaint directly through its online system. Once filed, the Bureau contacts the company and helps mediate a response — many consumers get results within weeks.
                    </p>
                    <p className="font-semibold text-gray-800 mb-2">Common complaint areas:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Incorrect credit report information</li>
                      <li>Mortgage and loan issues</li>
                      <li>Debt collection harassment</li>
                      <li>Problems with bank accounts or credit cards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center">How the CFPB Helps You</h3>
            <p className="text-base sm:text-lg text-gray-700 mb-6 md:mb-8 text-center">
              The CFPB's work goes beyond regulation — it actively fights for fairness in the financial market and helps people recover lost money.
            </p>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">What They've Achieved:</h4>
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Returned over <strong className="text-green-700">$17 billion</strong> directly to consumers</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Exposed and fined major corporations for deceptive practices</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Improved transparency in mortgages, student loans, and credit cards</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Created easier-to-read financial disclosures</p>
                </div>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-center text-gray-800 font-semibold">
              The CFPB's mission is simple: make the financial system work for everyone, not just for large institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-10 md:py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Leadership and Independence</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The CFPB is led by a Director, appointed by the President and confirmed by the Senate for a five-year term.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  It operates independently from Congress and the White House, ensuring its decisions remain focused on consumer protection rather than political influence.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/photo_2025-10-13_17-11-42.jpg"
                  alt="CFPB Office"
                  className="rounded-lg shadow-xl w-full max-w-md object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lasting Impact */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 md:mb-6">The CFPB's Lasting Impact</h3>
            <p className="text-gray-700 mb-6">Since 2011, the CFPB has:</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Helped millions retrieve funds lost through unfair practices</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Stopped abusive payday lending and hidden banking fees</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Brought more transparency to credit reporting</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Empowered Americans with free financial education resources</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Through enforcement and education, the CFPB continues to make the U.S. financial system safer, fairer, and more transparent for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-10 md:py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">How to Contact the CFPB</h3>
            <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">Phone</h4>
                <a href="tel:+19293091517" className="hover:text-green-200 transition">+1 929 309 15 17</a>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <Mail className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">Email</h4>
                <a href="mailto:Inquiries@cfpb-reports.com" className="hover:text-green-200 transition">Inquiries@cfpb-reports.com</a>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">Mail</h4>
                <p className="text-sm">Consumer Financial Protection Bureau<br/>P.O. Box 27170<br/>Washington, DC 20038</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-10 md:py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Summary</h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
              The Consumer Financial Protection Bureau (CFPB) stands as the nation's first line of defense against financial abuse. It protects consumers, holds companies accountable, and helps people recover funds lost through fraud or unfair financial practices.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Whether you're applying for a loan, managing debt, or just learning your rights — the CFPB ensures that your money and your future are protected.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
              <button
                onClick={() => setIsContactFormOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleContactFormSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={contactForm.subject}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700 resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>
              {submitMessage && (
                <div className={`text-center py-2 px-4 rounded-lg ${
                  submitMessage.includes('success')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {submitMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Shield className="w-6 h-6 md:w-8 md:h-8" />
            <p className="text-base sm:text-lg md:text-xl font-bold">Consumer Financial Protection Bureau</p>
          </div>
          <p className="text-sm md:text-base text-gray-400">Protecting consumers since 2011</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
