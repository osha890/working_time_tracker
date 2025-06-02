import React from "react";
import 'style/user-list.css';

function UserList(props) {
    return (
        <div className="userList">
            {props.users.map(user => {
                return (
                    <div className="userElement" key={user.id}>
                        <p className="id">ID: {user.id}</p>
                        <p className="username">{user.username}</p>

                        {user.extension && user.extension.project ? (
                            <p>Project: {user.extension.project.title}</p>
                        ) : (
                            <p>Project: None</p>
                        )}
                    </div>
                )
            })}
        </div>
    );
}

export default UserList;