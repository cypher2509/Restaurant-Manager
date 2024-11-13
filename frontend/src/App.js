import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header.js";
import HomePage from "./components/homePage/HomePage.js"

function App() {
  ; 
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
      </Routes>
    </BrowserRouter>   
    
  );
}
export default App;
