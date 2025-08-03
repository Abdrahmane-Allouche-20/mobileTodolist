import TaskModal from '@/components/UpdateTaskModel'
import { Colors } from '@/constants/Colors'
import type { Task } from '@/context/tasksContext'
import { useTask } from '@/context/tasksContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Animated, {
    BounceIn,
    FadeInDown,
    FadeOutUp,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const Tasks = () => {
    const [title, setTitle] = useState('');
    const [showUpdate, setShowUpdate] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { tasks, deleteTask, addTask, updateTask, loading } = useTask();
    const colorScheme = useColorScheme()
    
    const theme = Colors[colorScheme ?? 'light']
    
    // Animation values
    const buttonScale = useSharedValue(1);
    const inputShake = useSharedValue(0);
    
    const handleSubmit = () => {
        if (title.trim()) {
            // Animate button press
            buttonScale.value = withSpring(0.95, {}, () => {
                buttonScale.value = withSpring(1);
            });
            
            addTask({ 
                id: Date.now().toString(), 
                title: title.trim(), 
                completed: false 
            });
            setTitle('');
        } else {
            // Shake animation for empty input
            inputShake.value = withSpring(-10, {}, () => {
                inputShake.value = withSpring(10, {}, () => {
                    inputShake.value = withSpring(0);
                });
            });
            Alert.alert('Error', 'Please enter a task title');
        }
    }

    const toggleTask = (id: string, completed: boolean) => {
        updateTask(id, { completed: !completed });
    }

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Delete Task',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) }
            ]
        );
    }

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setShowUpdate(true);
    }

    const handleUpdateTask = (newTitle: string) => {
        if (editingTask) {
            updateTask(editingTask.id, { title: newTitle });
            setEditingTask(null);
        }
    }

    const closeModal = () => {
        setShowUpdate(false);
        setEditingTask(null);
    }

    // Animated styles
    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
        };
    });

    const inputAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: inputShake.value }],
        };
    });

    const renderTask = ({ item, index }: { item: Task; index: number }) => {
        return (
            <Animated.View 
                entering={FadeInDown.delay(index * 100).springify()}
                exiting={FadeOutUp.springify()}
                style={[styles.taskCard, { 
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.cardBorder 
                }]}
            >
                {/* Checkbox for completion */}
                <Pressable 
                    onPress={() => toggleTask(item.id, item.completed)}
                    style={styles.checkbox}
                >
                    <Animated.View entering={BounceIn.delay(200)}>
                        <Ionicons 
                            name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                            size={24} 
                            color={item.completed ? "#4CAF50" : theme.icon} 
                        />
                    </Animated.View>
                </Pressable>

                {/* Task text */}
                <Animated.Text 
                    entering={SlideInRight.delay(100)}
                    style={[
                        styles.taskText,
                        { color: theme.text },
                        item.completed && styles.completedText
                    ]}
                >
                    {item.title}
                </Animated.Text>

                {/* Actions container */}
                <Animated.View 
                    entering={SlideInRight.delay(200)}
                    style={styles.actionsButtonContainer}
                >
                    {/* Edit button */}
                    <Pressable 
                        onPress={() => handleEdit(item)}
                        style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
                    >
                        <Ionicons name="pencil-outline" size={18} color="#4FC3F7" />
                    </Pressable>

                    {/* Delete button */}
                    <Pressable 
                        onPress={() => handleDelete(item.id, item.title)}
                        style={[styles.actionButton, styles.deleteButton]}
                    >
                        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </Pressable>
                </Animated.View>
            </Animated.View>
        )
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[theme.secondTint, theme.tintfirst]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <Animated.View 
                    entering={FadeInDown.delay(100)}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <Ionicons name="list" size={32} color={theme.text} />
                        <Text style={[styles.headerTitle, { color: theme.text }]}>My Tasks</Text>
                    </View>
                    <Text style={[styles.taskCount, { color: theme.text, opacity: 0.7 }]}>
                        {tasks.filter(t => !t.completed).length} of {tasks.length} pending
                    </Text>
                </Animated.View>

                {/* Input container */}
                <Animated.View 
                    entering={FadeInDown.delay(200)}
                    style={styles.inputContainer}
                >
                    <Animated.View 
                        style={[
                            styles.inputWrapper, 
                            { 
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder 
                            },
                            inputAnimatedStyle
                        ]}
                    >
                        <Ionicons name="add-circle-outline" size={20} color={theme.inputPlaceholder} />
                        <TextInput 
                            value={title} 
                            onChangeText={setTitle} 
                            placeholderTextColor={theme.inputPlaceholder} 
                            placeholder="Add a new task" 
                            style={[styles.input, { color: theme.inputText }]}
                            onSubmitEditing={handleSubmit}
                            returnKeyType="done"
                        />
                    </Animated.View>
                    
                    <Animated.View style={buttonAnimatedStyle}>
                        <Pressable onPress={handleSubmit} disabled={loading || !title.trim()}>
                            <LinearGradient 
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}  
                                colors={[theme.buttonfirstColor, theme.buttonSecondColor]} 
                                style={[
                                    styles.addTaskButton, 
                                    (loading || !title.trim()) && styles.disabledButton
                                ]}
                            >
                                {loading ? (
                                    <Animated.View 
                                        entering={BounceIn}
                                        style={{ transform: [{ rotate: '360deg' }] }}
                                    >
                                        <Ionicons name="reload-outline" size={20} color="white" />
                                    </Animated.View>
                                ) : (
                                    <Ionicons name="add" size={20} color="white" />
                                )}
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                </Animated.View>

                {/* Task list */}
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.taskListContent}
                    style={styles.taskList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Animated.View 
                            entering={FadeInDown.delay(300)}
                            style={styles.emptyContainer}
                        >
                            <Ionicons name="clipboard-outline" size={64} color={theme.text} style={{ opacity: 0.3 }} />
                            <Text style={[styles.emptyText, { color: theme.text, opacity: 0.6 }]}>No tasks yet</Text>
                            <Text style={[styles.emptySubtext, { color: theme.text, opacity: 0.4 }]}>Add your first task to get started!</Text>
                        </Animated.View>
                    }
                />

                {/* Update Modal Component */}
                <TaskModal
                    showUpdate={showUpdate}
                    closeModal={closeModal}
                    onSave={handleUpdateTask}
                    initialTitle={editingTask?.title || ''}
                    loading={loading}
                />
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 6,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    taskCount: {
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        gap: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
    },
    addTaskButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    taskList: {
        flex: 1,
    },
    taskListContent: {
        gap: 12,
        paddingBottom: 20,
    },
    taskCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    checkbox: {
        padding: 4,
    },
    taskText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    actionsButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 14,
    },
})

export default Tasks