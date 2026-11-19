import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { Edit, Trash2, CheckCircle, Plus } from "lucide-react";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'published' | 'draft'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await API.get("/posts/my-posts");
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePublishNow = async (postId) => {
    try {
      const { data } = await API.put(`/posts/${postId}`, {
        status: "published",
      });
      setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
    } catch (error) {
      console.error("Failed to publish draft:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const filteredPosts = posts.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Your Articles & Drafts</h1>
          <p className="subtitle">
            Manage your published stories and work-in-progress drafts.
          </p>
        </div>
        <Link className="btn btn-primary" to="/write">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="tab-group" style={{ marginBottom: "1.5rem" }}>
        {["all", "published", "draft"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {tab === "all"
              ? posts.length
              : posts.filter((p) => p.status === tab).length}
            )
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted-text">Loading your dashboard...</p>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No {filter === "all" ? "articles" : `${filter}s`} yet</h3>
          <p>Start writing your next technical post to see it here.</p>
        </div>
      ) : (
        <div className="dashboard-list">
          {filteredPosts.map((post) => (
            <div key={post._id} className="dashboard-item">
              <div>
                <div className="dashboard-title-row">
                  <Link
                    to={
                      post.status === "published"
                        ? `/post/${post.slug}`
                        : `/edit/${post.slug}`
                    }
                    className="dashboard-post-title"
                  >
                    {post.title}
                  </Link>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </div>
                <span className="post-meta">
                  Last updated {new Date(post.updatedAt).toLocaleDateString()} •{" "}
                  {post.readTime} min read
                </span>
              </div>

              <div className="dashboard-actions">
                {post.status === "draft" && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePublishNow(post._id)}
                    title="Publish immediately"
                  >
                    <CheckCircle size={14} /> Publish
                  </button>
                )}
                <Link
                  className="btn btn-ghost btn-sm"
                  title="Edit"
                  to={`/edit/${post.slug}`}
                >
                  <Edit size={15} />
                </Link>
                <button
                  className="btn btn-ghost btn-sm danger"
                  onClick={() => handleDelete(post._id)}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
