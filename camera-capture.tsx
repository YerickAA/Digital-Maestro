import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, RotateCcw, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { nativeFeatures } from '@/lib/native-features';

// Capacitor imports
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      
      // If running on native platform, use Capacitor Camera
      if (Capacitor.isNativePlatform()) {
        // Native camera will be handled by capture functions
        setIsLoading(false);
        return;
      }
      
      // Web fallback - use getUserMedia
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please grant camera permission to take photos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = async () => {
    try {
      // If running on native platform, use Capacitor Camera
      if (Capacitor.isNativePlatform()) {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          saveToGallery: true
        });

        if (image.dataUrl) {
          setCapturedImage(image.dataUrl);
          await nativeFeatures.vibrate('medium');
          toast({
            title: "Photo Captured",
            description: "Photo captured successfully"
          });
        }
        return;
      }

      // Web fallback - use canvas capture
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0);

      // Convert to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { 
            type: 'image/jpeg' 
          });
          
          // Show captured image
          setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
          
          // Vibrate on capture
          await nativeFeatures.vibrate('medium');
          
          // Stop camera
          stopCamera();
          
          toast({
            title: "Photo Captured",
            description: "Photo captured successfully"
          });
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Camera Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectFromGallery = async () => {
    try {
      // If running on native platform, use Capacitor Camera
      if (Capacitor.isNativePlatform()) {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos
        });

        if (image.dataUrl) {
          setCapturedImage(image.dataUrl);
          await nativeFeatures.vibrate('light');
          toast({
            title: "Photo Selected",
            description: "Photo selected from gallery"
          });
        }
        return;
      }

      // Web fallback - file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setCapturedImage(e.target?.result as string);
            toast({
              title: "Photo Selected",
              description: "Photo selected from gallery"
            });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } catch (error) {
      console.error('Error selecting photo:', error);
      toast({
        title: "Gallery Error",
        description: "Failed to select photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const confirmCapture = () => {
    if (!capturedImage) return;
    
    // Convert data URL to blob and create file
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        onCapture(file);
        onClose();
      })
      .catch(error => {
        console.error('Error processing image:', error);
        toast({
          title: "Error",
          description: "Failed to process captured image",
          variant: "destructive"
        });
      });
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `photo-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium">Camera</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Camera View */}
        {!capturedImage ? (
          <div className="relative w-full h-full">
            {/* Show camera preview only on web */}
            {!Capacitor.isNativePlatform() && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Native platform background */}
            {Capacitor.isNativePlatform() && (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-24 h-24 mx-auto mb-4 opacity-60" />
                  <h2 className="text-2xl font-bold mb-2">CleanSpace Camera</h2>
                  <p className="text-blue-200">Capture or select photos to organize</p>
                </div>
              </div>
            )}
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            )}

            {/* Capture and Gallery buttons */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-6">
                {/* Gallery button */}
                <Button
                  onClick={selectFromGallery}
                  disabled={isLoading}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Gallery
                </Button>
                
                {/* Capture button */}
                <Button
                  onClick={capturePhoto}
                  disabled={isLoading || (!stream && !Capacitor.isNativePlatform())}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black border-4 border-gray-300"
                >
                  <Camera className="w-8 h-8" />
                </Button>
                
                {/* Placeholder for symmetry */}
                <div className="w-20"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview captured image */
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            
            {/* Action buttons */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button
                onClick={retakePhoto}
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-20 text-white border-white hover:bg-white hover:bg-opacity-30"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={downloadPhoto}
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-20 text-white border-white hover:bg-white hover:bg-opacity-30"
              >
                <Download className="w-5 h-5 mr-2" />
                Save
              </Button>
              
              <Button
                onClick={confirmCapture}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use Photo
              </Button>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
}