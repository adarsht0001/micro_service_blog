import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

function App() {
    useEffect(() => {
        const data = axios.get();
    });
    return <div>hello world</div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
