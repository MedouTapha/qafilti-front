import { Injectable, signal, computed } from '@angular/core';

export interface AppSettings {
  passengerIdentifierType: 'NNI' | 'Passport' | 'Both';
  passengerIdentifierLabel: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  // Default settings
  private readonly defaultSettings: AppSettings = {
    passengerIdentifierType: 'Both',
    passengerIdentifierLabel: 'NNI ou Passport'
  };

  // Private state with signals
  private readonly _settings = signal<AppSettings>(this.loadSettings());

  // Public readonly signals
  readonly settings = this._settings.asReadonly();
  readonly passengerIdentifierType = computed(() => this._settings().passengerIdentifierType);
  readonly passengerIdentifierLabel = computed(() => this._settings().passengerIdentifierLabel);

  constructor() {
    // Auto-load from localStorage
    this._settings.set(this.loadSettings());
  }

  // Load settings from localStorage
  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem('app_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('[SettingsService] Error loading settings:', error);
    }
    return this.defaultSettings;
  }

  // Save settings to localStorage
  private saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('[SettingsService] Error saving settings:', error);
    }
  }

  // Update settings
  updateSettings(updates: Partial<AppSettings>): void {
    const newSettings = { ...this._settings(), ...updates };
    this._settings.set(newSettings);
    this.saveSettings(newSettings);
  }

  // Get current settings
  getSettings(): AppSettings {
    return this._settings();
  }

  // Reset to defaults
  resetToDefaults(): void {
    this._settings.set(this.defaultSettings);
    this.saveSettings(this.defaultSettings);
  }

  // Update passenger identifier type
  setPassengerIdentifierType(type: 'NNI' | 'Passport' | 'Both'): void {
    const label = type === 'Both' ? 'NNI ou Passport' : type;
    this.updateSettings({ passengerIdentifierType: type, passengerIdentifierLabel: label });
  }
}
