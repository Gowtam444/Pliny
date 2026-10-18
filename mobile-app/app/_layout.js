import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Infinite Feed', headerShown: false }} />
      <Stack.Screen name="sources" options={{ title: 'Customize Sources', presentation: 'modal' }} />
    </Stack>
  );
}
