import { TaskProvider } from '@/context/tasksContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePushNotifications } from '@/utils/notifications'; // Changed from '@/UTILS/notifications'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize notifications
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('Push token:', expoPushToken.data);
    }
  }, [expoPushToken]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TaskProvider>
        <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name="tasks" options={{ headerShown: false }} />
          </Stack>  
          <StatusBar style="auto" />
        </ThemeProvider>
      </TaskProvider>
    </SafeAreaProvider>
  );
}
