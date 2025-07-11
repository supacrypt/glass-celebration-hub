import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Camera, 
  Gift,
  MapPin,
  MessageCircle,
  Clock,
  Users,
  CheckCircle,
  Heart,
  Phone
} from 'lucide-react';

const GuestDashboard: React.FC = () => {
  React.useEffect(() => {
    console.log('[GUEST DASHBOARD] Single cockpit view rendered successfully');
  }, []);

  // Quick Stats for Guests
  const guestStats = [
    { label: 'Days Until Wedding', value: '142', icon: Clock, color: 'text-yellow-600' },
    { label: 'Your RSVP Status', value: 'Attending', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Your Guests', value: '2', icon: Users, color: 'text-blue-600' },
    { label: 'New Messages', value: '3', icon: MessageCircle, color: 'text-pink-600' }
  ];

  const quickActions = [
    { icon: User, title: 'Update RSVP', subtitle: 'Change attendance or guest details', color: 'text-blue-600' },
    { icon: MapPin, title: 'Venue Details', subtitle: 'Get directions and venue info', color: 'text-green-600' },
    { icon: Gift, title: 'Gift Registry', subtitle: 'View and purchase from registry', color: 'text-purple-600' },
    { icon: Camera, title: 'Share Photos', subtitle: 'Upload and view wedding photos', color: 'text-orange-600' }
  ];

  const schedule = [
    { time: '2:00 PM', event: 'Ceremony', location: 'St. Mary\'s Church', color: 'bg-blue-50 text-blue-600' },
    { time: '4:00 PM', event: 'Cocktail Hour', location: 'Garden Terrace', color: 'bg-green-50 text-green-600' },
    { time: '6:00 PM', event: 'Reception', location: 'Grand Ballroom', color: 'bg-purple-50 text-purple-600' }
  ];

  const messages = [
    { from: 'Sarah & Mike', message: 'So excited to celebrate with you both!', time: '2 hours ago' },
    { from: 'Wedding Coordinator', message: 'Final headcount confirmation needed by Friday', time: '1 day ago' }
  ];

  return (
    <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Welcome to Tim & Kirsten's Wedding
        </h2>
        <p className="text-gray-600 mt-2">Your personal wedding dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {guestStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border border-white/20">
              <CardContent className="p-4 text-center">
                <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <IconComponent className={`w-6 h-6 ${action.color}`} />
                    <div>
                      <div className="font-medium text-gray-800">{action.title}</div>
                      <div className="text-sm text-gray-600">{action.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Your RSVP */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Your RSVP Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="text-green-600 font-semibold">Attending</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Guests</label>
                  <div className="font-semibold">2 people</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dietary Restrictions</label>
                <div className="text-gray-800">Vegetarian</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Plus One</label>
                <div className="text-gray-800">Jane Smith</div>
              </div>
              <Button variant="outline" className="w-full mt-4">Update RSVP</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Event Schedule */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Wedding Day Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.map((item, index) => (
                <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${item.color.split(' ')[0]}`}>
                  <div className={`font-semibold ${item.color.split(' ')[1]}`}>{item.time}</div>
                  <div>
                    <div className="font-medium">{item.event}</div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">
                <MapPin className="w-4 h-4 mr-2" />
                Get Venue Directions
              </Button>
            </CardContent>
          </Card>

          {/* Messages & Updates */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm">{msg.from}</div>
                    <div className="text-xs text-gray-500">{msg.time}</div>
                  </div>
                  <div className="text-sm text-gray-600">{msg.message}</div>
                </div>
              ))}
              <Button className="w-full mt-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Photo Gallery Preview */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm mb-3">Share your favorite moments!</p>
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
