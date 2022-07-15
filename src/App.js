import "./App.css";
import { useState, useEffect } from "react";
const url = "http://assets.breatheco.de/apis/fake/todos/user/LuisAV";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setlist] = useState([{ label: "Loading..." }]);

  const load = async () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setlist(data);
        console.log("Fetch Load: ", data);
      })
      .catch((err) => console.log("Error"));
  };

  useEffect(() => {
    load();
  }, []);

  const sync = async (dat) => {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dat),
    })
      .then((response) => response.json())
      .then((data) => {
        setlist(dat);
        console.log("Fetch Sync: ", dat);
      })
      .catch((err) => console.log("Error"));
  };

  const handleRemoveItem = (index) => {
    sync(list.filter((_, i) => i !== index));
  };

  const Items = ({ content }) => {
    const total = content.length;
    const items = content.map((item, k) => (
      <li key={k}>
        {item.label}
        <button onClick={() => handleRemoveItem(k)}>X</button>
      </li>
    ));
    return (
      <>
        <ul>{items}</ul>
        <aside>{total} item left</aside>
      </>
    );
  };

  const keyup = (event) => {
    if (event.key === "Enter") {
      setInputValue("");
      if (inputValue !== "") {
        sync([...list, { label: inputValue, done: false }]);
      }
    }
  };
  return (
    <article className="paper">
      <input
        type="text"
        onKeyUp={keyup}
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        placeholder="What needs to be done?"
      />
      <Items content={list} />
    </article>
  );
};
export default App;
