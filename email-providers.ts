// Email provider integrations for real data access
import { apiRequest } from './queryClient';

export interface EmailData {
  total: number;
  unread: number;
  important: number;
  spam: number;
  oldEmails: number;
  largeAttachments: number;
  provider: 'gmail' | 'outlook' | 'imap';
  lastSynced: number;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'imap';
  accessToken?: string;
  refreshToken?: string;
  isConnected: boolean;
}

class EmailIntegrationManager {
  private accounts: EmailAccount[] = [];

  // Gmail OAuth2 integration
  async connectGmail(): Promise<EmailAccount> {
    try {
      // Initialize Google OAuth2 flow
      const authUrl = await this.getGmailAuthUrl();
      
      // Open OAuth popup
      const popup = window.open(authUrl, 'gmail-auth', 'width=500,height=600');
      
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            reject(new Error('Gmail authentication cancelled'));
          }
        }, 1000);

        // Listen for auth completion
        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'gmail-auth-success') {
            clearInterval(checkClosed);
            popup?.close();
            
            const account: EmailAccount = {
              id: event.data.email,
              email: event.data.email,
              provider: 'gmail',
              accessToken: event.data.accessToken,
              refreshToken: event.data.refreshToken,
              isConnected: true
            };
            
            this.accounts.push(account);
            resolve(account);
          }
        });
      });
    } catch (error) {
      throw new Error(`Gmail connection failed: ${error}`);
    }
  }

  // Outlook/Microsoft Graph integration
  async connectOutlook(): Promise<EmailAccount> {
    try {
      // Initialize Microsoft Graph OAuth2 flow
      const authUrl = await this.getOutlookAuthUrl();
      
      // Open OAuth popup
      const popup = window.open(authUrl, 'outlook-auth', 'width=500,height=600');
      
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            reject(new Error('Outlook authentication cancelled'));
          }
        }, 1000);

        // Listen for auth completion
        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'outlook-auth-success') {
            clearInterval(checkClosed);
            popup?.close();
            
            const account: EmailAccount = {
              id: event.data.email,
              email: event.data.email,
              provider: 'outlook',
              accessToken: event.data.accessToken,
              refreshToken: event.data.refreshToken,
              isConnected: true
            };
            
            this.accounts.push(account);
            resolve(account);
          }
        });
      });
    } catch (error) {
      throw new Error(`Outlook connection failed: ${error}`);
    }
  }

  // IMAP connection for other providers
  async connectIMAP(config: {
    host: string;
    port: number;
    secure: boolean;
    email: string;
    password: string;
  }): Promise<EmailAccount> {
    try {
      // This would need to be handled server-side due to CORS
      const response = await apiRequest('POST', '/api/email/connect-imap', config);
      
      const account: EmailAccount = {
        id: config.email,
        email: config.email,
        provider: 'imap',
        isConnected: true
      };
      
      this.accounts.push(account);
      return account;
    } catch (error) {
      throw new Error(`IMAP connection failed: ${error}`);
    }
  }

  // Scan Gmail data
  async scanGmailData(account: EmailAccount): Promise<EmailData> {
    if (!account.accessToken) {
      throw new Error('Gmail access token not found');
    }

    try {
      // Get basic Gmail stats
      const profile = await this.gmailApiRequest(account.accessToken, 'GET', '/gmail/v1/users/me/profile');
      
      // Get messages with different labels
      const [inbox, unread, important, spam] = await Promise.all([
        this.gmailApiRequest(account.accessToken, 'GET', '/gmail/v1/users/me/messages'),
        this.gmailApiRequest(account.accessToken, 'GET', '/gmail/v1/users/me/messages?labelIds=UNREAD'),
        this.gmailApiRequest(account.accessToken, 'GET', '/gmail/v1/users/me/messages?labelIds=IMPORTANT'),
        this.gmailApiRequest(account.accessToken, 'GET', '/gmail/v1/users/me/messages?labelIds=SPAM')
      ]);

      // Calculate old emails (older than 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oldEmailsQuery = `before:${oneYearAgo.getFullYear()}/${oneYearAgo.getMonth() + 1}/${oneYearAgo.getDate()}`;
      const oldEmails = await this.gmailApiRequest(account.accessToken, 'GET', `/gmail/v1/users/me/messages?q=${encodeURIComponent(oldEmailsQuery)}`);

      // Find emails with large attachments
      const largeAttachmentsQuery = 'has:attachment larger:10M';
      const largeAttachments = await this.gmailApiRequest(account.accessToken, 'GET', `/gmail/v1/users/me/messages?q=${encodeURIComponent(largeAttachmentsQuery)}`);

      return {
        total: inbox.resultSizeEstimate || 0,
        unread: unread.resultSizeEstimate || 0,
        important: important.resultSizeEstimate || 0,
        spam: spam.resultSizeEstimate || 0,
        oldEmails: oldEmails.resultSizeEstimate || 0,
        largeAttachments: largeAttachments.resultSizeEstimate || 0,
        provider: 'gmail',
        lastSynced: Date.now()
      };
    } catch (error) {
      throw new Error(`Gmail scan failed: ${error}`);
    }
  }

  // Scan Outlook data
  async scanOutlookData(account: EmailAccount): Promise<EmailData> {
    if (!account.accessToken) {
      throw new Error('Outlook access token not found');
    }

    try {
      // Get basic Outlook stats using Microsoft Graph
      const [inbox, unread, important, junk] = await Promise.all([
        this.graphApiRequest(account.accessToken, 'GET', '/me/mailFolders/inbox/messages/$count'),
        this.graphApiRequest(account.accessToken, 'GET', '/me/mailFolders/inbox/messages/$count?$filter=isRead eq false'),
        this.graphApiRequest(account.accessToken, 'GET', '/me/mailFolders/inbox/messages/$count?$filter=importance eq high'),
        this.graphApiRequest(account.accessToken, 'GET', '/me/mailFolders/junkemail/messages/$count')
      ]);

      // Calculate old emails
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oldEmailsFilter = `receivedDateTime lt ${oneYearAgo.toISOString()}`;
      const oldEmails = await this.graphApiRequest(account.accessToken, 'GET', `/me/mailFolders/inbox/messages/$count?$filter=${encodeURIComponent(oldEmailsFilter)}`);

      // Find emails with large attachments
      const largeAttachmentsFilter = 'hasAttachments eq true';
      const largeAttachments = await this.graphApiRequest(account.accessToken, 'GET', `/me/mailFolders/inbox/messages/$count?$filter=${encodeURIComponent(largeAttachmentsFilter)}`);

      return {
        total: inbox || 0,
        unread: unread || 0,
        important: important || 0,
        spam: junk || 0,
        oldEmails: oldEmails || 0,
        largeAttachments: largeAttachments || 0,
        provider: 'outlook',
        lastSynced: Date.now()
      };
    } catch (error) {
      throw new Error(`Outlook scan failed: ${error}`);
    }
  }

  // Helper methods
  private async getGmailAuthUrl(): Promise<string> {
    // This would be configured server-side
    const clientId = 'your-gmail-client-id';
    const redirectUri = `${window.location.origin}/auth/gmail/callback`;
    const scope = 'https://www.googleapis.com/auth/gmail.readonly';
    
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline`;
  }

  private async getOutlookAuthUrl(): Promise<string> {
    // This would be configured server-side
    const clientId = 'your-outlook-client-id';
    const redirectUri = `${window.location.origin}/auth/outlook/callback`;
    const scope = 'https://graph.microsoft.com/Mail.Read';
    
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}`;
  }

  private async gmailApiRequest(accessToken: string, method: string, endpoint: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gmail API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async graphApiRequest(accessToken: string, method: string, endpoint: string): Promise<any> {
    const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Graph API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get connected accounts
  getConnectedAccounts(): EmailAccount[] {
    return this.accounts.filter(acc => acc.isConnected);
  }

  // Disconnect account
  async disconnectAccount(accountId: string): Promise<void> {
    const accountIndex = this.accounts.findIndex(acc => acc.id === accountId);
    if (accountIndex > -1) {
      this.accounts[accountIndex].isConnected = false;
      this.accounts.splice(accountIndex, 1);
    }
  }
}

export const emailIntegration = new EmailIntegrationManager();
export type { EmailAccount };