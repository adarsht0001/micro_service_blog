interface EventData {
  Type: "CommentCreated" | "PostCreated";
  Data: {
    ID: string;
    Title: string;
    Content: string;
    PostID: string;
  };
}

type Comments = {
  id: string;
  content: string;
};

interface Post {
  id: string;
  title: string;
  comments: Comments[];
}
