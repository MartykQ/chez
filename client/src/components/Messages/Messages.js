import React from 'react';


const Messages = ({messages, name}) => {
    return (
        <div>
            <div>Messages: </div>
            <div>
                {messages.map((m, i) => <div key={i}>{m.text}</div>)}
            </div>
        </div>
    )
}

export default Messages;