import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getUrlWithFallback } from '@/utils/supabaseStorage';
import Countdown from './Countdown';
import RSVPCallToAction from './RSVPCallToAction';

interface HeroBackgroundProps {
  backgroundType: string;
  backgroundUrl: string;
  mobileBackgroundUrl: string;
  videoAutoplay: boolean;
  videoMuted: boolean;
  videoLoop: boolean;
  overlayOpacity: number;
  children: React.ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({
  backgroundType,
  backgroundUrl,
  mobileBackgroundUrl,
  videoAutoplay,
  videoMuted,
  videoLoop,
  overlayOpacity,
  children
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useImageFallback, setUseImageFallback] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use single responsive video URL for all devices
  const currentBackgroundUrl = backgroundUrl;

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    }
    return url;
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement;
    let errorMessage = 'Unknown video error';
    
    if (video && video.error) {
      switch (video.error.code) {
        case video.error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video load aborted by user';
          break;
        case video.error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case video.error.MEDIA_ERR_DECODE:
          errorMessage = 'Video decode error (unsupported format)';
          break;
        case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video source not supported';
          break;
        default:
          errorMessage = `Video error code: ${video.error.code}`;
      }
    }
    
    console.error('Video failed to load:', errorMessage);
    console.error('Video URL was:', currentBackgroundUrl);
    console.error('Video error object:', video?.error);
    console.error('Is mobile device:', isMobile);
    console.error('Video element state:', {
      readyState: video?.readyState,
      networkState: video?.networkState,
      currentSrc: video?.currentSrc,
      duration: video?.duration
    });
    
