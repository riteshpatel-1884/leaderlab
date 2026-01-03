'use client';

import { Shield, Lock, Eye, Database, UserCheck, Mail, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 pt-20 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-gray-400 text-sm mt-1">Last updated: January 4, 2026</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            At LeaderLab, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Information We Collect */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Personal Information</h3>
                <p className="leading-relaxed">
                  When you create an account, we collect information such as your name, email address, and profile details. We use Clerk for authentication, which may collect additional authentication-related data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                <p className="leading-relaxed">
                  We automatically collect information about your interactions with our platform, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Questions you solve and practice sessions</li>
                  <li>Points earned and progress tracking</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on our platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Cookies and Tracking</h3>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, maintain your session, and analyze platform usage.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <p className="leading-relaxed">We use the collected information for the following purposes:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To provide, maintain, and improve our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To personalize your learning experience and track your progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To communicate with you about updates, features, and support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To analyze usage patterns and improve our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To detect, prevent, and address technical issues and security threats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>To comply with legal obligations and enforce our terms of service</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Information Sharing and Disclosure</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Service Providers</h3>
                <p className="leading-relaxed">
                  We use third-party service providers such as Clerk (authentication), Vercel (hosting), and database services to operate our platform. These providers have access to your information only to perform tasks on our behalf.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Legal Requirements</h3>
                <p className="leading-relaxed">
                  We may disclose your information if required by law or in response to valid requests by public authorities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Business Transfers</h3>
                <p className="leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-white">Data Security</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
            </div>
            
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Access and receive a copy of your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Correct or update your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Delete your account and associated data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Object to or restrict certain processing of your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Withdraw consent where we rely on it</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Children's Privacy</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-semibold text-white">Changes to This Privacy Policy</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            
            <div className="text-gray-300">
              <p className="leading-relaxed mb-3">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-[#0f0f1a]/50 rounded-lg p-4 border border-gray-800/30">
                <p className="font-medium text-white">Email: privacy@leaderlab.in</p>
                <p className="text-sm mt-1">We will respond to your inquiry within 48 hours.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}