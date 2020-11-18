import React from 'react';

const TodoItem = ({todo}) => {
    return (
        <div className="todo">
            {todo.text}
        </div>
    );
}

export default TodoItem;
