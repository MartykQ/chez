import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className="joinRoot">
            <input placeholder="name" className="simpleInput" type="text" onChange={ (e) => setName(e.target.value) }/>
            <input placeholder="room" className="simpleInput" type="text" onChange={ (e) => setRoom(e.target.value) }/>
            <div>{name}</div>
            <div>{room}</div>
            <Link onClick={ e => (!name || !room) ? e.preventDefault() : null} to={`/meet?name=${name}&room=${room}`} >
                <button className="joinBtn" type="submit">Join</button>
            </Link>
        </div>
    )
}

export default Join;