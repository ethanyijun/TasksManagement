import './App.css';
import React from 'react';
import TodoItem from "./Components/TodoItem";

function App() {
  const [todos, seTodos] = React.useState([
    { text: "Learn about React" },
    { text: "Meet friend for lunch" },
    { text: "Build really cool todo app" }
  ]);

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index)=>(
          <TodoItem 
          key = {index}
          index = {index}
          todo = {todo}
          ></TodoItem>
        ))}
      </div>
    </div>
  );
}

export default App;
