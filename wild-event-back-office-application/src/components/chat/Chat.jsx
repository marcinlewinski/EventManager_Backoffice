import React, { useState } from 'react';
import { MessageBox, ChatItem, ChatList, Input, Button } from 'react-chat-elements';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    setMessages([...messages, { text: message, type: 'text', position: 'right' }]);
    setMessage('');
  };

  return (
    <div>
      <ChatList
        className='chat-list'
        dataSource={[
          {
            avatar: 'https://facebook.github.io/react/img/logo.svg',
            title: 'Facebook',
            subtitle: 'What are you up to?',
            date: new Date(),
            unread: 0,
          },
        ]}
      />
      <div className="chat-window">
        {messages.map((msg, index) => (
          <MessageBox
            key={index}
            position={msg.position}
            type={msg.type}
            text={msg.text}
          />
        ))}
      </div>
      <Input
        placeholder="Type here..."
        value={message}
        onChange={handleMessageChange}
        rightButtons={
          <Button
            text="Send"
            onClick={handleSendMessage}
          />
        }
      />
    </div>
  );
};

export default Chat;
