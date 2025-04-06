import { useState, useEffect } from "react";
import axios from "axios";
import './App.css'

const API_URL = "https://ubiquitous-zebra-g4qvpqpwr9gv39v6p-5000.app.github.dev/tasks";

type Task = {
  id: number;
  description: string;
  category?: string;
  priority: number; // 1 - Low, 2 - Medium, 3 - High
  completed: boolean;
  dateCreated: string;
  dueDate?: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    axios.get(API_URL).then((res) => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    const taskData = {
      description: newTask,
      category: category || undefined,
      priority,
      dueDate: dueDate || undefined,
    };
    console.log("Sending data:", taskData); // Debugging log
    axios
      .post(API_URL, { 
        description: newTask,
        category: category || undefined,
        priority,
        dueDate: dueDate || undefined, 
      })
      .then((res) => {
        console.log("Task Added:", res.data);
        setTasks([...tasks, res.data]);
        // Reset input fields
        setNewTask("");
        setCategory("");
        setPriority(1);
        setDueDate("");
      })
      .catch((err) => console.error("Error Adding Task:", err.response || err));
  };

  const toggleTask = (id: number) => {
    axios.patch(`${API_URL}/${id}`).then((res) => {
      setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
    });
  };

  const deleteTask = (id: number) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <>
      <header className="app-header">
        <h1>Simple ToDo List App</h1>
      </header>
      <main className="main-container">

        {/* Add Task Form */}
        <section className="add-task-form">
          <h2>Add New Task</h2>
          <div className="form-fields">
            <select title="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
            <select title="Priority" value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
            <input title="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter task..." required />
            <button type="submit" onClick={addTask}>
              Add Task
            </button>
          </div>
        </section>

        {/* Task List */}
        <section className="task-list">
          <h2>Task List</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className={`task-item priority-${task.priority}`}>
                <span className={task.completed ? "completed" : ""}>{task.description}</span>
                <div className="task-actions">
                  <button type="submit" onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

      </main>

      
      {/* <button type="button" onClick={addTask}>Add</button> */}
      {/* <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description} {task.completed ? "✅" : "❌"}
            <button onClick={() => toggleTask(task.id)}>Toggle</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </>
  );
}

export default App;