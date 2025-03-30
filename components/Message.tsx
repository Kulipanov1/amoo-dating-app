import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageProps {
  message: {
    id: number;
    text: string;
    sender: 'user' | 'other';
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.otherText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#FF4B6E',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  otherText: {
    color: '#333',
  },
});

export default Message; 