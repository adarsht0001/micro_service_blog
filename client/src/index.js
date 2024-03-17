import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";

function App() {
    const [posts, setPosts] = useState({});
    const [refetch, setRefetch] = useState(true);
    useEffect(() => {
        axios.get("http://localhost:3000/posts").then((res) => {
            setPosts(res.data);
        });
    }, [refetch]);

    return (
        <>
            <div className="container">
                <CreatePost cb={() => setRefetch(!refetch)} />
                <div className="post_wrapper">
                    {Object.values(posts).map((post) => {
                        return <PostView key={post.id} data={post} />;
                    })}
                </div>
            </div>
        </>
    );
}

function CreatePost({ cb }) {
    const [title, setTitle] = useState("");
    const handleSubmit = async () => {
        axios
            .post("http://localhost:3000/posts", { title })
            .then((res) => {
                alert("post created");
                setTitle("");
                cb();
            })
            .catch((err) => console.log(err));
    };
    return (
        <>
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button className="button" onClick={handleSubmit}>
                    Create Post
                </button>
            </div>
        </>
    );
}

function PostView({ data }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const handleSubmit = async () => {
        axios
            .post(`http://localhost:3001/post/${data.id}/comments`, {
                content,
            })
            .then((res) => {
                alert("comment created");
                setContent("");
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        axios
            .get(`http://localhost:3001/post/${data.id}/comments`)
            .then((res) => {
                setComments(res.data);
            });
    }, []);
    return (
        <>
            <div className="post-div">
                <h2>{data.title}</h2>
                {comments.map((comment) => {
                    return <div key={comment.id}>{comment.content}</div>;
                })}

                <div>
                    <input
                        type="text"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button className="button" onClick={handleSubmit}>
                        Add comment
                    </button>
                </div>
            </div>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
