# Infinite News Feed

A real-time, infinite-scrolling React Native application that aggregates news and facts from free RSS sources.

## How to Run locally on the Web Platform

Browsers enforce strict CORS policies that prevent the frontend app from directly fetching XML data from sources like Google News and Reddit. To seamlessly bypass this, this Expo app utilizes **API Routes** as an integrated reverse proxy.

### Start the Expo App

Open a terminal window and run:

```bash
cd mobile-app
npx expo start
```

Press `w` to open the app in your local web browser. The app will automatically route its requests through `/api/proxy` to bypass CORS.

### Native Mobile Builds
The native React Native app (iOS/Android) does not route through the API proxy, as native HTTP clients do not enforce browser CORS rules. The code automatically detects the platform and will fetch directly on native devices.
