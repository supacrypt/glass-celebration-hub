import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useBackgrounds } from '@/hooks/useBackgrounds';
import { Upload, Trash2, Check } from 'lucide-react';

const BackgroundManager: React.FC = () => {
  const { 
    backgrounds, 
    activeBackground, 
    loading, 
    uploading, 
    updateActiveBackground, 
    uploadBackground, 
    deleteBackground 
  } = useBackgrounds();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    await uploadBackground(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Background Image
          </CardTitle>
          <CardDescription>
            Upload a new background image for the application. Supported formats: JPEG, PNG, WebP (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="glass-button w-fit"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Background Gallery */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Background Gallery</CardTitle>
          <CardDescription>
            Manage your background images. Click on an image to set it as active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backgrounds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No background images uploaded yet. Upload your first background image above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backgrounds.map((background) => (
                <div
                  key={background.name}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    activeBackground === background.name
                      ? 'border-wedding-navy ring-2 ring-wedding-navy/20'
                      : 'border-border hover:border-wedding-navy/50'
                  }`}
                  onClick={() => updateActiveBackground(background.name)}
                >
                  {/* Background Preview */}
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={background.publicUrl}
                      alt={`Background ${background.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Active Badge */}
                    {activeBackground === background.name && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-wedding-navy text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateActiveBackground(background.name);
                          }}
                          disabled={activeBackground === background.name}
                        >
                          {activeBackground === background.name ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : (
                            'Set Active'
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Background</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this background image? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBackground(background.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>

                  {/* Background Info */}
                  <div className="p-3 bg-background/80 backdrop-blur-sm">
                    <h4 className="font-medium text-sm truncate">{background.name}</h4>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(background.size)}</span>
                      <span>{formatDate(background.lastModified)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Active Background Info */}
      {activeBackground && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Current Active Background</CardTitle>
            <CardDescription>
              This background is currently being displayed across the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-20 h-12 rounded-lg overflow-hidden border">
                <img
                  src={backgrounds.find(bg => bg.name === activeBackground)?.publicUrl}
                  alt="Active background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{activeBackground}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(backgrounds.find(bg => bg.name === activeBackground)?.size)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BackgroundManager;