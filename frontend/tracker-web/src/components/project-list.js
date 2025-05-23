import React from "react";

function ProjectList(props) {
    return (
        <React.Fragment>
            {props.projects.map(project => {
                return <h3 key={project.id}>{project.title}</h3>
            })}
        </React.Fragment>
    )
}

export default ProjectList;