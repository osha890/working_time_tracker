import React from "react";

function TaskList(props) {
    return (
        <div className="taskList">
            {props.tasks.map(task => {
                return (
                    <div className="taskCard" key={task.id}>
                        <div>
                            <div className="taskHedaer">
                                <h4>{task.title}</h4>
                                {task.is_completed ? (
                                    <div className="completed">Completed</div>
                                ) : task.is_in_progress ? (
                                    <div className="inProgress">In progress</div>
                                ) : null}
                            </div>
                            <p>{task.description || "No description provided."}</p>
                            <p><b>Project: {task.project.title}</b></p>
                        </div>

                        {task.user && (
                            <div>
                                <p>Assigned to: {task.user.username}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
}

export default TaskList;