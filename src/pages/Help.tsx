import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'rsvp' | 'photos' | 'venue';
}

const Help: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  });

  const faqs: FAQItem[] = [
    {
      question: "How do I RSVP to the wedding?",
      answer: "Navigate to the RSVP page from the bottom navigation and fill out the form. You can update your RSVP anytime before the deadline.",
      category: "rsvp"
    },
    {
      question: "Can I upload photos to the gallery?",
      answer: "Yes! Go to the Gallery page and tap the upload button. Your photos will be reviewed before being added to the shared gallery.",
      category: "photos"
    },
    {
      question: "Where can I find venue information?",
      answer: "Visit the Venue page for detailed information about Ben Ean, including directions, parking, and accommodation recommendations.",
      category: "venue"
    },
    {
      question: "How do I change my profile information?",
      answer: "Tap the profile button in the top right corner, then select 'My Profile' to edit your personal information.",
      category: "general"
    },
    {
      question: "What should I wear to the wedding?",
      answer: "Check the dress code information on the event details in the Home page. When in doubt, cocktail attire is always appropriate.",
      category: "general"
    },
    {
      question: "Can I bring a plus one?",
      answer: "This depends on your invitation. Check your RSVP form - if you can select more than 1 guest, you're welcome to bring someone!",
      category: "rsvp"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the message
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });

    setContactForm({ subject: '', message: '', email: '' });
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-wedding-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-wedding-navy">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Get help with the wedding app</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-hsl(var(--glass-blue-tint))" />
          <h3 className="font-semibold text-sm mb-1">Live Chat</h3>
          <p className="text-xs text-muted-foreground">Chat with support</p>
        </GlassCard>

        <GlassCard className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
          <Mail className="w-8 h-8 mx-auto mb-2 text-hsl(var(--glass-green-tint))" />
          <h3 className="font-semibold text-sm mb-1">Email Support</h3>
          <p className="text-xs text-muted-foreground">Send us a message</p>
        </GlassCard>

        <GlassCard className="p-4 text-center hover:scale-105 transition-transform cursor-pointer">
          <Phone className="w-8 h-8 mx-auto mb-2 text-hsl(var(--glass-pink-tint))" />
          <h3 className="font-semibold text-sm mb-1">Call Us</h3>
          <p className="text-xs text-muted-foreground">Direct phone support</p>
        </GlassCard>
      </div>

      {/* FAQ Section */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-hsl(var(--glass-purple-tint))" />
          <h2 className="text-lg font-semibold text-wedding-navy">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-glass-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <span className="font-medium text-wedding-navy">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {expandedFAQ === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Contact Form */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-wedding-navy mb-6">Contact Support</h2>
        
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              placeholder="What can we help you with?"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="Describe your issue or question in detail..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact-email">Your Email (optional)</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll use your account email if this is left blank
            </p>
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Help;