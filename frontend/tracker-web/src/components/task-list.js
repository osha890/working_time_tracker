import React from "react";

function TaskList(props) {
    return (
        <div>
            <div className="addButton">Add task</div>
            <div className="taskList">
                {props.tasks.map(task => {
                    return (
                        <div className={`taskCard ${task.is_completed ? 'completed' :
                            task.is_in_progress ? 'inProgress' :
                                'pending'
                            }`} key={task.id}>
                            <div>
                                <div className="taskHedaer">
                                    <h4>{task.title}</h4>
                                </div>
                                <p>{task.description || "No description provided."}</p>
                                <p><b>Project: {task.project.title}</b></p>
                            </div>

                            {task.user && (
                                <div>
                                    <p>Assigned to: {task.user.username}</p>
                                    {task.is_completed ? (
                                        <div>Completed</div>
                                    ) : task.is_in_progress ? (
                                        <div>In progress</div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default TaskList;