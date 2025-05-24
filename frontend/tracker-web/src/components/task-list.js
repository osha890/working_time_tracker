import React from "react";

function TaskList(props) {
    return (
        <React.Fragment>
            {props.tasks.map(task => {
                return (
                    <div className="taskDiv" key={task.id}>
                        <h4>{task.title}</h4>
                        <p>{task.description || "No description provided."}</p>
                        <p>In progress {task.is_in_progress ? "Yes" : "No"}</p>
                        <p>Completed: {task.is_completed ? "Yes" : "No"}</p>
                        {task.user && (
                            <p>Assigned to: {task.user.username}</p>
                        )}
                        <p>Project ID: {task.project}</p>
                    </div>
                )
            })}
        </React.Fragment>
    );
}

export default TaskList;