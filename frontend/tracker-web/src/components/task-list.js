import React from "react";
import 'style/task-list.css';

function TaskList(props) {
    return (
        <div>
            {/* <div className="addButton">Add task</div> */}
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
                            <div>
                                <p>Reported by: {task.reporter.username}</p>
                                {task.assignee && (
                                    <React.Fragment>
                                        <p>Assigned to: {task.assignee.username}</p>
                                        <div className="status">
                                        {task.is_completed ? (
                                            <p>Completed</p>
                                        ) : task.is_in_progress ? (
                                            <p>In progress</p>
                                        ) : null}
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default TaskList;