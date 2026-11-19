import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const PostCard = ({ post, onTagClick }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="post-card">
      {post.author && (
        <div className="post-author-row">
          <Link to={`/u/${post.author.username}`} className="author-link">
            <div className="avatar-circle">
              {post.author.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="author-name">{post.author.name}</span>
              <span className="post-meta"> • {formattedDate}</span>
            </div>
          </Link>
        </div>
      )}

      <Link to={`/post/${post.slug}`} className="post-title-link">
        <h2>{post.title}</h2>
      </Link>

      <p className="post-excerpt">{post.excerpt}</p>

      <div className="post-footer">
        <div className="tag-list">
          {post.tags?.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-pill"
              onClick={() => onTagClick && onTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
        <span className="read-time">
          <Clock size={14} /> {post.readTime || 1} min read
        </span>
      </div>
    </article>
  );
};

export default PostCard;
