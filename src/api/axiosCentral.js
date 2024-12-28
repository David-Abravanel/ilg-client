import {
  genericDelete,
  genericGet,
  genericPatch,
  genericPost,
} from "./axiosCentralBase";

// Fetch and store posts from API
export const fetchPosts = async () => {
  const url = "/posts/fetch";
  return await genericPost({}, url);
};

export const deleteAllPosts = async () => {
  const url = "/posts/delete-all";
  return await genericDelete({}, url);
};

// Get all posts
export const getPosts = async () => {
  const url = "/posts";
  return await genericGet({}, url);
};

// Get all posts
export const updateComment = async (postId, field, value) => {
  const url = "/posts/update/" + postId;
  const payload = {
    field: field,
    value: value,
  };
  return await genericPatch(payload, url);
};
