import React from "react";
import 'style/project-list.css';

function ProjectList(props) {
    return (
        <div>
            <div className="projectList">
                {props.projects.map(project => {
                    return (
                        <div className="projectCard" key={project.id}>
                            <h3>{project.id}: {project.title}</h3>
                            <p>{project.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProjectList;