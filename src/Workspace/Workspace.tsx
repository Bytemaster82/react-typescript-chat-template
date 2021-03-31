import { Divider, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import Chat from '../components/Chat/Chat';
import Controls from './Controls';
import DataView from './DataView';
import { v4 as uuid } from 'uuid';
import { sentences } from '../assets/sentences';
import { DateTime } from 'luxon';
import {
  IChat,
  IChatMessage,
  ChatTopicType,
  ChatStatusType,
  ChatChannelType,
  CommsType,
} from '../interfaces';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controls: {
    height: '100%',
    maxWidth: '450px',
    minWidth: '100px',
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    border: '1px solid ' + theme.palette.divider,
    padding: theme.spacing(1),
  },
  chat: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
  },
}));

const Workspace = () => {
  const classes = useStyles();

  const [chatData, setChatData] = useState([] as IChat[]);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [selectedChatid, setSelectedChatid] = useState(null);
  const [selectedChatdata, setSelectedChatdata] = useState({} as IChat);

  const mockMessage = (userId, message): IChatMessage => {
    let content;
    if (message !== '') {
      content = message;
    } else {
      content = sentences[Math.floor(Math.random() * sentences.length)];
    }
    return {
      chatMessageId: uuid(),
      authorId: userId,
      content: content,
      read: false,
      createdAt: DateTime.local(),
    };
  };

  const handleAddNewMessage = (message) => {
    const index = chatData.findIndex((x) => x.chatId === selectedChatid);
    const new_message = mockMessage(currentAuthor, message);
    let lastchat = chatData;
    lastchat[index]['messages'] = [...lastchat[index]['messages'], new_message];
    lastchat['lastMessage'] = new_message;
    setChatData([...lastchat]);
    setSelectedChatdata({...lastchat[index]});
  };

  const handleChatClicked = (chatID) => {
    setSelectedChatid(chatID);
    const index = chatData.findIndex((x) => x.chatId === chatID);
    setSelectedChatdata(chatData[index]);
  };

  const newchat = (userId, topic, message) => {
    const chatID = uuid();
    const newmessage = mockMessage(userId, message);
    const newchatdata = {
      chatId: chatID as string,
      channel: 'SMS' as ChatChannelType,
      currentResponders: [],
      status: 'Open' as ChatStatusType,
      messages: [newmessage],
      topic: topic as ChatTopicType,
      commsType: 'Chat' as CommsType,
      createdAt: DateTime.local(),
      lastMessage: newmessage,
    };
    setChatData([...chatData, newchatdata]);
  };

  const handleClearAll = (_) => {
    setChatData([] as IChat[]);
  };

  const handleUserIdChange = ($event) => {
    if ($event.target.value.trim() === '') {
      setCurrentAuthor(null);
    } else {
      setCurrentAuthor($event.target.value);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.chat}>
        <Chat
          chatData={chatData}
          selectedChatdata={selectedChatdata}
          sendmessage={handleAddNewMessage}
          newchat={newchat}
          handleChatClicked={handleChatClicked}
        />
      </div>
      <div className={classes.controls}>
        <Controls
          onAddMessage={handleAddNewMessage}
          onClearAll={handleClearAll}
          onUserIdChange={handleUserIdChange}
        />
        <Divider />
        <DataView data={chatData} />
      </div>
    </div>
  );
};

export default Workspace;
