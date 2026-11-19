import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import API from "../api/axios";
import { Clock, ArrowLeft } from "lucide-react";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${slug}`);
        setPost(data);
      } catch (err) {
        setError(err.response?.data?.message || "Article not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="container">
        <p className="muted-text">Loading article...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <div className="error-banner">{error}</div>
      </div>
    );

  return (
    <article className="container article-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to feed
      </Link>

      <header className="article-header">
        <h1>{post.title}</h1>

        <div className="article-meta">
          <Link to={`/u/${post.author?.username}`} className="author-link">
            <div className="avatar-circle">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{post.author?.name}</strong>
              <span className="post-meta">
                {" "}
                • {new Date(post.createdAt).toLocaleDateString()} •{" "}
                <Clock size={13} style={{ verticalAlign: "middle" }} />{" "}
                {post.readTime} min read
              </span>
            </div>
          </Link>
        </div>

        <div className="tag-list">
          {post.tags?.map((tag) => (
            <span key={tag} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="markdown-body">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default PostDetail;
