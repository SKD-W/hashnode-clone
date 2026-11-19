import { useEffect, useState } from "react";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import { Search, X } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (selectedTag) params.tag = selectedTag;

        const { data } = await API.get("/posts", { params });
        setPosts(data);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPosts, 250);
    return () => clearTimeout(debounce);
  }, [search, selectedTag]);

  // Extract unique tags from loaded posts for quick filtering
  const popularTags = [...new Set(posts.flatMap((p) => p.tags || []))].slice(
    0,
    10,
  );

  return (
    <div className="container main-layout">
      <div className="feed-column">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles by title, content, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>
              <X size={16} />
            </button>
          )}
        </div>

        {selectedTag && (
          <div className="active-filter">
            <span>
              Filtering by tag: <strong>#{selectedTag}</strong>
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedTag("")}
            >
              Clear filter
            </button>
          </div>
        )}

        {loading ? (
          <p className="muted-text">Loading developer feed...</p>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No articles found</h3>
            <p>Try clearing your search or be the first to write a post!</p>
          </div>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onTagClick={(tag) => setSelectedTag(tag)}
              />
            ))}
          </div>
        )}
      </div>

      <aside className="sidebar-column">
        <div className="sidebar-card">
          <h3>Explore Tags</h3>
          {popularTags.length === 0 ? (
            <p className="muted-text">
              Tags will appear as articles are published.
            </p>
          ) : (
            <div className="tag-list">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-pill ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Home;
