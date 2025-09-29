import React, { useState, useEffect } from "react";
import { createChallenge } from "../../api/challenges"; // ✅ adjust if path differs
import apiClient from "../../api/apiClient"; // ✅ for fetching rooms

const AdminPanel = ({ onChallengeCreated }) => {
  const [challenge, setChallenge] = useState({
    title: "",
    description: "",
    testcase: "",
    difficulty: "easy",
    tags: [],
  });
  const [rooms, setRooms] = useState([]); // ✅ available rooms
  const [roomId, setRoomId] = useState("default"); // ✅ selected room
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Fetch available rooms on mount
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await apiClient.get("/rooms"); // ✅ your backend must expose GET /api/rooms
        setRooms(res.data.data || []); // expect { success, data }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("⚠️ Failed to load rooms.");
      }
    }
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const trimmed = {
      title: challenge.title.trim(),
      description: challenge.description.trim(),
      testcase: challenge.testcase.trim(),
    };

    const missingField = Object.entries(trimmed).find(([_, val]) => !val);
    if (missingField) {
      setError(`⚠️ Please fill in the "${missingField[0]}" field.`);
      return;
    }

    const resolvedRoomId =
      roomId === "default" || !roomId ? 1 : Number.parseInt(roomId, 10);

    if (!Number.isInteger(resolvedRoomId)) {
      setError("❌ Invalid Room ID.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const payload = {
        ...challenge,
        ...trimmed,
        roomId: resolvedRoomId, // ✅ lowercase matches backend
      };

      const res = await createChallenge(payload);
      setFeedback("✅ Challenge created successfully.");
      setChallenge({
        title: "",
        description: "",
        testcase: "",
        difficulty: "easy",
        tags: [],
      });
      setRoomId("default");
      onChallengeCreated?.();
    } catch (err) {
      console.error("Create challenge error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "❌ Failed to create challenge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-3">➕ Create Challenge</h2>

      {error && <p className="text-red-600">{error}</p>}
      {feedback && <p className="text-green-600">{feedback}</p>}

      <input
        type="text"
        name="title"
        value={challenge.title}
        onChange={handleChange}
        placeholder="Challenge Title"
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="description"
        value={challenge.description}
        onChange={handleChange}
        placeholder="Challenge Description"
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="testcase"
        value={challenge.testcase}
        onChange={handleChange}
        placeholder="Test Case"
        className="w-full mb-2 p-2 border rounded"
      />

      {/* Room Selector */}
      <select
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="default">Default Room</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name} (ID: {room.id})
          </option>
        ))}
      </select>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Challenge"}
      </button>
    </div>
  );
};

export default AdminPanel;
