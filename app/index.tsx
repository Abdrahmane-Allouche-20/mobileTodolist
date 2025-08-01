import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import {  StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }} // top-left
  end={{ x: 1, y: 1 }}
      colors={['#041d4d', '#020d1f']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to TodoList</Text>
          <Text style={styles.subtitle}>Organize your tasks efficiently</Text>
          
         <View style={styles.buttonContainer}>
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    colors={['#1d9cacff', '#0e5977ff']}
    style={styles.taskButton}
  >
    <Link href="/tasks" >
      <Text style={styles.taskButtonText}>Check your tasks</Text>
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
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  taskButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  taskButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
 
})