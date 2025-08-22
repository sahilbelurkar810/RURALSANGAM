import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, LoadingSpinner } from '../common';
import { getRoomDetails, sendMessage, getMessages, Room, Message } from '../../services';

const RoomView: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load room details
  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) return;
      
      try {
        const roomData = await getRoomDetails(roomId);
        setRoom(roomData);
        setMessages(roomData.messages || []);
      } catch (error) {
        console.error('Failed to load room:', error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId, navigate]);

  // Poll for new messages
  useEffect(() => {
    if (!roomId || !room) return;

    const pollMessages = async () => {
      try {
        const lastMessageTime = messages.length > 0 
          ? messages[messages.length - 1].timestamp 
          : undefined;
        
        const response = await getMessages(roomId, lastMessageTime);
        
        if (response.messages && response.messages.length > 0) {
          setMessages(prev => [...prev, ...response.messages]);
        }
      } catch (error) {
        console.error('Failed to poll messages:', error);
      }
    };

    // Poll every 2 seconds
    pollingRef.current = setInterval(pollMessages, 2000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [roomId, room, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !roomId || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await sendMessage(roomId, newMessage.trim());
      setMessages(prev => [...prev, response.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipant = () => {
    if (!room || !user) return null;
    
    if (user.user.role === 'school') {
      return {
        name: room.volunteerUserId.name,
        role: 'volunteer'
      };
    } else {
      return {
        name: room.schoolUserId.name,
        role: 'school'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Room not found</p>
            <Button onClick={() => navigate('/home')} className="mt-4">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Collaboration Room
        </h1>
        <p className="text-gray-600">
          {room.requestId.requirementDescription}
        </p>
        <p className="text-sm text-gray-500">
          Collaborating with: {otherParticipant?.name} ({otherParticipant?.role})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Call Section */}
        <Card className="h-96">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Video Call</h2>
          </div>
          
          {/* Jitsi Meet Iframe */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://meet.jit.si/${room.jitsiRoomName}#config.startWithAudioMuted=true&config.startWithVideoMuted=true`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera; microphone; fullscreen; display-capture"
              title="Video Call"
              className="w-full h-full"
            />
          </div>
        </Card>

        {/* Chat Section */}
        <Card className="h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2 p-2 bg-gray-50 rounded">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === user?.user._id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.sender === user?.user._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.senderName}
                      </span>
                      <span className={`text-xs ${
                        message.sender === user?.user._id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendingMessage}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sendingMessage}
              loading={sendingMessage}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RoomView;
