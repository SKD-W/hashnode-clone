import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import API from "../api/axios";
import { Eye, Edit3, Send, Save } from "lucide-react";

const Editor = () => {
  const { slug } = useParams(); // Present if editing an existing post
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const loadPost = async () => {
      try {
        const { data } = await API.get(`/posts/${slug}`);
        setPostId(data._id);
        setTitle(data.title);
        setContent(data.content);
        setTagsInput(data.tags?.join(", ") || "");
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load post for editing",
        );
      }
    };
    loadPost();
  }, [slug, isEditing]);

  const handleSave = async (targetStatus) => {
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and Markdown content.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      title,
      content,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: targetStatus,
    };

    try {
      if (isEditing && postId) {
        const { data } = await API.put(`/posts/${postId}`, payload);
        navigate(
          targetStatus === "published" ? `/post/${data.slug}` : "/dashboard",
        );
      } else {
        const { data } = await API.post("/posts", payload);
        navigate(
          targetStatus === "published" ? `/post/${data.slug}` : "/dashboard",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container editor-container">
      <div className="editor-toolbar">
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${!previewMode ? "active" : ""}`}
            onClick={() => setPreviewMode(false)}
          >
            <Edit3 size={15} /> Write
          </button>
          <button
            type="button"
            className={`tab-btn ${previewMode ? "active" : ""}`}
            onClick={() => setPreviewMode(true)}
          >
            <Eye size={15} /> Preview
          </button>
        </div>

        <div className="editor-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => handleSave("draft")}
          >
            <Save size={15} /> Save Draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={() => handleSave("published")}
          >
            <Send size={15} /> {isEditing ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!previewMode ? (
        <div className="editor-form">
          <input
            type="text"
            className="editor-title-input"
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            className="editor-tags-input"
            placeholder="Tags (comma-separated, e.g. react, nodejs, mongodb)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />

          <textarea
            className="editor-textarea"
            placeholder="Write your technical article in Markdown... (Use ```js for syntax-highlighted code blocks)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      ) : (
        <div className="editor-preview markdown-body">
          <h1>{title || "Untitled Article"}</h1>
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={oneDark}
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
            {content || "*Nothing to preview yet.*"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Editor;
