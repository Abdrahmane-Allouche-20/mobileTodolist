import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

// Configure notification behavior with proper TypeScript typing
Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const usePushNotifications = (): PushNotificationState => {
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
        let token: Notifications.ExpoPushToken | undefined;
        
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (finalStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                console.warn('Failed to get push token for push notification!');
                return undefined;
            }
            
            try {
                const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
                if (!projectId) {
                    console.warn('Project ID not found');
                    return undefined;
                }

                token = await Notifications.getExpoPushTokenAsync({
                    projectId,
                });
                setExpoPushToken(token);
            } catch (error) {
                console.error('Error getting push token:', error);
                return undefined;
            }
            
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        } else {
            console.log('Must use physical device for push notifications');
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification: Notifications.Notification) => {
                setNotification(notification);
            }
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response: Notifications.NotificationResponse) => {
                console.log('Notification response:', response);
            }
        );

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return {
        expoPushToken,
        notification,
    };
};

// Utility functions for scheduling notifications
export async function scheduleTaskReminder(
    taskTitle: string, 
    reminderTime: Date
): Promise<string | undefined> {
    try {
        // Convert Date to seconds from now
        const secondsFromNow = Math.floor((reminderTime.getTime() - Date.now()) / 1000);
        
        if (secondsFromNow <= 0) {
            console.warn('Reminder time must be in the future');
            return undefined;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Task Reminder 📝',
                body: `Don't forget: ${taskTitle}`,
                data: { taskTitle },
                sound: 'default',
            },
            trigger: {
                seconds: secondsFromNow,
            },
        });
        return notificationId;
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        return undefined;
    }
}

export async function scheduleTaskNotification(
    taskTitle: string,
    delayInMinutes: number = 30
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Task Reminder ⏰',
                body: `Time to work on: ${taskTitle}`,
                data: { taskTitle },
                sound: 'default',
            },
            trigger: {
                seconds: delayInMinutes * 60,
            },
        });
        
        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return undefined;
    }
}

// Using seconds-based trigger (most reliable)
export async function scheduleTaskNotificationInSeconds(
    taskTitle: string,
    delayInSeconds: number = 1800 // 30 minutes default
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Task Reminder ⏰',
                body: `Time to work on: ${taskTitle}`,
                data: { taskTitle },
                sound: 'default',
            },
            trigger: {
                seconds: delayInSeconds,
            },
        });
        
        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return undefined;
    }
}

// For repeating notifications - simplified version
export async function scheduleRepeatingReminder(
    taskTitle: string,
    hour: number = 9, // 9 AM
    minute: number = 0
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Daily Task Reminder 📅',
                body: `Don't forget about: ${taskTitle}`,
                data: { taskTitle },
                sound: 'default',
            },
            trigger: {
                hour,
                minute, // Fixed: removed the extra comma
                repeats: true,
            },
        });
        
        return notificationId;
    } catch (error) {
        console.error('Error scheduling repeating reminder:', error);
        return undefined;
    }
}

// Weekly reminder - simplified version
export async function scheduleWeeklyReminder(
    taskTitle: string,
    weekday: number = 2, // Monday (1=Sunday, 2=Monday, etc.)
    hour: number = 9,
    minute: number = 0
): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Weekly Task Reminder 📅',
                body: `Weekly reminder: ${taskTitle}`,
                data: { taskTitle },
                sound: 'default',
            },
            trigger: {
                weekday,
                hour,
                minute,
                repeats: true,
            },
        });
        
        return notificationId;
    } catch (error) {
        console.error('Error scheduling weekly reminder:', error);
        return undefined;
    }
}

export async function cancelNotification(notificationId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error('Error canceling notification:', error);
    }
}

export async function showInstantNotification(title: string, body: string): Promise<string | undefined> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
            },
            trigger: null, // Immediate notification
        });
        return notificationId;
    } catch (error) {
        console.error('Error showing notification:', error);
        return undefined;
    }
}

export async function checkNotificationPermissions(): Promise<boolean> {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error checking notification permissions:', error);
        return false;
    }
}

export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
}

