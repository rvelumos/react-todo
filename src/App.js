import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Ensure db is imported correctly
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");  // State to handle task input

    // Fetch tasks from Firestore
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tasks'));
                const tasksArray = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setTasks(tasksArray);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };

        fetchTasks();
    }, []);

    // Add task to Firestore
    const addTask = async () => {
        if (taskName.trim()) {
            try {
                const docRef = await addDoc(collection(db, 'tasks'), {
                    name: taskName
                });
                setTasks([...tasks, { id: docRef.id, name: taskName }]);
                setTaskName(""); // Clear input after adding
            } catch (error) {
                console.error("Error adding task: ", error);
            }
        }
    };

    // Update task in Firestore
    const updateTask = async (id, newName) => {
        try {
            const taskDoc = doc(db, 'tasks', id);
            await updateDoc(taskDoc, {
                name: newName
            });
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, name: newName } : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error updating task: ", error);
        }
    };

    // Delete task from Firestore
    const deleteTask = async (id) => {
        try {
            const taskDoc = doc(db, 'tasks', id);
            await deleteDoc(taskDoc);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };

    return (
        <div>
            <h1>Task List</h1>

            {/* Input for new task */}
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
            />
            <button onClick={addTask}>Add Task</button>

            {/* Displaying tasks */}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span>{task.name}</span>

                        {/* Update task */}
                        <button onClick={() => {
                            const newName = prompt("Edit task name:", task.name);
                            if (newName) {
                                updateTask(task.id, newName);
                            }
                        }}>
                            Edit
                        </button>

                        {/* Delete task */}
                        <button onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
