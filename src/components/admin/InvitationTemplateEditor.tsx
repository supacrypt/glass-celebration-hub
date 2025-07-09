import React, { useState } from 'react';
import { Palette, Type, Download, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvitationTemplateEditorProps {
  onSendInvitation?: (template: InvitationTemplate) => void;
  guestName?: string;
}

interface InvitationTemplate {
  background: string;
  font: string;
  customMessage: string;
  venue: string;
  date: string;
  time: string;
  address: string;
}

const InvitationTemplateEditor: React.FC<InvitationTemplateEditorProps> = ({
  onSendInvitation,
  guestName = "John & Jane Smith"
}) => {
  const [template, setTemplate] = useState<InvitationTemplate>({
    background: 'elegant-cream',
    font: 'playfair',
    customMessage: 'You are cordially invited to celebrate the wedding of Tim & Kirsten!',
    venue: 'Ben Ean Winery',
    date: 'October 5, 2025',
    time: 'Arrive 2:30 PM for 3:00 PM start',
    address: '119 McDonalds Rd, Pokolbin NSW'
  });

  const [isPreview, setIsPreview] = useState(false);

  const backgroundOptions = [
    { value: 'elegant-cream', label: 'Elegant Cream', gradient: 'from-amber-50 to-orange-100' },
    { value: 'romantic-pink', label: 'Romantic Pink', gradient: 'from-pink-50 to-rose-100' },
    { value: 'classic-white', label: 'Classic White', gradient: 'from-white to-gray-50' },
    { value: 'vintage-gold', label: 'Vintage Gold', gradient: 'from-yellow-50 to-amber-100' },
    { value: 'botanical-green', label: 'Botanical Green', gradient: 'from-green-50 to-emerald-100' }
  ];

  const fontOptions = [
    { value: 'playfair', label: 'Playfair Display', className: 'font-serif' },
    { value: 'inter', label: 'Inter', className: 'font-sans' },
    { value: 'dancing', label: 'Dancing Script', className: 'font-cursive' },
    { value: 'cinzel', label: 'Cinzel', className: 'font-serif' }
  ];

  const getBackgroundClass = (bg: string) => {
    const option = backgroundOptions.find(opt => opt.value === bg);
    return option?.gradient || 'from-white to-gray-50';
  };

  const getFontClass = (font: string) => {
    const option = fontOptions.find(opt => opt.value === font);
    return option?.className || 'font-serif';
  };

  const generatePDF = () => {
    // This would integrate with a PDF generation service
    console.log('Generating PDF invitation...');
  };

  const sendInvitation = () => {
    if (onSendInvitation) {
      onSendInvitation(template);
    }
  };

  if (isPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => setIsPreview(false)} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <div className="flex gap-2">
            <Button onClick={generatePDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={sendInvitation} size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </div>

        {/* Invitation Preview */}
        <Card className={`max-w-lg mx-auto bg-gradient-to-br ${getBackgroundClass(template.background)} border-2 border-wedding-navy/20`}>
          <CardContent className={`p-8 text-center ${getFontClass(template.font)}`}>
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Wedding Invitation
              </div>
              
              <div className="text-2xl font-bold text-wedding-navy">
                Tim & Kirsten
              </div>
              
              <div className="text-lg text-muted-foreground">
                {template.customMessage}
              </div>
              
              <div className="space-y-2 text-muted-foreground">
                <div className="font-semibold">{guestName}</div>
                <div className="text-sm">
                  Join us at <strong>{template.venue}</strong>
                </div>
                <div className="text-sm">
                  {template.address}
                </div>
                <div className="text-sm">
                  <strong>{template.date}</strong>
                </div>
                <div className="text-sm">
                  {template.time}
                </div>
              </div>
              
              <div className="pt-4 border-t border-muted-foreground/20">
                <div className="text-xs text-muted-foreground">
                  RSVP via our wedding app
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-wedding-navy">Invitation Template Editor</h3>
          <p className="text-sm text-muted-foreground">Customize your wedding invitations</p>
        </div>
        <Button onClick={() => setIsPreview(true)} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Design Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="w-4 h-4" />
              Design Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Background Theme</Label>
              <Select 
                value={template.background} 
                onValueChange={(value) => setTemplate({ ...template, background: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Font Family</Label>
              <Select 
                value={template.font} 
                onValueChange={(value) => setTemplate({ ...template, font: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Type className="w-4 h-4" />
              Content Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Custom Message</Label>
              <Textarea
                value={template.customMessage}
                onChange={(e) => setTemplate({ ...template, customMessage: e.target.value })}
                className="min-h-20"
                placeholder="Enter your invitation message..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Venue</Label>
                <Select 
                  value={template.venue} 
                  onValueChange={(value) => setTemplate({ ...template, venue: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ben Ean Winery">Ben Ean Winery</SelectItem>
                    <SelectItem value="Newcastle Beach">Newcastle Beach</SelectItem>
                    <SelectItem value="Prince of Mereweather">Prince of Mereweather</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Date</Label>
                <Select 
                  value={template.date} 
                  onValueChange={(value) => setTemplate({ ...template, date: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="October 5, 2025">October 5, 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg bg-gradient-to-br ${getBackgroundClass(template.background)} border text-center ${getFontClass(template.font)} max-w-xs mx-auto`}>
            <div className="text-sm font-bold text-wedding-navy mb-2">Tim & Kirsten</div>
            <div className="text-xs text-muted-foreground mb-2">{template.customMessage}</div>
            <div className="text-xs text-muted-foreground">
              <div><strong>{guestName}</strong></div>
              <div>{template.venue}</div>
              <div>{template.date}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationTemplateEditor;