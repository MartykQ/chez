import { Card } from '@material-ui/core';
import React from 'react';


const Messages = ({messages, name}) => {
    return (
        <div>
            <div>Messages: </div>
            <div>
                {messages.map((m, i) => <Card key={i} variant="outlined">{m.text}</Card>)}
            </div>
        </div>
    )
}

export default Messages;