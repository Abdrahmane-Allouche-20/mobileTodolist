import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    const colorScheme = useColorScheme()
    
    // Get the correct color theme - FIXED SYNTAX
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light']
    
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[theme.secondTint, theme.tintfirst]} // FIXED: Use theme colors for both
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Welcome to TodoList
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text, opacity: 0.8 }]}>
                        Organize your tasks efficiently
                    </Text>
                    
                    <View style={styles.buttonContainer}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={[theme.buttonfirstColor, theme.buttonSecondColor]} // FIXED: Use theme colors
                            style={styles.taskButton}
                        >
                            <Link href="/tasks" style={styles.linkStyle}>
                                <Text style={[styles.taskButtonText, { 
                                    color: colorScheme === 'dark' ? '#020d1f' : 'white' 
                                }]}>
                                    Check your tasks
                                </Text>
                            </Link>
                        </LinearGradient>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 50,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        gap: 15,
    },
    taskButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
    },
    linkStyle: {
        width: '100%',
        alignItems: 'center',
    },
    taskButtonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})