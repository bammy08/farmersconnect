/* eslint-disable @typescript-eslint/no-explicit-any */
import { commentService } from '@/services/comment/commentService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define Comment Interface
interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name?: string;
  };
  createdAt: string;
  parentCommentId?: string;
  replies?: Comment[];
}

// Define Comment State
interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Fetch Comments
export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: string }
>('comments/fetchComments', async (productId, { rejectWithValue }) => {
  try {
    return await commentService.fetchComments(productId);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || 'Failed to load comments'
    );
  }
});

// Post Comment / Reply
export const postComment = createAsyncThunk<
  Comment,
  {
    productId: string;
    content: string;
    token: string;
    userId: string; // ✅ Added userId
    parentCommentId?: string;
  },
  { rejectValue: string }
>(
  'comments/postComment',
  async (
    { productId, content, token, userId, parentCommentId },
    { rejectWithValue }
  ) => {
    try {
      return await commentService.postComment(
        productId,
        content,
        token,
        userId, // ✅ Ensure userId is included
        parentCommentId
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to post comment'
      );
    }
  }
);

// Edit Comment
export const editComment = createAsyncThunk<
  Comment,
  { commentId: string; content: string; token: string },
  { rejectValue: string }
>(
  'comments/editComment',
  async ({ commentId, content, token }, { rejectWithValue }) => {
    try {
      return await commentService.editComment(commentId, content, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to edit comment'
      );
    }
  }
);

// Delete Comment
export const deleteComment = createAsyncThunk<
  string,
  { commentId: string; token: string },
  { rejectValue: string }
>(
  'comments/deleteComment',
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId, token);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete comment'
      );
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetched Comments:', action.payload);
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load comments';
      })

      // Post Comment
      .addCase(postComment.fulfilled, (state, action) => {
        if (action.payload.parentCommentId) {
          // If it's a reply, find the parent comment and add the reply
          const parentComment = state.comments.find(
            (c) => c._id === action.payload.parentCommentId
          );
          if (parentComment) {
            parentComment.replies = parentComment.replies || []; // ✅ Ensure it's always an array
            parentComment.replies.push(action.payload);
          }
        } else {
          // If it's a top-level comment, add it to the list
          state.comments.unshift(action.payload);
        }
      })

      // Edit Comment
      .addCase(editComment.fulfilled, (state, action) => {
        const updateComment = (commentList: Comment[]): Comment[] => {
          return commentList.map((c) =>
            c._id === action.payload._id
              ? { ...c, content: action.payload.content }
              : { ...c, replies: updateComment(c.replies || []) }
          );
        };
        state.comments = updateComment(state.comments);
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const filterComments = (commentList: Comment[]): Comment[] => {
          return commentList
            .filter((c) => c._id !== action.payload)
            .map((c) => ({
              ...c,
              replies: filterComments(c.replies || []),
            }));
        };
        state.comments = filterComments(state.comments);
      });
  },
});

export default commentSlice.reducer;
