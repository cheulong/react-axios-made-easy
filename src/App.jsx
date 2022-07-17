import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
// Axios global
axios.defaults.headers.common["Authorization"] = "AUTH_TOKEN";

function App() {
  const [posts, setPosts] = useState(null);

  //Get Request
  const getPosts = async () => {
    const res = await axios.get(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );
    const data = res.data;
    setPosts(data);
  };

  //Post Request
  const addPost = async () => {
    const res = await axios.post("https://jsonplaceholder.typicode.com/posts", {
      title: "My New Post",
      body: "This is my new post",
    });
    const data = res.data;
    setPosts([data, ...posts]);
  };

  //Put Request
  const updatePost = async ({ id = 1 }) => {
    const res = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        title: "Updated Post",
      }
    );
    const data = res.data;
    setPosts(posts.map((post) => (post.id === id ? { ...data } : post)));
  };

  //Patch Request
  const patchPost = async ({ id = 1 }) => {
    const res = await axios.patch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        title: "Updated Post",
      }
    );
    const data = res.data;
    setPosts(posts.map((post) => (post.id === id ? { ...data } : post)));
  };

  //Delete Request
  const deletePost = async ({ id = 1 }) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    setPosts(posts.filter((post) => post.id !== id));
  };

  //Simultaneous Requests
  const getPostAndGetTodo = async () => {
    const res = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=1"),
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=1"),
    ]);
    const data = res.map((res) => res.data);
    setPosts(data);
  };

  // Intercepting Requests and Responses
  axios.interceptors.request.use(
    (config) => {
      console.log("Request: ", config.method.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.log("Request Error: ", error);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handling Errors
  const handlingError = async () => {
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/postss?_limit=5"
      );
      const data = res.data;
      setPosts(data);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  // Custom Headers
  const addPostWithCustomHeaders = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 12345",
      },
    };
    const res = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: "My New Post",
        body: "This is my new post",
      },
      config
    );
    const data = res.data;
    setPosts([data, ...posts]);
  };

  // Cancel Request
  const cancelRequest = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    await axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=5", {
        signal,
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Request Aborted");
          return "Request Aborted ";
        }
        return error;
      });

    if (true) {
      controller.abort();
    }
  };

  // Axios Instance
  const axiosInstance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 12345",
    },
  });

  return (
    <div>
      <button onClick={getPosts}>Get Posts</button>
      <button onClick={addPost}>Add Post</button>
      <button onClick={updatePost}>Update Post</button>
      <button onClick={patchPost}>Patch Post</button>
      <button onClick={deletePost}>Delete Post</button>
      <button onClick={getPostAndGetTodo}>Simultaneous Requests</button>
      <button onClick={addPostWithCustomHeaders}>Custom Headers</button>
      <button onClick={handlingError}>Handling Errors</button>
      <button onClick={cancelRequest}>Cancel Request</button>
      {posts &&
        posts.map((post) => (
          <>
            <div key={post.id}>{JSON.stringify(post)}</div>
            <br />
          </>
        ))}
    </div>
  );
}

export default App;
