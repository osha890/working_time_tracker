import React from "react";

function ProjectList(props) {
    return (
        <React.Fragment>
            {props.projects.map(project => {
                return (
                    <div className="projectDiv" key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                )
            })}
        </React.Fragment>
    )
}

export default ProjectList;