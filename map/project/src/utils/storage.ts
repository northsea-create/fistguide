import { UserProfile } from '../types';

const STORAGE_KEY = 'fist-fuel-profile';

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
}

export function loadUserProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const profile = JSON.parse(stored);
    
    // Validate the profile structure
    if (
      profile &&
      typeof profile === 'object' &&
      ['reduce', 'balanced', 'gain'].includes(profile.goal) &&
      typeof profile.height === 'number' &&
      typeof profile.weight === 'number' &&
      profile.height > 0 &&
      profile.weight > 0
    ) {
      return profile;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user profile:', error);
  }
}