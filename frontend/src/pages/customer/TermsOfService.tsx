import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <FileText size={24} />
          </div>
          <h1 className="font-heading font-black text-4xl text-[#1A0B05]">Terms of Service</h1>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FAEDCD] prose prose-amber max-w-none text-[#5A3825]">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">1. Acceptance of Terms</h3>
          <p className="mb-6">
            By accessing and using the POP O'BOB application, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">2. Account Registration</h3>
          <p className="mb-4">
            To use certain features of the app, you must register for an account by providing your phone number and verifying it via OTP. You agree to:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Provide accurate, current, and complete information during the registration process.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Maintain the security of your account and take responsibility for all activities that occur under your account.</li>
          </ul>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">3. Ordering and Payments</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>All orders placed through the app are subject to product availability and store acceptance.</li>
            <li>Prices for products are described on our app and are incorporated into these Terms by reference. All prices are in Indian Rupees (INR).</li>
            <li>Payments are processed securely via third-party gateways (e.g., Razorpay). You agree to provide valid and authorized payment information.</li>
          </ul>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">4. Cancellations and Refunds</h3>
          <p className="mb-6">
            Orders once placed and accepted by the store generally cannot be cancelled. Refunds, if applicable (e.g., due to item unavailability), will be processed back to the original payment method within 5-7 business days, subject to the payment gateway's terms.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">5. Loyalty Program</h3>
          <p className="mb-6">
            Our Boba Loyalty Program allows you to earn points on qualifying purchases. Points have no cash value, cannot be exchanged for cash, and are subject to expiration or change at the discretion of POP O'BOB. We reserve the right to modify or terminate the loyalty program at any time.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">6. Limitation of Liability</h3>
          <p className="mb-6">
            To the fullest extent permitted by applicable law, POP O'BOB shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>
          
          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">7. Changes to Terms</h3>
          <p className="mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">8. Contact Information</h3>
          <p className="mb-6">
            If you have any questions about these Terms, please contact us at terms@popobob.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
