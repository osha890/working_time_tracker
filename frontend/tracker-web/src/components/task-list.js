import React from "react";
import 'style/task-list.css';


function TaskList({ tasks }) {
    return (
        <div className="taskList">
            {tasks.map((task) => (
                <div key={task.id} className="taskCard">
                    <div className="taskHeader">
                        <div className="taskTitle">{task.id}: {task.title}</div>
                        <div className="taskStatus">Status: {task.status_display}</div>
                    </div>
                    {task.description && (
                        <div className="taskDescription">{task.description}</div>
                    )}
                    <div className="taskMeta">
                        <span>Project: {task.project.title}</span>
                        <span>Reporter: {task.reporter.username}</span>
                        <span>Assignee: {task.assignee ? task.assignee.username : "Unassigned"}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskList;