
import React from "react";

function UserList(props) {
    return (
        <React.Fragment>
            {props.users.map(user => {
                return (
                    <div className="userDiv" key={user.id}>
                        <h4>{user.username}</h4>

                        {user.extension && user.extension.project ? (
                            <p><strong>Project:</strong> {user.extension.project.title}</p>
                        ) : (
                            <p><strong>Project:</strong> None</p>
                        )}
                    </div>
                )
            })}
        </React.Fragment>
    );
}

export default UserList;