// Real data access implementation with Capacitor native APIs
import { apiRequest } from './queryClient';
import { nativeFeatures } from '@/lib/native-features';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// File System Access API types
interface FileSystemFileHandle {
  name: string;
  kind: 'file';
  getFile(): Promise<File>;
}

interface FileSystemDirectoryHandle {
  name: string;
  kind: 'directory';
  values(): AsyncIterableIterator<FileSystemFileHandle | FileSystemDirectoryHandle>;
}

// Photo analysis interface
interface PhotoMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  dimensions?: { width: number; height: number };
  exif?: any;
  isDuplicate?: boolean;
}

// File analysis interface
interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  path: string;
  isLarge: boolean;
  category: string;
}

// App detection interface
interface AppInfo {
  name: string;
  version?: string;
  lastUsed?: number;
  isInstalled: boolean;
  category: string;
}

// Email integration interface
interface EmailData {
  total: number;
  unread: number;
  important: number;
  spam: number;
  oldEmails: number;
  largeAttachments: number;
}

class DataAccessManager {
  private supportsFileSystemAccess: boolean;
  private emailProvider: 'gmail' | 'outlook' | null = null;

  constructor() {
    this.supportsFileSystemAccess = 'showDirectoryPicker' in window;
  }

  // Check permissions and capabilities
  async checkPermissions(): Promise<{
    files: boolean;
    photos: boolean;
    apps: boolean;
    email: boolean;
    notifications: boolean;
  }> {
    const permissions = {
      files: Capacitor.isNativePlatform() || this.supportsFileSystemAccess,
      photos: Capacitor.isNativePlatform() || this.supportsFileSystemAccess,
      apps: Capacitor.isNativePlatform(), // Available on native platforms
      email: false, // Still requires OAuth integration
      notifications: true // Available through Capacitor
    };

    // Check notification permission using Capacitor
    if (Capacitor.isNativePlatform()) {
      const hasNotificationPermission = await nativeFeatures.requestNotificationPermission();
      permissions.notifications = hasNotificationPermission;
    } else {
      // Web fallback
      const permission = await Notification.requestPermission();
      permissions.notifications = permission === 'granted';
    }

    return permissions;
  }

  // Request file system access
  async requestFileAccess(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.supportsFileSystemAccess) {
      // File System Access API not supported in this browser
      return null;
    }

    try {
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'read',
        startIn: 'documents'
      });
      // Directory access granted
      return dirHandle;
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled directory selection
      } else {
        console.error('File access denied:', error);
      }
      return null;
    }
  }

  // Alternative file scanning using file input
  async scanFilesWithInput(): Promise<FileMetadata[]> {
    const files: FileMetadata[] = [];
    
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '*/*';
      
      return new Promise((resolve) => {
        input.onchange = async (event) => {
          const fileList = (event.target as HTMLInputElement).files;
          if (!fileList) return resolve([]);

          // Analyzing files...
          
          for (const file of Array.from(fileList)) {
            files.push({
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              path: file.name,
              isLarge: file.size > 100 * 1024 * 1024, // 100MB
              category: this.categorizeFile(file.type, file.name)
            });
          }
          
          resolve(files);
        };

        input.oncancel = () => {
          resolve([]); // User cancelled
        };
        
        input.click();
      });
    } catch (error) {
      console.error('File scan failed:', error);
      return [];
    }
  }

  // Scan files in directory
  async scanFiles(dirHandle: FileSystemDirectoryHandle): Promise<FileMetadata[]> {
    const files: FileMetadata[] = [];
    const visited = new Set<string>();

    const scanDirectory = async (dir: FileSystemDirectoryHandle, path: string = '') => {
      for await (const [name, handle] of dir.entries()) {
        const fullPath = path ? `${path}/${name}` : name;
        
        if (visited.has(fullPath)) continue;
        visited.add(fullPath);

        if (handle.kind === 'file') {
          try {
            const file = await handle.getFile();
            files.push({
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              path: fullPath,
              isLarge: file.size > 100 * 1024 * 1024, // 100MB
              category: this.categorizeFile(file.type, file.name)
            });
          } catch (error) {
            console.warn('Could not access file:', fullPath, error);
          }
        } else if (handle.kind === 'directory') {
          await scanDirectory(handle, fullPath);
        }
      }
    };

    await scanDirectory(dirHandle);
    return files;
  }

  // Scan photos with metadata using Capacitor or web APIs
  async scanPhotos(): Promise<PhotoMetadata[]> {
    const photos: PhotoMetadata[] = [];
    
    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor file system to scan photos directory
        try {
          const files = await nativeFeatures.listFiles(Directory.Documents);
          const imageFiles = files.filter(name => 
            name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
          );
          
          for (const filename of imageFiles) {
            try {
              const fileData = await nativeFeatures.readFile(filename);
              const metadata = await this.analyzePhotoFromData(filename, fileData);
              photos.push(metadata);
            } catch (error) {
              console.warn(`Failed to read file ${filename}:`, error);
            }
          }
          
          // Allow user to pick additional photos from gallery
          const pickedPhoto = await nativeFeatures.pickPhoto();
          if (pickedPhoto) {
            const metadata = await this.analyzePhotoFromDataUrl(pickedPhoto);
            photos.push(metadata);
          }
        } catch (error) {
          console.error('Native photo scan failed:', error);
        }
      } else {
        // Web fallback - use file input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        
        return new Promise((resolve) => {
          input.onchange = async (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (!files) return resolve([]);

            for (const file of Array.from(files)) {
              const metadata = await this.analyzePhoto(file);
              photos.push(metadata);
            }
            
            // Find duplicates
            await this.findDuplicatePhotos(photos);
            
            resolve(photos);
          };

          input.oncancel = () => {
            resolve([]); // User cancelled
          };
          
          input.click();
        });
      }
      
      // Find duplicates
      await this.findDuplicatePhotos(photos);
      
      return photos;
    } catch (error) {
      console.error('Photo scan failed:', error);
      return [];
    }
  }

  // Analyze photo metadata
  private async analyzePhoto(file: File): Promise<PhotoMetadata> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dimensions: {
            width: img.width,
            height: img.height
          },
          isDuplicate: false // Would need more complex analysis
        });
      };
      
      img.onerror = () => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          isDuplicate: false
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Detect installed apps (limited in web browsers)
  async detectApps(): Promise<AppInfo[]> {
    const apps: AppInfo[] = [];
    
    // Check for common web apps in user agent
    const userAgent = navigator.userAgent.toLowerCase();
    const commonApps = [
      { name: 'Chrome', pattern: /chrome/, category: 'browser' },
      { name: 'Firefox', pattern: /firefox/, category: 'browser' },
      { name: 'Safari', pattern: /safari/, category: 'browser' },
      { name: 'Edge', pattern: /edge/, category: 'browser' }
    ];

    for (const app of commonApps) {
      if (app.pattern.test(userAgent)) {
        apps.push({
          name: app.name,
          isInstalled: true,
          category: app.category,
          lastUsed: Date.now()
        });
      }
    }

    // Check for PWA capabilities
    if ('serviceWorker' in navigator) {
      apps.push({
        name: 'Service Worker Support',
        isInstalled: true,
        category: 'system',
        lastUsed: Date.now()
      });
    }

    return apps;
  }

  // Gmail API integration
  async connectGmail(): Promise<EmailData> {
    // This would require OAuth2 flow and Gmail API setup
    throw new Error('Gmail integration requires OAuth2 setup');
  }

  // Outlook API integration
  async connectOutlook(): Promise<EmailData> {
    // This would require Microsoft Graph API setup
    throw new Error('Outlook integration requires Microsoft Graph API setup');
  }

  // File categorization
  private categorizeFile(type: string, name: string): string {
    if (type.startsWith('image/')) return 'photo';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf')) return 'document';
    if (type.includes('text') || type.includes('document')) return 'document';
    if (type.includes('zip') || type.includes('archive')) return 'archive';
    if (name.endsWith('.exe') || name.endsWith('.app')) return 'application';
    return 'other';
  }

  // Calculate duplicate photos using perceptual hashing
  async findDuplicatePhotos(photos: PhotoMetadata[]): Promise<PhotoMetadata[]> {
    // Simple implementation - would need more sophisticated algorithm
    const duplicates: PhotoMetadata[] = [];
    const sizeGroups = new Map<number, PhotoMetadata[]>();

    // Group by size first
    photos.forEach(photo => {
      if (!sizeGroups.has(photo.size)) {
        sizeGroups.set(photo.size, []);
      }
      sizeGroups.get(photo.size)!.push(photo);
    });

    // Find potential duplicates in same size groups
    sizeGroups.forEach(group => {
      if (group.length > 1) {
        for (let i = 1; i < group.length; i++) {
          group[i].isDuplicate = true;
          duplicates.push(group[i]);
        }
      }
    });

    return duplicates;
  }

  // Show native notification using Capacitor
  async showNotification(title: string, body: string, icon?: string): Promise<void> {
    await nativeFeatures.showNotification(title, { body });
  }

  // Helper method to analyze photo from data URL (for native platforms)
  private async analyzePhotoFromDataUrl(dataUrl: string): Promise<PhotoMetadata> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          name: `photo_${Date.now()}.jpg`,
          size: Math.round(dataUrl.length * 0.75), // Estimate size from base64
          type: 'image/jpeg',
          lastModified: Date.now(),
          dimensions: { width: img.width, height: img.height },
          isDuplicate: false
        });
      };
      img.onerror = () => {
        resolve({
          name: `photo_${Date.now()}.jpg`,
          size: 0,
          type: 'image/jpeg',
          lastModified: Date.now(),
          isDuplicate: false
        });
      };
      img.src = dataUrl;
    });
  }

  // Helper method to analyze photo from file data (for native platforms)
  private async analyzePhotoFromData(filename: string, fileData: string): Promise<PhotoMetadata> {
    return {
      name: filename,
      size: fileData.length,
      type: 'image/jpeg',
      lastModified: Date.now(),
      isDuplicate: false
    };
  }
}

export const dataAccessManager = new DataAccessManager();
export type { FileMetadata, PhotoMetadata, AppInfo, EmailData };