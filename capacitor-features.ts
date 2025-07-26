// Capacitor native features integration
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface DeviceInfo {
  platform: string;
  userAgent?: string;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isNative: boolean;
  supportsInstall: boolean;
  supportsNotifications: boolean;
  supportsVibration: boolean;
  supportsShare: boolean;
  supportsFileSystem: boolean;
  supportsCamera: boolean;
  battery?: {
    level: number;
    charging: boolean;
  };
}

export class CapacitorFeatures {
  private static instance: CapacitorFeatures;
  
  public static getInstance(): CapacitorFeatures {
    if (!CapacitorFeatures.instance) {
      CapacitorFeatures.instance = new CapacitorFeatures();
    }
    return CapacitorFeatures.instance;
  }

  // Get comprehensive device information
  async getDeviceInfo(): Promise<DeviceInfo> {
    const isNative = Capacitor.isNativePlatform();
    let deviceInfo: any = {};
    let battery: any = null;
    
    if (isNative) {
      try {
        deviceInfo = await Device.getInfo();
        battery = await Device.getBatteryInfo();
      } catch (error) {
        console.error('Failed to get device info:', error);
      }
    }

    const userAgent = navigator.userAgent;
    const isStandalone = isNative || window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = isNative ? deviceInfo.platform === 'ios' : /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = isNative ? deviceInfo.platform === 'android' : /Android/.test(userAgent);

    return {
      platform: isNative ? deviceInfo.platform : navigator.platform,
      userAgent: isNative ? deviceInfo.model : userAgent,
      isStandalone,
      isIOS,
      isAndroid,
      isNative,
      supportsInstall: !isNative && 'serviceWorker' in navigator && 'beforeinstallprompt' in window,
      supportsNotifications: true,
      supportsVibration: true,
      supportsShare: true,
      supportsFileSystem: true,
      supportsCamera: true,
      battery
    };
  }

  // Enhanced haptic feedback
  async hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const style = type === 'light' ? ImpactStyle.Light : 
                     type === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Medium;
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptics failed:', error);
      }
    } else {
      // Web fallback
      const duration = type === 'light' ? 50 : type === 'heavy' ? 200 : 100;
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    }
  }

  // Native notifications
  async showNotification(title: string, options: {
    body?: string;
    icon?: string;
    id?: number;
    sound?: string;
    at?: Date;
  } = {}): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        // Request permission first
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') {
          return false;
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body: options.body || '',
              id: options.id || Date.now(),
              schedule: options.at ? { at: options.at } : { at: new Date(Date.now() + 1000) },
              sound: options.sound || 'default',
              attachments: options.icon ? [{ id: 'icon', url: options.icon }] : undefined,
            },
          ],
        });
        return true;
      } catch (error) {
        console.error('Native notification failed:', error);
        return false;
      }
    } else {
      // Web fallback
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, {
            body: options.body,
            icon: options.icon || '/icon-192.svg',
          });
          return true;
        }
      }
      return false;
    }
  }

  // Enhanced share functionality
  async share(data: { 
    title?: string; 
    text?: string; 
    url?: string; 
    files?: string[];
  }): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share(data);
        return true;
      } catch (error) {
        console.error('Native share failed:', error);
        return false;
      }
    } else if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Web share failed:', error);
        return false;
      }
    }
    return false;
  }

  // App state management
  async getAppState(): Promise<any> {
    if (Capacitor.isNativePlatform()) {
      try {
        return await App.getState();
      } catch (error) {
        console.error('App state failed:', error);
        return null;
      }
    }
    return { isActive: document.visibilityState === 'visible' };
  }

  // Status bar control
  async setStatusBar(style: 'light' | 'dark', backgroundColor?: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: style === 'light' ? 'LIGHT' : 'DARK' });
        if (backgroundColor) {
          await StatusBar.setBackgroundColor({ color: backgroundColor });
        }
      } catch (error) {
        console.error('Status bar failed:', error);
      }
    }
  }

  // Splash screen control
  async hideSplashScreen(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.error('Splash screen failed:', error);
      }
    }
  }

  // Preferences (secure storage)
  async setPreference(key: string, value: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.set({ key, value });
      } catch (error) {
        console.error('Preferences set failed:', error);
      }
    } else {
      localStorage.setItem(key, value);
    }
  }

  async getPreference(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Preferences.get({ key });
        return result.value;
      } catch (error) {
        console.error('Preferences get failed:', error);
        return null;
      }
    } else {
      return localStorage.getItem(key);
    }
  }

  // File system operations
  async writeFile(path: string, data: string): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path,
          data,
          directory: Directory.Documents,
        });
        return true;
      } catch (error) {
        console.error('File write failed:', error);
        return false;
      }
    }
    return false;
  }

  async readFile(path: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.readFile({
          path,
          directory: Directory.Documents,
        });
        return result.data as string;
      } catch (error) {
        console.error('File read failed:', error);
        return null;
      }
    }
    return null;
  }

  // Check if native platform
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Initialize app
  async initialize(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        // Hide splash screen after initialization
        await this.hideSplashScreen();
        
        // Set default status bar style
        await this.setStatusBar('light', '#007AFF');
        
        // Request notification permissions
        await LocalNotifications.requestPermissions();
        
        console.log('Native app initialized successfully');
      } catch (error) {
        console.error('Native app initialization failed:', error);
      }
    }
  }
}

// Export singleton instance
export const capacitorFeatures = CapacitorFeatures.getInstance();