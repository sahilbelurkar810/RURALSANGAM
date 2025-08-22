import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getUserRooms, Room } from "../services";
import { Card, Button, Badge, LoadingSpinner } from "../components/common";

const Home = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Load user's rooms
  useEffect(() => {
    const loadRooms = async () => {
      if (user && user.profile) {
        try {
          setRoomsLoading(true);
          const userRooms = await getUserRooms();
          setRooms(userRooms);
        } catch (error) {
          console.error("Failed to load rooms:", error);
        } finally {
          setRoomsLoading(false);
        }
      }
    };

    loadRooms();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to RuralSangam
          </h1>
          <p className="text-gray-600">
            Connecting rural schools with dedicated volunteers for educational
            excellence.
          </p>
        </div>

        {/* Profile completion prompt */}
        {user && user.user && !user.profile && (
          <Card className="mb-8 border-l-4 border-yellow-400">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-yellow-800">
                  Complete Your Profile
                </h3>
                <p className="text-yellow-700 mt-1">
                  Please complete your profile to start collaborating and
                  accessing all features.
                </p>
                <div className="mt-4">
                  {user.user.role === "school" ? (
                    <Link to="/school/profile">
                      <Button variant="primary">
                        Complete School Profile →
                      </Button>
                    </Link>
                  ) : user.user.role === "volunteer" ? (
                    <Link to="/volunteer/profile">
                      <Button variant="primary">
                        Complete Volunteer Profile →
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Active Collaboration Rooms */}
        {user && user.profile && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Active Collaboration Rooms
                </h2>
                <p className="text-gray-600 mt-1">
                  Real-time video calls and chat with your collaborators
                </p>
              </div>
            </div>

            {roomsLoading ? (
              <Card>
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3 text-gray-600">
                    Loading your rooms...
                  </span>
                </div>
              </Card>
            ) : rooms.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Active Collaboration Rooms
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {user.user.role === "school"
                      ? "When you approve volunteer applications, collaboration rooms will appear here for video calls and chat."
                      : "When schools approve your applications, collaboration rooms will appear here for video calls and chat."}
                  </p>

                  {/* Quick action buttons */}
                  <div className="flex justify-center gap-4">
                    {user.user.role === "school" ? (
                      <>
                        <Link to="/school/requests">
                          <Button variant="outline">View Applications</Button>
                        </Link>
                        <Link to="/school/requests/create">
                          <Button>Create New Request</Button>
                        </Link>
                      </>
                    ) : (
                      <Link to="/volunteer/requests">
                        <Button>Browse Opportunities</Button>
                      </Link>
                    )}
                  </div>
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
                      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
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

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-xs">
                                  {otherParticipant?.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {otherParticipant?.name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {otherParticipant?.role}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Created {formatDate(room.createdAt)}</span>
                            </div>
                          </div>

                          {lastMessage && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <div className="flex items-center gap-2 mb-1">
                                <svg
                                  className="w-4 h-4 text-gray-400"
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
                                <span className="text-xs text-gray-500">
                                  Latest message
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">
                                  {lastMessage.senderName}:
                                </span>{" "}
                                {lastMessage.message.length > 50
                                  ? lastMessage.message.substring(0, 50) + "..."
                                  : lastMessage.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(lastMessage.timestamp)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 ml-6">
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <svg
                                className="w-4 h-4"
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
                              <span>{room.messages?.length || 0} messages</span>
                            </div>
                          </div>

                          <Link to={`/rooms/${room.roomId}`}>
                            <Button
                              size="lg"
                              className="flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Join Room
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Getting Started Section for users with profiles */}
        {user && user.profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.user.role === "school" && (
              <>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="text-center p-6">
                    <div className="text-blue-600 mb-4">
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Create New Request
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Post a new volunteer opportunity for your school
                    </p>
                    <Link to="/school/requests/create">
                      <Button>Create Request</Button>
                    </Link>
                  </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <div className="text-center p-6">
                    <div className="text-green-600 mb-4">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Manage Requests
                    </h3>
                    <p className="text-gray-600 mb-4">
                      View and manage your volunteer requests
                    </p>
                    <Link to="/school/requests">
                      <Button variant="outline">View Requests</Button>
                    </Link>
                  </div>
                </Card>
              </>
            )}

            {user.user.role === "volunteer" && (
              <>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="text-center p-6">
                    <div className="text-blue-600 mb-4">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Browse Opportunities
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Find volunteer opportunities that match your skills
                    </p>
                    <Link to="/volunteer/requests">
                      <Button>Browse Requests</Button>
                    </Link>
                  </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <div className="text-center p-6">
                    <div className="text-green-600 mb-4">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Profile
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Update your volunteer profile and skills
                    </p>
                    <Link to="/volunteer/profile">
                      <Button variant="outline">Edit Profile</Button>
                    </Link>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
