import React from "react";
import 'style/track-list.css';

function TrackList(props) {
    return (
        <div className="trackList">
            {/* Заголовки столбцов */}
            <div className="trackHeader">
                <p>User</p>
                <p>Task</p>
                <p>In Progress</p>
                <p>From</p>
                <p>To</p>
            </div>

            {/* Данные */}
            {props.tracks.map(track => (
                <div className="trackElement" key={track.id}>
                    <p>{track.user.username}</p>
                    <p>{track.task.title}</p>
                    <p>{track.is_in_progress ? "Yes" : "No"}</p>
                    <p>{new Date(track.time_from).toLocaleString()}</p>
                    <p>{track.time_to ? new Date(track.time_to).toLocaleString() : "Ongoing"}</p>
                </div>
            ))}
        </div>
    );
}

export default TrackList;
