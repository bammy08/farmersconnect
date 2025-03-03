import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const commentService = {
  /** Fetch comments and replies for a product */
  async fetchComments(productId: string) {
    const res = await axios.get(`${API_URL}/comments/${productId}`);
    return res.data;
  },

  /** Post a new comment or a reply */
  async postComment(
    productId: string,
    content: string,
    token: string,
    parentCommentId?: string // Optional for replies
  ) {
    const res = await axios.post(
      `${API_URL}/comments`,
      { productId, content, parentCommentId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  /** Edit an existing comment */
  async editComment(commentId: string, content: string, token: string) {
    const res = await axios.put(
      `${API_URL}/comments/edit/${commentId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  /** Delete a comment (also removes replies if it's a parent comment) */
  async deleteComment(commentId: string, token: string) {
    const res = await axios.delete(`${API_URL}/comments/delete/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
