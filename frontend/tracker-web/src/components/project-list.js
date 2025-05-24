import React from "react";

function ProjectList(props) {
    return (
        <div className="projectList">
            {props.projects.map(project => {
                return (
                    <div className="projectCard" key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ProjectList;