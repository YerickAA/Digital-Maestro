// Offline storage and sync functionality

interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  collection: string;
  data: any;
  timestamp: number;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingActions: number;
  issyncing: boolean;
}

export class OfflineStorage {
  private static instance: OfflineStorage;
  private db: IDBDatabase | null = null;
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private onlineListeners: ((isOnline: boolean) => void)[] = [];

  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  constructor() {
    this.init();
    this.setupOnlineListeners();
  }

  private async init() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('CleanSpaceDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.syncPendingActions();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('digitalData')) {
          db.createObjectStore('digitalData', { keyPath: 'userId' });
        }
        
        if (!db.objectStoreNames.contains('streaks')) {
          db.createObjectStore('streaks', { keyPath: 'userId' });
        }
        
        if (!db.objectStoreNames.contains('offlineActions')) {
          db.createObjectStore('offlineActions', { keyPath: 'id' });
        }
      };
    });
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.notifyOnlineListeners(true);
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      this.notifyOnlineListeners(false);
    });
  }

  private notifyOnlineListeners(isOnline: boolean) {
    this.onlineListeners.forEach(listener => listener(isOnline));
  }

  private notifySyncListeners(status: SyncStatus) {
    this.syncListeners.forEach(listener => listener(status));
  }

  public onOnlineStatusChange(listener: (isOnline: boolean) => void) {
    this.onlineListeners.push(listener);
    // Call immediately with current status
    listener(navigator.onLine);
  }

  public onSyncStatusChange(listener: (status: SyncStatus) => void) {
    this.syncListeners.push(listener);
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  // Store data locally
  public async store(collection: string, data: any): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([collection], 'readwrite');
      const store = transaction.objectStore(collection);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Retrieve data locally
  public async retrieve(collection: string, key: any): Promise<any> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([collection], 'readonly');
      const store = transaction.objectStore(collection);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Add offline action
  public async addOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) return;

    const fullAction: OfflineAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      const request = store.add(fullAction);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve();
        // Try to sync if online
        if (this.isOnline()) {
          this.syncPendingActions();
        }
      };
    });
  }

  // Get pending actions
  public async getPendingActions(): Promise<OfflineAction[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Clear completed actions
  public async clearAction(actionId: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      const request = store.delete(actionId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Sync pending actions with server
  public async syncPendingActions(): Promise<void> {
    if (!this.isOnline()) return;

    const pendingActions = await this.getPendingActions();
    if (pendingActions.length === 0) return;

    this.notifySyncListeners({
      isOnline: true,
      lastSync: Date.now(),
      pendingActions: pendingActions.length,
      issyncing: true
    });

    for (const action of pendingActions) {
      try {
        await this.syncAction(action);
        await this.clearAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }

    this.notifySyncListeners({
      isOnline: true,
      lastSync: Date.now(),
      pendingActions: 0,
      issyncing: false
    });
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    const { type, collection, data } = action;
    
    let method: string;
    let endpoint: string;
    
    switch (type) {
      case 'CREATE':
        method = 'POST';
        endpoint = `/api/${collection}`;
        break;
      case 'UPDATE':
        method = 'PATCH';
        endpoint = `/api/${collection}/${data.id}`;
        break;
      case 'DELETE':
        method = 'DELETE';
        endpoint = `/api/${collection}/${data.id}`;
        break;
      default:
        throw new Error(`Unknown action type: ${type}`);
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Save user data for offline use
  public async saveUserData(userId: number, userData: any): Promise<void> {
    await this.store('users', { id: userId, ...userData });
  }

  // Save digital data for offline use
  public async saveDigitalData(userId: number, digitalData: any): Promise<void> {
    await this.store('digitalData', { userId, ...digitalData });
  }

  // Save streak data for offline use
  public async saveStreakData(userId: number, streakData: any): Promise<void> {
    await this.store('streaks', { userId, ...streakData });
  }

  // Get cached user data
  public async getCachedUserData(userId: number): Promise<any> {
    return await this.retrieve('users', userId);
  }

  // Get cached digital data
  public async getCachedDigitalData(userId: number): Promise<any> {
    return await this.retrieve('digitalData', userId);
  }

  // Get cached streak data
  public async getCachedStreakData(userId: number): Promise<any> {
    return await this.retrieve('streaks', userId);
  }

  // Request persistent storage
  public async requestPersistentStorage(): Promise<boolean> {
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
}

export const offlineStorage = OfflineStorage.getInstance();