import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Card, Button, Badge, LoadingSpinner } from "../common";
import { getUserRooms, Room } from "../../services";

const RoomsList: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsData = await getUserRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const getOtherParticipant = (room: Room) => {
    if (!user) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Collaboration Rooms
        </h1>
        <p className="text-gray-600">
          Active rooms where you can chat and video call with collaborators.
        </p>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.999-8 8.001 8.001 0 018-8c4.418 0 8 3.582 8 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active rooms
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.user.role === "school"
                ? "When you approve volunteer applications, collaboration rooms will be created here."
                : "When schools approve your applications, collaboration rooms will appear here."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => {
            const otherParticipant = getOtherParticipant(room);
            const lastMessage =
              room.messages && room.messages.length > 0
                ? room.messages[room.messages.length - 1]
                : null;

            return (
              <Card
                key={room.roomId}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {room.requestId.requirementDescription.length > 60
                          ? room.requestId.requirementDescription.substring(
                              0,
                              60
                            ) + "..."
                          : room.requestId.requirementDescription}
                      </h3>
                      <Badge variant="success">Active</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>
                        📞 With: <strong>{otherParticipant?.name}</strong> (
                        {otherParticipant?.role})
                      </span>
                      <span>🕐 Created: {formatDate(room.createdAt)}</span>
                    </div>

                    {lastMessage && (
                      <div className="text-sm text-gray-500">
                        💬 Last message:{" "}
                        <em>
                          "
                          {lastMessage.message.length > 50
                            ? lastMessage.message.substring(0, 50) + "..."
                            : lastMessage.message}
                          "
                        </em>
                        <span className="ml-2">
                          - {formatDate(lastMessage.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-gray-500">
                      <div>{room.messages?.length || 0} messages</div>
                    </div>

                    <Link to={`/rooms/${room.roomId}`}>
                      <Button>Join Room</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomsList;
