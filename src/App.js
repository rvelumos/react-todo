import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");

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

    const addTask = async () => {
        if (taskName.trim()) {
            try {
                const docRef = await addDoc(collection(db, 'tasks'), {
                    name: taskName
                });
                setTasks([...tasks, { id: docRef.id, name: taskName }]);
                setTaskName("");
            } catch (error) {
                console.error("Error adding task: ", error);
            }
        }
    };

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

            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
            />
            <button onClick={addTask}>Add Task</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span>{task.name}</span>

                        <button onClick={() => {
                            const newName = prompt("Edit task name:", task.name);
                            if (newName) {
                                updateTask(task.id, newName);
                            }
                        }}>
                            Edit
                        </button>

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
