"use client";

import { PageHeader } from "@/src/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  MessageCircle,
  Mail,
  BookOpen,
  FileQuestion,
  ExternalLink,
  MessagesSquare,
} from "lucide-react";
import { Crisp } from "crisp-sdk-web";

const SupportPage = () => {
  const openCrispChat = () => {
    Crisp.chat.open();
    Crisp.chat.show();
  };

  return (
    <div className="space-y-4 overflow-y-scroll">
      <PageHeader
        title="Support Center"
        subtitle="Get help and support for your account"
      />
      <div className="grid px-8 py-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Live Chat Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Chat with our support team in real-time for immediate assistance.
            </p>
            <Button onClick={openCrispChat} className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@yourdomain.com">Send Email</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Browse our documentation for detailed guides and tutorials.
            </p>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="px-8 py-8 space-y-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <FileQuestion className="h-6 w-6" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <MessagesSquare className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-2xl font-semibold">Join Our Community</h3>
          <p className="text-muted-foreground">
            Connect with other users, share experiences, and get help from the community.
          </p>
          <Button variant="outline" className="mt-4">
            Join Discord
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const faqs = [
  {
    question: "How do I get started?",
    answer: "Sign up for an account, complete your profile, and you can start using our services immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for business accounts.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "How secure is my data?",
    answer: "We use industry-standard encryption and security measures to protect your data.",
  },
];

export default SupportPage; 