// Schedule recurring reminders every 3 hours for remaining tasks
export async function scheduleRecurringTaskReminders(
    remainingTasks: string[], // Array of task titles
    intervalHours: number = 3 // Default 3 hours
): Promise<string[]> {
    const notificationIds: string[] = [];
    
    try {
        // Cancel any existing recurring reminders first
        await cancelAllRecurringReminders();
        
        if (remainingTasks.length === 0) {
            console.log('No remaining tasks to set reminders for');
            return [];
        }

        // Schedule reminders for the next 24 hours (8 reminders total if every 3 hours)
        const totalReminders = Math.floor(24 / intervalHours);
        
        for (let i = 0; i < totalReminders; i++) {
            const delayInSeconds = (i + 1) * intervalHours * 60 * 60; // Convert hours to seconds
            
            const taskList = remainingTasks.length > 3 
                ? `${remainingTasks.slice(0, 3).join(', ')} and ${remainingTasks.length - 3} more...`
                : remainingTasks.join(', ');

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Task Reminder (${remainingTasks.length} pending)`,
                    body: `Don't forget: ${taskList}`,
                    data: { 
                        type: 'recurring_reminder',
                        taskCount: remainingTasks.length,
                        tasks: remainingTasks 
                    },
                    sound: 'default',
                },
                trigger: {
                    seconds: delayInSeconds,
                },
            });
            
            if (notificationId) {
                notificationIds.push(notificationId);
            }
        }

        // Store notification IDs for later cancellation
        await storeRecurringReminderIds(notificationIds);
        
        console.log(`Scheduled ${notificationIds.length} recurring reminders every ${intervalHours} hours`);
        return notificationIds;
        
    } catch (error) {
        console.error('Error scheduling recurring reminders:', error);
        return [];
    }
}

// Schedule daily recurring reminders at specific times
export async function scheduleDailyTaskReminders(
    remainingTasks: string[],
    reminderTimes: { hour: number; minute: number }[] = [
        { hour: 9, minute: 0 },   // 9:00 AM
        { hour: 12, minute: 0 },  // 12:00 PM
        { hour: 15, minute: 0 },  // 3:00 PM
        { hour: 18, minute: 0 },  // 6:00 PM
        { hour: 21, minute: 0 }   // 9:00 PM
    ]
): Promise<string[]> {
    const notificationIds: string[] = [];
    
    try {
        if (remainingTasks.length === 0) {
            return [];
        }

        for (const time of reminderTimes) {
            const taskList = remainingTasks.length > 3 
                ? `${remainingTasks.slice(0, 3).join(', ')} and ${remainingTasks.length - 3} more...`
                : remainingTasks.join(', ');

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `📋 Daily Task Reminder (${remainingTasks.length} pending)`,
                    body: `Remaining tasks: ${taskList}`,
                    data: { 
                        type: 'daily_reminder',
                        taskCount: remainingTasks.length,
                        tasks: remainingTasks 
                    },
                    sound: 'default',
                },
                trigger: {
                    hour: time.hour,
                    minute: time.minute,
                    repeats: true,
                },
            });
            
            if (notificationId) {
                notificationIds.push(notificationId);
            }
        }

        await storeRecurringReminderIds(notificationIds);
        return notificationIds;
        
    } catch (error) {
        console.error('Error scheduling daily reminders:', error);
        return [];
    }
}

// Helper function to store reminder IDs
async function storeRecurringReminderIds(ids: string[]): Promise<void> {
    try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('@recurring_reminder_ids', JSON.stringify(ids));
    } catch (error) {
        console.error('Error storing reminder IDs:', error);
    }
}

// Helper function to get stored reminder IDs
async function getRecurringReminderIds(): Promise<string[]> {
    try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const ids = await AsyncStorage.getItem('@recurring_reminder_ids');
        return ids ? JSON.parse(ids) : [];
    } catch (error) {
        console.error('Error getting reminder IDs:', error);
        return [];
    }
}

// Cancel all recurring reminders
export async function cancelAllRecurringReminders(): Promise<void> {
    try {
        const reminderIds = await getRecurringReminderIds();
        
        for (const id of reminderIds) {
            await Notifications.cancelScheduledNotificationAsync(id);
        }
        
        // Clear stored IDs
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem('@recurring_reminder_ids');
        
        console.log(`Cancelled ${reminderIds.length} recurring reminders`);
    } catch (error) {
        console.error('Error cancelling recurring reminders:', error);
    }
}

// Update recurring reminders when tasks change
export async function updateRecurringReminders(
    allTasks: { id: string; title: string; completed: boolean }[],
    intervalHours: number = 3
): Promise<void> {
    try {
        const remainingTasks = allTasks
            .filter(task => !task.completed)
            .map(task => task.title);
        
        if (remainingTasks.length === 0) {
            // No remaining tasks, cancel all reminders
            await cancelAllRecurringReminders();
            await showInstantNotification(
                'All Done! 🎉',
                'No more tasks to remind you about!'
            );
        } else {
            // Update reminders with current remaining tasks
            await scheduleRecurringTaskReminders(remainingTasks, intervalHours);
        }
    } catch (error) {
        console.error('Error updating recurring reminders:', error);
    }
}