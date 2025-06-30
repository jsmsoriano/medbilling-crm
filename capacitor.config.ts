
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5f12324e5f3c42f893cfcc67b49e8cc4',
  appName: 'medbilling-crm',
  webDir: 'dist',
  server: {
    url: 'https://5f12324e-5f3c-42f8-93cf-cc67b49e8cc4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