    setVideoError(true);
    setUseImageFallback(true);
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
  };

  // Enhanced mobile video timeout and fallback logic
  useEffect(() => {
    if (backgroundType === 'video') {
      // Longer timeout for mobile devices (slower networks)
      const timeoutDuration = isMobile ? 8000 : 5000;
      
      const timeout = setTimeout(() => {
        if (!videoLoaded && !videoError) {
          console.log(`Video load timeout after ${timeoutDuration}ms - falling back to image`);
          setUseImageFallback(true);
        }
      }, timeoutDuration);
      
      // Try to trigger video play on mobile after a short delay
      if (isMobile && videoAutoplay) {
        const mobilePlayTimeout = setTimeout(() => {
          const video = document.querySelector('video');
          if (video && video.paused) {
            console.log('Attempting to trigger mobile video play');
            video.play().catch(err => {
              console.log('Mobile autoplay failed, this is expected:', err);
            });
          }
        }, 1000);
        
        return () => {
          clearTimeout(timeout);
          clearTimeout(mobilePlayTimeout);
        };
      }
      
      return () => clearTimeout(timeout);
    }
  }, [backgroundType, videoLoaded, videoError, isMobile, videoAutoplay]);

  // Debug logging
  console.log('HeroBackground Debug:', {
    backgroundType,
    backgroundUrl: currentBackgroundUrl,
    videoError,
    isMobile,
    useImageFallback,
    videoLoaded,
    videoAutoplay,
    videoMuted,
    videoLoop
  });

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] mb-6 sm:mb-8 lg:mb-10 rounded-[20px] overflow-hidden">
      {/* Background Media */}
      {backgroundType === 'video' && !videoError && !useImageFallback ? (
        <div className="absolute inset-0 w-full h-full" data-testid="hero-background-video">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={videoAutoplay}
            muted={videoMuted}
            loop={videoLoop}
            playsInline
            controls={false}
            preload="metadata"
            webkit-playsinline="true"
            crossOrigin="anonymous"
            onError={handleVideoError}
            onLoadedData={handleVideoLoaded}
            onCanPlay={handleVideoLoaded}
            onLoadStart={() => console.log('Video loading started')}
            onWaiting={() => console.log('Video waiting for data')}
            onCanPlayThrough={() => {
              console.log('Video can play through');
              setVideoLoaded(true);
            }}
            onTimeUpdate={() => {
              // Verify video is actually playing
              const video = document.querySelector('video');
              if (video && !video.paused && video.currentTime > 0) {
                setVideoLoaded(true);
              }
            }}
            onStalled={() => console.log('Video stalled')}
            onSuspend={() => console.log('Video suspended')}
            onAbort={() => console.log('Video aborted')}
            onEmptied={() => console.log('Video emptied')}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          >
            <source src={currentBackgroundUrl} type="video/mp4" />
            {/* Fallback source without CORS for cross-origin issues */}
            <source src={currentBackgroundUrl.replace('?', '').split('?')[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Enhanced loading indicator with debug info */}
          {!videoLoaded && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video...</p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 text-xs text-gray-500 max-w-xs mx-auto">
                    <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
                    <p>URL: {currentBackgroundUrl.substring(0, 50)}...</p>
                    <p>Autoplay: {videoAutoplay ? 'Yes' : 'No'}</p>
                    <p>Muted: {videoMuted ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : backgroundType === 'youtube' && !useImageFallback ? (
        <iframe
          src={getYouTubeEmbedUrl(currentBackgroundUrl)}
          className="absolute top-0 left-0 w-full h-full object-cover"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="background-video"
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getUrlWithFallback(
              mobileBackgroundUrl || currentBackgroundUrl,
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
            )})`,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        style={{
          opacity: overlayOpacity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
};

const EnhancedHeroSection: React.FC = () => {
  const { settings, loading } = useAppSettings();

  if (loading) {
    return (
      <div className="h-[500px] sm:h-[600px] lg:h-[700px] mb-6 sm:mb-8 lg:mb-10 rounded-[20px] overflow-hidden bg-muted animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-muted-foreground/20 rounded-full mx-auto"></div>
            <div className="h-8 w-48 bg-muted-foreground/20 rounded mx-auto"></div>
            <div className="h-6 w-32 bg-muted-foreground/20 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const weddingDate = new Date(settings.wedding_date);
  const formattedDate = weddingDate.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const backgroundType = settings.hero_background_type || 'video';
  const backgroundUrl = settings.hero_background_url || 'https://www.youtube.com/watch?v=Y8rjSEU349s';
  const mobileBackgroundUrl = settings.hero_background_mobile_url || '';
  const overlayOpacity = parseFloat(settings.hero_overlay_opacity || '0.7');
  const overlayPosition = settings.hero_overlay_position || 'center';
  const videoAutoplay = settings.hero_video_autoplay === 'true';
  const videoMuted = settings.hero_video_muted === 'true';
  const videoLoop = settings.hero_video_loop === 'true';

  const getPositionClasses = () => {
    switch (overlayPosition) {
      case 'top':
        return 'items-start justify-center pt-16';
      case 'bottom':
        return 'items-end justify-center pb-16';
      case 'left':
        return 'items-center justify-start pl-16';
      case 'right':
        return 'items-center justify-end pr-16';
      case 'top-left':
        return 'items-start justify-start pt-16 pl-16';
      case 'top-right':
        return 'items-start justify-end pt-16 pr-16';
      case 'bottom-left':
        return 'items-end justify-start pb-16 pl-16';
      case 'bottom-right':
        return 'items-end justify-end pb-16 pr-16';
      default:
        return 'items-center justify-center';
    }
  };

  return (
    <div className="relative w-full hero-section" data-testid="enhanced-hero-section">
      {/* Welcome Message with Glass Effect - Moved above video */}
      <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-up">
        <div 
          className="glass-card p-8 sm:p-10 lg:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '20px',
            boxShadow: '20px 20px 40px rgba(163, 155, 146, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-dolly font-bold mb-2 tracking-tight"
            style={{
              color: '#000000',
              textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(255, 255, 255, 1)',
              lineHeight: '1.4',
              fontWeight: '800'
            }}
          >
            {settings.app_name}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-glass-blue mb-4 font-dolly font-medium">
            ARE GETTING MARRIED!
          </p>
          <Countdown targetDate={settings.wedding_date || ''} />
          <p className="text-base sm:text-lg lg:text-xl text-glass-blue mt-4 font-dolly font-medium">
            {formattedDate}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground mt-6 italic max-w-2xl mx-auto">
            "Yes, we are that couple stuffing up your long weekend plans! Why spend it somewhere relaxing when you can watch two people who have been together for well over a decade tell you that they still love each other..."
          </p>
          
          {/* RSVP Call to Action */}
          <RSVPCallToAction />
        </div>
      </div>

      {/* Hero Background Video/Image */}
      <HeroBackground
        backgroundType={backgroundType}
        backgroundUrl={backgroundUrl}
        mobileBackgroundUrl={mobileBackgroundUrl}
        videoAutoplay={videoAutoplay}
        videoMuted={videoMuted}
        videoLoop={videoLoop}
        overlayOpacity={overlayOpacity}
      >
        {/* Empty - no content overlay on video */}
      </HeroBackground>
    </div>
  );
};

export default EnhancedHeroSection;