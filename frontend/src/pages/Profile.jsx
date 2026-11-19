import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/users/${username}`);
        setProfile(data.user);
        setPosts(data.posts);
        setName(data.user.name);
        setBio(data.user.bio || "");
        setTechStackInput(data.user.techStack?.join(", ") || "");
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        bio,
        techStack: techStackInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const { data } = await API.put("/users/profile", payload);
      setProfile(data);
      updateUser(data);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading)
    return (
      <div className="container">
        <p className="muted-text">Loading profile...</p>
      </div>
    );
  if (!profile)
    return (
      <div className="container">
        <div className="error-banner">Author not found.</div>
      </div>
    );

  return (
    <div className="container profile-container">
      <div className="profile-header-card">
        <div className="profile-top">
          <div className="avatar-large">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="username-handle">@{profile.username}</p>
            <p className="profile-bio">{profile.bio}</p>

            {profile.techStack?.length > 0 && (
              <div className="tag-list" style={{ marginTop: "0.75rem" }}>
                {profile.techStack.map((tech) => (
                  <span key={tech} className="tag-pill">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isOwnProfile && !editing && (
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing && (
          <form
            onSubmit={handleProfileUpdate}
            className="form-stack profile-edit-form"
          >
            <label>
              Display Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Bio
              <textarea
                rows={3}
                maxLength={250}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>
            <label>
              Tech Stack (comma-separated)
              <input
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="React, Node.js, MongoDB, TypeScript"
              />
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <h2 style={{ margin: "2rem 0 1rem" }}>
        Published Articles ({posts.length})
      </h2>
      {posts.length === 0 ? (
        <p className="muted-text">No published articles yet.</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
