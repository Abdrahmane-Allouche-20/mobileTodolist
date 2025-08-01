import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

interface TaskModalProps {
  showUpdate: boolean;
  closeModal: () => void;
  onSave: (title: string) => void;
  initialTitle?: string;
  loading?: boolean;
}

export default function TaskModal({ 
  showUpdate, 
  closeModal, 
  onSave, 
  initialTitle = '',
  loading = false 
}: TaskModalProps) {
  const [editTitle, setEditTitle] = useState(initialTitle);

  // Update editTitle when initialTitle changes
  useEffect(() => {
    setEditTitle(initialTitle);
  }, [initialTitle]);

  const handleUpdateTask = () => {
    if (editTitle.trim()) {
      onSave(editTitle.trim());
      closeModal();
    } else {
      Alert.alert('Error', 'Please enter a task title');
    }
  };

  const handleCloseModal = () => {
    setEditTitle(initialTitle); // Reset to original title
    closeModal();
  };

  return (
    <Modal
      visible={showUpdate}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View 
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>

            <View style={styles.modalInputContainer}>
              <Ionicons name="pencil-outline" size={20} color="rgba(255,255,255,0.6)" />
              <TextInput
                placeholder="Edit your task"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.modalInput}
                value={editTitle}
                onChangeText={setEditTitle}
                autoFocus={true}
                onSubmitEditing={handleUpdateTask}
                returnKeyType="done"
                multiline={false}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable 
                style={styles.saveButtonContainer} 
                onPress={handleUpdateTask}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={[styles.saveButton, loading && styles.disabledButton]}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backdropFilter:'blur(10px)'
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter:'blur(10px)',
    backgroundColor:'rgba(54, 124, 222, 0.58)'

  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 16,
    color: 'white',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonContainer: {
    flex: 1,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
