import TaskModal from '@/components/UpdateTaskModel'
import type { Task } from '@/context/tasksContext'
import { useTask } from '@/context/tasksContext'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Tasks = () => {
    const [title, setTitle] = useState('');
    const [showUpdate, setShowUpdate] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { tasks, deleteTask, addTask, updateTask, loading } = useTask();

    const handleSubmit = () => {
        if (title.trim()) {
            addTask({ 
                id: Date.now().toString(), 
                title: title.trim(), 
                completed: false 
            });
            setTitle('');
        } else {
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

    const renderTask = ({ item }: { item: Task }) => {
        return (
            <View style={styles.taskCard}>
                {/* Checkbox for completion */}
                <Pressable 
                    onPress={() => toggleTask(item.id, item.completed)}
                    style={styles.checkbox}
                >
                    <Ionicons 
                        name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={item.completed ? "#4CAF50" : "rgba(255,255,255,0.6)"} 
                    />
                </Pressable>

                {/* Task text */}
                <Text style={[
                    styles.taskText,
                    item.completed && styles.completedText
                ]}>
                    {item.title}
                </Text>

                {/* Actions container */}
                <View style={styles.actionsButtonContainer}>
                    {/* Edit button */}
                    <Pressable 
                        onPress={() => handleEdit(item)}
                        style={styles.actionButton}
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
                </View>
            </View>
        )
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#041d4d', '#020d1f']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Ionicons name="list" size={32} color="white" />
                        <Text style={styles.headerTitle}>My Tasks</Text>
                    </View>
                    <Text style={styles.taskCount}>
                        {tasks.filter(t => !t.completed).length} of {tasks.length} pending
                    </Text>
                </View>

                {/* Input container */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="add-circle-outline" size={20} color="rgba(255,255,255,0.6)" />
                        <TextInput 
                            value={title} 
                            onChangeText={setTitle} 
                            placeholderTextColor={'rgba(255,255,255,0.6)'} 
                            placeholder="Add a new task" 
                            style={styles.input}
                            onSubmitEditing={handleSubmit}
                            returnKeyType="done"
                        />
                    </View>
                    <Pressable onPress={handleSubmit} disabled={loading || !title.trim()}>
                        <LinearGradient 
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}  
                            colors={['#2f51d6', '#56c5f1']} 
                            style={[
                                styles.addTaskButton, 
                                (loading || !title.trim()) && styles.disabledButton
                            ]}
                        >
                            {loading ? (
                                <Ionicons name="reload-outline" size={20} color="white" />
                            ) : (
                                <Ionicons name="add" size={20} color="white" />
                            )}
                        </LinearGradient>
                    </Pressable>
                </View>

                {/* Task list */}
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.taskListContent}
                    style={styles.taskList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="clipboard-outline" size={64} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>No tasks yet</Text>
                            <Text style={styles.emptySubtext}>Add your first task to get started!</Text>
                        </View>
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
        color: 'white',
    },
    taskCount: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 16,
        gap: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        color: 'white',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkbox: {
        padding: 4,
    },
    taskText: {
        flex: 1,
        color: 'white',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        color: 'rgba(255,255,255,0.6)',
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubtext: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },
})

export default Tasks