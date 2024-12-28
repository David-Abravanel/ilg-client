import React, { useEffect, useState } from "react";
import {
  getPosts,
  updateComment,
  deleteAllPosts,
  fetchPosts,
} from "../api/axiosCentral";
import "./table.css";
import { Popup } from "./Popup";

const Table = () => {
  const [data, setData] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("onOrder");
  const [searchValue, setSearchValue] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const getAllPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await getPosts();
        if (posts && Array.isArray(posts)) {
          setBaseData(posts);
        } else {
          console.error("Error: Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllPosts();
  }, []);

  useEffect(() => {
    const filteredData = baseData.filter((bd) => {
      if (typeof bd[sortField] === "string") {
        return bd[sortField].toLowerCase().includes(searchValue.toLowerCase());
      }
      return false;
    });
    setData(filteredData);
  }, [searchValue, sortField, baseData]);

  const sortedData = [...data].sort((a, b) => {
    if (sortField === "id" || sortField === "userId") {
      return sortOrder === "onOrder"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else if (sortField === "title" || sortField === "body") {
      return sortOrder === "onOrder"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    return 0;
  });

  const addComment = async (id, comment) => {
    setIsLoading(true);
    try {
      const res = await updateComment(id, "comments", comment);
      if (res.status === "success") {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, comments: comment } : item
          )
        );
        setPopupData(null);
        setIsPopupOpen(false);
      } else {
        console.error("Error: can't update comment");
      }
    } catch (error) {
      console.error("Error updating comment: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePosts = async () => {
    setIsLoading(true);
    try {
      const res = await deleteAllPosts();
      if (res.status === "success") {
        setBaseData([]);
      }
    } catch (error) {
      console.error("Error deleting data from DB: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const posts = await fetchPosts();
      if (posts && Array.isArray(posts)) {
        setBaseData(posts);
      }
    } catch (error) {
      console.error("Error fetching data and save on DB: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortOrder = () => {
    setSortOrder(sortOrder === "onOrder" ? "reverseOrder" : "onOrder");
  };

  return (
    <div>
      <h1>Posts Table</h1>
      <h3>
        Total posts: ({baseData.length}) |:::| View posts: ({data.length})
      </h3>

      <div className="sort-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <select
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="body">Body</option>
        </select>
        <button onClick={handleSortOrder}>Toggle Order ({sortOrder})</button>
        <button onClick={deletePosts}>Delete all Posts</button>
        <button onClick={fetchData}>Add Posts to DB and Fetch</button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      <div className="table-container">
        <div className="scroll-wrapper">
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Body</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.title}</td>
                  <td>{d.body}</td>
                  <td
                    onClick={() => {
                      setPopupData(d);
                      setIsPopupOpen(true);
                    }}
                  >
                    {d.comments || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <h2>Add Comment for ID {popupData?.id}</h2>
        <textarea
          value={popupData?.comments || ""}
          onChange={(e) =>
            setPopupData({ ...popupData, comments: e.target.value })
          }
        />
        <div className="popup-buttons">
          <button
            onClick={() => {
              setPopupData(null);
              setIsPopupOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => addComment(popupData.id, popupData.comments || "")}
          >
            Save Comment
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default Table;
