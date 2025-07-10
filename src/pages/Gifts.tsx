import React from 'react';
import { Gift, Heart, CreditCard, MapPin, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';

const Gifts: React.FC = () => {
  const registryItems = [
    {
      store: "David Jones",
      description: "Home & kitchen essentials for our new life together",
      url: "https://www.davidjones.com",
      icon: "🏪"
    },
    {
      store: "Myer",
      description: "Beautiful pieces for our home",
      url: "https://www.myer.com.au",
      icon: "🛍️"
    },
    {
      store: "Peter's of Kensington",
      description: "Quality kitchenware and homewares",
      url: "https://www.petersofkensington.com.au",
      icon: "🍳"
    }
  ];

  const honeymoonFund = {
    title: "Honeymoon Fund",
    description: "Help us create magical memories on our European adventure",
    account: "BSB: 062-000 | Account: 1234-5678",
    reference: "TimKirsten-Honeymoon"
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-up">
          <Gift className="w-12 h-12 mx-auto text-wedding-gold" />
          <h1 className="text-3xl sm:text-4xl font-bold text-wedding-navy">
            Wedding Gifts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your presence is the best present! If you wish to give a gift, we've put together some options to help us start our new journey together.
          </p>
        </div>

        {/* Gift Philosophy */}
        <GlassCard className="p-6 text-center animate-fade-up">
          <Heart className="w-8 h-8 mx-auto text-glass-pink mb-4" />
          <h2 className="text-xl font-semibold text-wedding-navy mb-3">
            The Most Important Gift
          </h2>
          <p className="text-muted-foreground">
            Having you celebrate with us is truly all we need. Your love, laughter, and presence 
            on our special day mean more to us than any material gift ever could.
          </p>
        </GlassCard>

        {/* Wedding Registry */}
        <div className="space-y-6 animate-fade-up">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-wedding-navy mb-2">
              Wedding Registry
            </h2>
            <p className="text-muted-foreground">
              We've registered at these stores for home essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {registryItems.map((item, index) => (
              <GlassCard key={index} className="p-6 text-center space-y-4 hover:scale-105 transition-transform">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-lg font-semibold text-wedding-navy">
                  {item.store}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full glass-button"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Registry
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Honeymoon Fund */}
        <div className="space-y-6 animate-fade-up">
          <GlassCard className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">✈️</div>
              <h2 className="text-2xl font-semibold text-wedding-navy">
                {honeymoonFund.title}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {honeymoonFund.description}
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-center space-x-2 text-wedding-gold">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Bank Transfer Details</span>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">Account Details</div>
                <div className="font-mono text-wedding-navy font-medium">
                  {honeymoonFund.account}
                </div>
                <div className="text-sm text-muted-foreground">
                  Reference: <span className="font-medium">{honeymoonFund.reference}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Please include the reference so we know it's from you ❤️
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Gift Delivery Information */}
        <GlassCard className="p-6 animate-fade-up">
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-wedding-gold mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-wedding-navy">
                Gift Delivery
              </h3>
              <div className="text-muted-foreground space-y-1">
                <p>
                  If you prefer to send a physical gift, please have it delivered to:
                </p>
                <div className="font-medium text-wedding-navy">
                  Tim & Kirsten Wedding<br />
                  C/O [Address]<br />
                  [City, State, Postcode]
                </div>
                <p className="text-sm">
                  Gifts can be delivered up to one week after the wedding.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Thank You Message */}
        <GlassCard className="p-8 text-center animate-fade-up">
          <Heart className="w-10 h-10 mx-auto text-glass-pink mb-4" />
          <h2 className="text-xl font-semibold text-wedding-navy mb-3">
            From Our Hearts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you choose to give a gift or simply share in our celebration, 
            we are deeply grateful for your love and support. Thank you for being 
            part of our special day and our journey together.
          </p>
          <div className="mt-4 text-wedding-gold font-script text-lg">
            With love, Tim & Kirsten 💕
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Gifts;