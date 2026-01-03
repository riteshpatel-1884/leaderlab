'use client';

import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Users, Bell } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 pt-20 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-gray-400 text-sm mt-1">Last updated: January 4, 2026</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to LeaderLab. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Acceptance of Terms</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                By creating an account or using LeaderLab, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p className="leading-relaxed">
                If you do not agree with any part of these terms, you must not use our platform.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Eligibility</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                You must be at least 13 years old to use LeaderLab. By using our platform, you represent and warrant that:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You are at least 13 years of age</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You have the legal capacity to enter into these Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>All information you provide is accurate and current</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You will maintain the accuracy of such information</span>
                </li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">User Accounts</h2>
            </div>
            
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Account Creation</h3>
                <p className="leading-relaxed">
                  To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Account Security</h3>
                <p className="leading-relaxed">
                  You must immediately notify us of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Account Termination</h3>
                <p className="leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for any reason, including but not limited to violation of these Terms of Service.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Acceptable Use Policy</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">You agree not to:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Use the platform for any illegal or unauthorized purpose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Violate any laws in your jurisdiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Share your account credentials with others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Interfere with or disrupt the platform or servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Use automated systems to access the platform without permission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Copy, reproduce, or distribute our content without authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Harass, abuse, or harm other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Submit false or misleading information</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-white">Intellectual Property Rights</h2>
            </div>
            
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Our Content</h3>
                <p className="leading-relaxed">
                  All content on LeaderLab, including text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of LeaderLab or its content suppliers and is protected by intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Your Content</h3>
                <p className="leading-relaxed">
                  You retain all rights to any content you submit to LeaderLab. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with operating the platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">License to Use</h3>
                <p className="leading-relaxed">
                  We grant you a limited, non-exclusive, non-transferable license to access and use LeaderLab for your personal, non-commercial use, subject to these Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Points and Gamification */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-semibold text-white">Points and Gamification</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                LeaderLab uses a points system to track your progress. Points have no monetary value and cannot be exchanged for cash or other items of value.
              </p>
              <p className="leading-relaxed">
                We reserve the right to modify the points system, adjust point values, or reset points at any time without prior notice.
              </p>
              <p className="leading-relaxed">
                Any attempt to manipulate or exploit the points system may result in immediate account termination.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-semibold text-white">Disclaimer of Warranties</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                LeaderLab is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>The platform will meet your requirements or be uninterrupted, timely, secure, or error-free</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>The results obtained from the use of the platform will be accurate or reliable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Any errors in the platform will be corrected</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-semibold text-white">Limitation of Liability</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                To the maximum extent permitted by law, LeaderLab and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="leading-relaxed">
                Our total liability for any claims arising from or related to these Terms or your use of LeaderLab shall not exceed the amount you paid to us in the past 12 months, or $100, whichever is greater.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Indemnification</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless LeaderLab and its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these Terms or any activity related to your account.
              </p>
            </div>
          </section>

          {/* Modifications to Terms */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-semibold text-white">Modifications to Terms</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p className="leading-relaxed">
                Your continued use of LeaderLab after any such changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the platform.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Governing Law and Jurisdiction</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of LeaderLab shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed mb-3">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-[#0f0f1a]/50 rounded-lg p-4 border border-gray-800/30">
                <p className="font-medium text-white">Email: legal@leaderlab.in</p>
                <p className="text-sm mt-1">We will respond to your inquiry within 48 hours.</p>
              </div>
            </div>
          </section>

          {/* Severability */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Severability</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
              </p>
            </div>
          </section>

          {/* Entire Agreement */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-semibold text-white">Entire Agreement</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and LeaderLab regarding your use of the platform and supersede all prior agreements and understandings, whether written or oral.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}