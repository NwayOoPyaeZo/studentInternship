import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Avatar, List, Checkbox, IconButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { AppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { currentUser, attendance, setAttendance, dailyLogs, setDailyLogs, todos, setTodos } = useContext(AppContext);
  const today = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [taskText, setTaskText] = useState(dailyLogs[today] || '');
  const [newTodo, setNewTodo] = useState(''); 

  // --- Actions ---
  const handleCheckIn = () => {
    setAttendance(prev => ({ 
      ...prev, 
      [today]: { selected: true, selectedColor: '#4CAF50', marked: true } 
    }));
    Alert.alert("Success", "Attendance logged for today!");
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setTaskText(dailyLogs[day.dateString] || '');
  };

  const handleSaveLog = () => {
    setDailyLogs(prev => ({ ...prev, [selectedDate]: taskText }));
    Alert.alert("Saved", `Log updated for ${selectedDate}!`);
  };

  // --- To-Do List Logic ---
  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo(''); // Clear input after adding
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const currentMarkedDates = {
    ...attendance,
    [selectedDate]: { 
      ...(attendance[selectedDate] || {}), 
      selected: true, 
      selectedColor: selectedDate === today && attendance[today] ? '#4CAF50' : '#6200ee' 
    }
  };

  return (
    <ScrollView style={styles.bg}>
      <View style={styles.paddingContainer}>
        
        {/* Attendance Card */}
        <Card style={styles.card}>
          <Card.Title title="Work Tracker" subtitle={currentUser?.email} left={(p) => <Avatar.Icon {...p} icon="calendar-check" />} />
          <Card.Content>
            <Button mode="contained" onPress={handleCheckIn} icon="check-bold" style={styles.checkInBtn}>Daily Check-in</Button>
          </Card.Content>
        </Card>

        {/* Calendar */}
        <Card style={styles.calendarCard}>
          <Calendar 
            onDayPress={handleDayPress}
            markedDates={currentMarkedDates} 
            theme={{ todayTextColor: '#6200ee' }} 
          />
        </Card>

        {/* To-Do List Section */}
        <Text variant="titleMedium" style={styles.sectionTitle}>My Tasks</Text>
        <View style={styles.todoInputContainer}>
          <TextInput 
            label="Add a new task..." 
            mode="outlined" 
            value={newTodo} 
            onChangeText={setNewTodo} 
            style={styles.todoInput} 
          />
          <Button mode="contained" onPress={handleAddTodo} style={styles.todoBtn}>Add</Button>
        </View>

        {todos.map(todo => (
          <List.Item
            key={todo.id}
            title={todo.text}
            titleStyle={{ 
              textDecorationLine: todo.completed ? 'line-through' : 'none', 
              color: todo.completed ? 'gray' : 'black' 
            }}
            left={() => <Checkbox status={todo.completed ? 'checked' : 'unchecked'} onPress={() => toggleTodo(todo.id)} color="#6200ee" />}
            right={(props) => <IconButton {...props} icon="delete-outline" iconColor="#d32f2f" onPress={() => deleteTodo(todo.id)} />}
            style={styles.todoItem}
          />
        ))}

        {/* Daily Log Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, {marginTop: 20}]}>
          Progress Log: {selectedDate === today ? "Today" : selectedDate}
        </Text>
        <TextInput 
          label="What did you build?" 
          mode="outlined"
          multiline
          numberOfLines={4}
          value={taskText}
          onChangeText={setTaskText}
          style={styles.taskInput}
        />
        <Button mode="contained-tonal" icon="content-save" style={{marginTop: 10}} onPress={handleSaveLog}>
          Save Progress
        </Button>

        {/* Navigation / Logout */}
        <View style={styles.menuGrid}>
          <Button icon="account" mode="outlined" onPress={() => navigation.navigate('Profile')}>Profile</Button>
          <Button icon="logout" mode="outlined" textColor="red" onPress={() => navigation.replace('Login')}>Logout</Button>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f5f5f5' },
  paddingContainer: { padding: 20 },
  card: { marginBottom: 15, elevation: 4, borderRadius: 12 },
  checkInBtn: { marginTop: 10 },
  calendarCard: { padding: 5, elevation: 2, backgroundColor: '#fff', marginBottom: 20 },
  sectionTitle: { marginBottom: 10, fontWeight: 'bold' },
  taskInput: { backgroundColor: '#fff' },
  todoInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  todoInput: { flex: 1, backgroundColor: '#fff', marginRight: 10 },
  todoBtn: { justifyContent: 'center' },
  todoItem: { backgroundColor: '#fff', marginBottom: 8, borderRadius: 8, elevation: 1 },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 },
});