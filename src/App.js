import './App.css';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';


function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function Todo({ todo, index, toggleTodo, deleteTodo }) {
  return (
    <div className="todo">

      <div className="check-mark"
        style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
        onClick={() => toggleTodo(index)}>
        {index + 1}. {todo.text}
      </div>
      <div className="btn-wrapper">
        <button onClick={() => deleteTodo(index)}>x</button>
      </div>
    </div>
  );
}




const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};



function App() {


  const [itemsFromBackend, setItemsFromBackend] = useState([
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
    { id: uuid(), content: "Fourth task" },
    { id: uuid(), content: "Fifth task" }
  ]);

  const [todos, seTodos] = useState([
    { text: "Learn about React",
      isCompleted: false },
    { text: "Meet friend for lunch",
      isCompleted: false },
    { text: "Build really cool todo app",
      isCompleted: false }
  ]);


  const columnsFromBackend = {
    "requested": {
      name: "Requested",
      items: itemsFromBackend
    },
    "to-do": {
      name: "To do",
      items: []
    },
    "in-progress": {
      name: "In Progress",
      items: []
    },
    "done": {
      name: "Done",
      items: []
    }
  };



  const [columns, setColumns] = useState(columnsFromBackend);
  const [todoTexts, setTodoTexts] = useState([]);

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  const addTodo = text => {
    setColumns(prev => {
      return {
        ...prev,
        requested: {
          name: "Requested",
          items: [
            ...prev.requested.items,
            {
              id: uuid(),
              content: text
            }
          ]
        }
      }
    })
  }

  const toggleTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    seTodos(newTodos);
  }

  const deleteTodo = (index, columnId) => {
    let itemList = [...columns[columnId].items];
    for (var i = 0; i < itemList.length; i++) {
      if(itemList[i].id === index){
        itemList.splice(i, 1);
      }
    }
    setColumns(prev => {
      return {
        ...prev,
        [columnId]: {
          name: columns[columnId].name,
          items: itemList
        }
      }
    })
    console.log(columnId);
  }

  const saveTodos = () => {
    console.log("saved!");
  }

  return (
    <div className="app">
      <div className="todo-list">
        <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      {item.content}
                                      <div>
                                        <button onClick={() => deleteTodo(item.id, columnId)}>x</button>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
                { (index === 0) && <>
                  <TodoForm addTodo={addTodo} />
                  {/* <button className="save-btn" onClick={() => saveTodos()}>Save</button> */}
                  </>
                }
              </div>
            );
          })}
        </DragDropContext>
      </div>
      </div>
    </div>
  );
}

export default App;
