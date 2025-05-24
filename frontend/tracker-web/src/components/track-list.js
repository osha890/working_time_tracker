import React from "react";

function TrackList(props) {
    return (
        <React.Fragment>
            {props.tracks.map(track => {
                return (
                    <div className="trackDiv" key={track.id}>
                        <p><strong>User:</strong> {track.user.username}</p>
                        <p><strong>Task:</strong> {track.task.title}</p>
                        <p><strong>In Progress:</strong> {track.is_in_progress ? "Yes" : "No"}</p>
                        <p><strong>From:</strong> {new Date(track.time_from).toLocaleString()}</p>
                        <p><strong>To:</strong> {track.time_to ? new Date(track.time_to).toLocaleString() : "Ongoing"}</p>
                    </div>
                )
            })}
        </React.Fragment>
    );
}

export default TrackList;