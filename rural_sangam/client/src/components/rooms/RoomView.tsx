import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, Input, LoadingSpinner } from "../common";
import {
  getRoomDetails,
  sendMessage,
  getMessages,
  Room,
  Message,
} from "../../services";

const RoomView: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<string | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load room details
  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) {
        setError("Invalid room ID");
        setLoading(false);
        return;
      }

      try {
        setConnectionStatus("connecting");
        const roomData = await getRoomDetails(roomId);
        setRoom(roomData);
        setMessages(roomData.messages || []);

        if (roomData.messages && roomData.messages.length > 0) {
          lastMessageTimeRef.current =
            roomData.messages[roomData.messages.length - 1].timestamp;
        }

        setConnectionStatus("connected");
        setError(null);
      } catch (error: any) {
        console.error("Failed to load room:", error);
        setError(error.message || "Failed to load room");
        setConnectionStatus("error");

        // Auto redirect after 3 seconds if room not found
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId, navigate]);

  // Optimized polling for new messages
  useEffect(() => {
    if (!roomId || !room || connectionStatus !== "connected") return;

    const pollMessages = async () => {
      try {
        const response = await getMessages(
          roomId,
          lastMessageTimeRef.current || undefined
        );

        if (response.messages && response.messages.length > 0) {
          setMessages((prev) => {
            const newMessages = response.messages.filter(
              (newMsg: Message) =>
                !prev.some((existingMsg) => existingMsg._id === newMsg._id)
            );

            if (newMessages.length > 0) {
              lastMessageTimeRef.current =
                newMessages[newMessages.length - 1].timestamp;
              return [...prev, ...newMessages];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to poll messages:", error);
        // Don't show error for polling failures unless it's persistent
      }
    };

    // Start with immediate poll, then every 2 seconds
    pollMessages();
    pollingRef.current = setInterval(pollMessages, 2000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [roomId, room, connectionStatus]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !roomId || sendingMessage) return;

    const messageText = newMessage.trim();
    setNewMessage(""); // Optimistic UI update
    setSendingMessage(true);

    try {
      const response = await sendMessage(roomId, messageText);

      // Add message to local state immediately
      setMessages((prev) => [...prev, response.message]);
      lastMessageTimeRef.current = response.message.timestamp;
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setNewMessage(messageText); // Restore message on failure
      setError("Failed to send message. Please try again.");

      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOtherParticipant = () => {
    if (!room || !user) return null;

    if (user.user.role === "school") {
      return {
        name: room.volunteerUserId.name,
        role: "volunteer",
      };
    } else {
      return {
        name: room.schoolUserId.name,
        role: "school",
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading collaboration room...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.054 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Room Not Found
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/home")}>Return to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!room) return null;

  const otherParticipant = getOtherParticipant();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Collaboration Session
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {room.requestId.requirementDescription}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {otherParticipant?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {otherParticipant?.role}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  connectionStatus === "connected"
                    ? "bg-green-100 text-green-800"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : connectionStatus === "connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Connection Error"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/home")}
              >
                Exit Room
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Video Call Section - Larger */}
          <div className="col-span-2">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Video Conference
                </h2>
                <div className="text-xs text-gray-500">
                  Powered by Jitsi Meet
                </div>
              </div>

              {/* Jitsi Meet Iframe - Much Larger */}
              <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={`https://meet.jit.si/${room.jitsiRoomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.prejoinPageEnabled=false&config.disableInviteFunctions=true`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  title="Video Conference"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="col-span-1">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {messages.length} messages
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg border">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="mx-auto h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.999-8 8.001 8.001 0 018-8c4.418 0 8 3.582 8 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message._id || index}
                      className={`flex ${
                        message.sender === user?.user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-lg ${
                          message.sender === user?.user._id
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-medium ${
                              message.sender === user?.user._id
                                ? "text-blue-100"
                                : "text-gray-600"
                            }`}
                          >
                            {message.senderName}
                          </span>
                          <span
                            className={`text-xs ${
                              message.sender === user?.user._id
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
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
                  disabled={sendingMessage || connectionStatus !== "connected"}
                  maxLength={500}
                />
                <Button
                  type="submit"
                  disabled={
                    !newMessage.trim() ||
                    sendingMessage ||
                    connectionStatus !== "connected"
                  }
                  loading={sendingMessage}
                  size="sm"
                >
                  Send
                </Button>
              </form>

              {connectionStatus !== "connected" && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {connectionStatus === "connecting"
                    ? "Connecting to chat..."
                    : "Chat unavailable"}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
