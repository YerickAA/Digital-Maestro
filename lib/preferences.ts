// User preferences management
export interface UserPreferences {
  notifications: boolean;
  autoClean: boolean;
  primaryGoal: 'storage' | 'organize' | 'privacy' | 'productivity';
  dataTypes: string[];
}

export function getUserPreferences(): UserPreferences | null {
  const prefsString = localStorage.getItem('userPreferences');
  if (!prefsString) return null;
  
  try {
    return JSON.parse(prefsString);
  } catch {
    return null;
  }
}

export function updateUserPreferences(preferences: Partial<UserPreferences>) {
  const current = getUserPreferences() || getDefaultPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('userPreferences', JSON.stringify(updated));
  return updated;
}

export function getDefaultPreferences(): UserPreferences {
  return {
    notifications: true,
    autoClean: false,
    primaryGoal: 'storage',
    dataTypes: ['photos', 'files', 'apps', 'email']
  };
}

export function getCategoryPriority(preferences: UserPreferences): string[] {
  const { primaryGoal, dataTypes } = preferences;
  
  // Reorder categories based on user's primary goal and selected data types
  let prioritized: string[] = [];
  
  // Always include selected data types first
  prioritized = [...dataTypes];
  
  // Add remaining categories based on primary goal
  const allCategories = ['photos', 'files', 'apps', 'email'];
  const remaining = allCategories.filter(cat => !dataTypes.includes(cat));
  
  // Goal-based prioritization for remaining categories
  if (primaryGoal === 'storage') {
    prioritized.push(...remaining.sort((a, b) => {
      // Photos and files typically use more storage
      const storageWeight = { photos: 3, files: 2, apps: 1, email: 0 };
      return (storageWeight[b] || 0) - (storageWeight[a] || 0);
    }));
  } else if (primaryGoal === 'organize') {
    prioritized.push(...remaining.sort((a, b) => {
      // Files and email need more organization
      const organizeWeight = { files: 3, email: 2, photos: 1, apps: 0 };
      return (organizeWeight[b] || 0) - (organizeWeight[a] || 0);
    }));
  } else if (primaryGoal === 'privacy') {
    prioritized.push(...remaining.sort((a, b) => {
      // Apps and email are more privacy-sensitive
      const privacyWeight = { apps: 3, email: 2, photos: 1, files: 0 };
      return (privacyWeight[b] || 0) - (privacyWeight[a] || 0);
    }));
  } else if (primaryGoal === 'productivity') {
    prioritized.push(...remaining.sort((a, b) => {
      // Apps and email affect productivity most
      const productivityWeight = { apps: 3, email: 2, files: 1, photos: 0 };
      return (productivityWeight[b] || 0) - (productivityWeight[a] || 0);
    }));
  }
  
  return prioritized;
}

export function getGoalBasedTips(preferences: UserPreferences): string[] {
  const { primaryGoal, dataTypes } = preferences;
  
  // Filter tips based on user's goal and selected data types
  let relevantCategories: string[] = [];
  
  if (primaryGoal === 'storage') {
    relevantCategories = ['photos', 'files', 'general'];
  } else if (primaryGoal === 'organize') {
    relevantCategories = ['files', 'email', 'general'];
  } else if (primaryGoal === 'privacy') {
    relevantCategories = ['apps', 'email', 'general'];
  } else if (primaryGoal === 'productivity') {
    relevantCategories = ['apps', 'email', 'general'];
  }
  
  // Include user's selected data types
  return [...new Set([...relevantCategories, ...dataTypes])];
}

export function getPersonalizedInsights(preferences: UserPreferences, digitalData: any): any[] {
  const { primaryGoal, dataTypes } = preferences;
  const insights = [];
  
  // Add insights based on primary goal
  if (primaryGoal === 'storage' && digitalData) {
    insights.push({
      title: 'Storage Optimization',
      value: `${digitalData.photosStorage} + ${digitalData.filesStorage}`,
      description: 'Total storage used by your priority categories',
      trend: 'focus'
    });
  }
  
  if (primaryGoal === 'organize' && digitalData) {
    insights.push({
      title: 'Organization Score',
      value: `${Math.round(digitalData.healthScore * 0.8)}%`,
      description: 'How well organized your digital content is',
      trend: 'focus'
    });
  }
  
  if (primaryGoal === 'privacy' && digitalData) {
    insights.push({
      title: 'Privacy Health',
      value: `${digitalData.appsUnused} unused apps`,
      description: 'Apps that might be collecting unnecessary data',
      trend: 'focus'
    });
  }
  
  if (primaryGoal === 'productivity' && digitalData) {
    insights.push({
      title: 'Productivity Impact',
      value: `${digitalData.emailUnread} unread emails`,
      description: 'Digital distractions affecting your focus',
      trend: 'focus'
    });
  }
  
  return insights;
}