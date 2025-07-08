import React from 'react';
import GlassCard from '@/components/GlassCard';
import { 
  HelpCircle, 
  MapPin, 
  Car, 
  Bus, 
  Shirt, 
  Baby, 
  Coffee, 
  Calendar,
  AlertCircle 
} from 'lucide-react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      icon: AlertCircle,
      question: "Is the venue different to the one listed on the save the date?",
      answer: "Yes! We apologise for any issues this has caused for people who already booked accommodation. The Edwards (the original venue) went into liquidation in February 2025 (and they kept our money!). The new venue is approximately 1 hour drive from Newcastle. A coach will be available to transport people between Newcastle and the wedding venue."
    },
    {
      icon: Car,
      question: "Is there plenty of parking at the wedding venue?",
      answer: "Yes, there is plenty of on-site parking at Ben Ean."
    },
    {
      icon: Bus,
      question: "Are there other ways to get to the wedding venue besides driving?",
      answer: "Yes. There will be two coaches available to transport guests to and from the wedding ceremony and reception. One coach will collect guests from Newcastle City, the other will collect guests staying in the Hunter Valley. Please indicate in the RSVP how many seats on the coach you would like and where you are staying. Availability is strictly on a first come, first served basis."
    },
    {
      icon: MapPin,
      question: "Is the wedding indoor or outdoor?",
      answer: "Both! The ceremony and cocktail hour are outside and the reception is inside. We have a wet weather plan in place, so everyone will stay warm and dry."
    },
    {
      icon: Baby,
      question: "Are children invited?",
      answer: "Although we love your little ones, we probably met you before children and we would love to spend the night celebrating with just you! Babes in arms excepted."
    },
    {
      icon: Coffee,
      question: "Is there a recovery breakfast?",
      answer: "While we do not have a formal recovery breakfast planned, we will be at Newcastle Beach from 11 am onwards on Monday October 6th. There is a kiosk that serves good coffee and excellent food. Good for soaking up the libations!"
    },
    {
      icon: Calendar,
      question: "Any other fun stuff planned?",
      answer: "Tim and Kirsten will be at the Prince of Mereweather pub from 4-8 pm on Saturday 4th of October. Stop in to have a drink and grab yourself a meal if you are hungry."
    },
    {
      icon: Shirt,
      question: "What's the dress code?",
      answer: "Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit."
    }
  ];

  return (
    <div className="min-h-screen px-3 sm:px-5 pt-8 sm:pt-12 pb-20">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl lg:wedding-heading font-semibold text-wedding-navy mb-2 sm:mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Everything you need to know about Tim & Kirsten's wedding
        </p>
      </div>

      {/* Important Notice */}
      <GlassCard className="mb-6 sm:mb-8 p-4 sm:p-6 animate-fade-up border-l-4 border-amber-400" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-wedding-navy mb-2 text-sm sm:text-base">Important Venue Update</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Please note the venue has changed from The Edwards to Ben Ean due to the original venue going into liquidation. 
              We've arranged coach transport to help with the change. Thank you for your understanding!
            </p>
          </div>
        </div>
      </GlassCard>

      {/* FAQ List */}
      <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <GlassCard 
            key={index}
            className="p-4 sm:p-6 animate-fade-up"
            style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-glass-blue/20 flex items-center justify-center flex-shrink-0">
                <faq.icon className="w-4 h-4 sm:w-5 sm:h-5 text-glass-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-wedding-navy mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Additional Events */}
      <GlassCard 
        className="mt-6 sm:mt-8 p-4 sm:p-6 animate-fade-up max-w-4xl mx-auto" 
        variant="secondary"
        style={{ animationDelay: '1.0s' }}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-wedding-navy flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Weekend Events
        </h3>
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
          <div className="p-3 sm:p-4 bg-glass-green/10 rounded-lg">
            <p className="font-medium text-wedding-navy mb-1 text-sm sm:text-base">Saturday, October 4th</p>
            <p className="text-muted-foreground">
              <strong>Pre-wedding drinks:</strong> Prince of Mereweather pub, 4-8 PM
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Come have a drink and grab a meal if you're hungry!
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-glass-blue/10 rounded-lg">
            <p className="font-medium text-wedding-navy mb-1 text-sm sm:text-base">Monday, October 6th</p>
            <p className="text-muted-foreground">
              <strong>Recovery hangout:</strong> Newcastle Beach, from 11 AM
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Kiosk with good coffee and food - perfect for recovery!
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Contact Card */}
      <GlassCard 
        className="mt-4 sm:mt-6 p-4 sm:p-6 text-center animate-fade-up max-w-md mx-auto" 
        variant="frosted"
        style={{ animationDelay: '1.2s' }}
      >
        <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-glass-purple" />
        <h3 className="font-semibold mb-2 text-wedding-navy text-sm sm:text-base">Still have questions?</h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Don't hesitate to reach out to Tim & Kirsten directly if you need any clarification!
        </p>
      </GlassCard>
    </div>
  );
};

export default FAQ;