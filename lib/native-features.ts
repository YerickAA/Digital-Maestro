// Native features using Capacitor APIs
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

export interface DeviceInfo {
  platform: string;
  model: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  memUsed: number;
  diskFree: number;
  diskTotal: number;
  realDiskFree: number;
  realDiskTotal: number;
  webViewVersion: string;
}

export class NativeFeatures {
  private static instance: NativeFeatures;
  
  public static getInstance(): NativeFeatures {
    if (!NativeFeatures.instance) {
      NativeFeatures.instance = new NativeFeatures();
    }
    return NativeFeatures.instance;
  }

  // Get device information using Capacitor Device API
  async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      const info = await Device.getInfo();
      return {
        platform: info.platform,
        model: info.model,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        memUsed: info.memUsed || 0,
        diskFree: info.diskFree || 0,
        diskTotal: info.diskTotal || 0,
        realDiskFree: info.realDiskFree || 0,
        realDiskTotal: info.realDiskTotal || 0,
        webViewVersion: info.webViewVersion
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      // Fallback to basic info
      return {
        platform: 'web',
        model: 'unknown',
        operatingSystem: 'web',
        osVersion: 'unknown',
        manufacturer: 'unknown',
        isVirtual: false,
        memUsed: 0,
        diskFree: 0,
        diskTotal: 0,
        realDiskFree: 0,
        realDiskTotal: 0,
        webViewVersion: 'unknown'
      };
    }
  }

  // Request notification permission using Capacitor
  async requestNotificationPermission(): Promise<boolean> {
    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Show local notification using Capacitor
  async showNotification(title: string, options: {
    body?: string;
    id?: number;
    schedule?: Date;
    sound?: string;
    attachments?: any[];
    actionTypeId?: string;
    extra?: any;
  } = {}): Promise<void> {
    try {
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        console.warn('Notification permission not granted');
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body: options.body || '',
            id: options.id || Date.now(),
            schedule: options.schedule ? { at: options.schedule } : undefined,
            sound: options.sound || undefined,
            attachments: options.attachments || undefined,
            actionTypeId: options.actionTypeId || undefined,
            extra: options.extra || undefined,
          }
        ]
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Vibrate device using Capacitor Haptics
  async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light : 
                         style === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Medium;
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  // Share content using Capacitor Share API
  async share(data: {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
    files?: string[];
  }): Promise<void> {
    try {
      await Share.share({
        title: data.title || '',
        text: data.text || '',
        url: data.url || '',
        dialogTitle: data.dialogTitle || 'Share',
        files: data.files || undefined
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  }

  // Add to home screen (for iOS)
  showIOSInstallPrompt(): void {
    const deviceInfo = this.getDeviceInfo();
    
    if (deviceInfo.isIOS && !deviceInfo.isStandalone) {
      this.showNotification('Install CleanSpace', {
        body: 'Tap the Share button, then "Add to Home Screen"',
        requireInteraction: true
      });
    }
  }

  // Request persistent storage
  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const granted = await navigator.storage.persist();
        return granted;
      } catch (error) {
        console.error('Persistent storage request failed:', error);
        return false;
      }
    }
    return false;
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Storage estimate failed:', error);
        return null;
      }
    }
    return null;
  }

  // Take photo using Capacitor Camera API
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Camera access failed:', error);
      return null;
    }
  }

  // Pick photo from gallery
  async pickPhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Photo picker failed:', error);
      return null;
    }
  }

  // File system operations using Capacitor
  async writeFile(filename: string, data: string, directory = Directory.Documents): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: directory,
        encoding: Encoding.UTF8
      });
    } catch (error) {
      console.error('Failed to write file:', error);
      throw error;
    }
  }

  async readFile(filename: string, directory = Directory.Documents): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path: filename,
        directory: directory,
        encoding: Encoding.UTF8
      });
      return result.data as string;
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async deleteFile(filename: string, directory = Directory.Documents): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: filename,
        directory: directory
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  async listFiles(directory = Directory.Documents): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: directory
      });
      return result.files.map(f => f.name);
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  // Preferences storage using Capacitor
  async setPreference(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({
        key: key,
        value: value
      });
    } catch (error) {
      console.error('Failed to set preference:', error);
    }
  }

  async getPreference(key: string): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: key });
      return result.value;
    } catch (error) {
      console.error('Failed to get preference:', error);
      return null;
    }
  }

  async removePreference(key: string): Promise<void> {
    try {
      await Preferences.remove({ key: key });
    } catch (error) {
      console.error('Failed to remove preference:', error);
    }
  }

  // App state management
  async addAppStateListener(callback: (state: any) => void): Promise<void> {
    try {
      App.addListener('appStateChange', callback);
    } catch (error) {
      console.error('Failed to add app state listener:', error);
    }
  }

  async getAppInfo(): Promise<any> {
    try {
      return await App.getInfo();
    } catch (error) {
      console.error('Failed to get app info:', error);
      return null;
    }
  }
}

export const nativeFeatures = NativeFeatures.getInstance();