import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <Shield size={24} />
          </div>
          <h1 className="font-heading font-black text-4xl text-[#1A0B05]">Privacy Policy</h1>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FAEDCD] prose prose-amber max-w-none text-[#5A3825]">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">1. Introduction</h3>
          <p className="mb-6">
            Welcome to POP O'BOB. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website/app and tell you about your privacy rights and how the law protects you.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">2. The Data We Collect About You</h3>
          <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes your phone number used for secure OTP authentication.</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products or services you have purchased from us.</li>
            <li><strong>Profile Data:</strong> includes your purchases or orders made by you, your interests, preferences, and feedback.</li>
          </ul>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">3. How We Use Your Personal Data</h3>
          <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>To securely log you into our application using OTP verification.</li>
            <li>To process and deliver your order, manage payments, and collect money owed to us.</li>
            <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
            <li>To administer and protect our business and this website/app (including troubleshooting, data analysis, testing, system maintenance).</li>
          </ul>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">4. Disclosures of Your Personal Data</h3>
          <p className="mb-4">We may share your personal data with external third parties strictly for operational purposes:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong>MSG91:</strong> Used strictly for generating and verifying SMS OTPs for account security.</li>
            <li><strong>Razorpay:</strong> Used for securely processing your payments. We do not store your credit card or UPI details on our servers.</li>
          </ul>
          <p className="mb-6 font-semibold">We do not sell your personal data to third-party marketing or advertising agencies.</p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">5. Data Security</h3>
          <p className="mb-6">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">6. Your Legal Rights</h3>
          <p className="mb-6">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your personal data. If you wish to exercise any of the rights set out above, including requesting account deletion, please contact us at privacy@popobob.com.
          </p>

          <h3 className="text-xl font-bold text-[#1A0B05] mb-4">7. Contact Us</h3>
          <p className="mb-6">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:<br/>
            <strong>Email:</strong> privacy@popobob.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
