import { CapacitorConfig } from "@capacitor/cli";

// IMPORTANT: Since you are using a Full-Stack framework (TanStack Start)
// with secure server-side API keys, your mobile app needs to wrap your
// securely hosted website rather than bundling server keys onto the phone.
// Update the 'url' below to wherever your web app is deployed!

const config: CapacitorConfig = {
  appId: "com.linguabridge.app",
  appName: "LinguaBridge",
  webDir: "dist/client",
  server: {
    // REPLACE THIS with your actual production URL where the app is hosted
    url: "https://your-production-url.lovable.app",
    cleartext: true,
  },
};

export default config;
