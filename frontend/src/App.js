import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header.js";
import HomePage from "./components/homePage/HomePage.js"
import NewOrder from "./components/orders/NewOrder.js";
import EditOrder from "./components/orders/EditOrder.js";
import CustomerAuthentication from "./components/customer/customer.js";
import ReservationForm from "./components/reservation/ReservationForm.js";

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/order/new" element= {<NewOrder/>}> </Route>
        <Route path="/order/:id" element ={<EditOrder/>}> </Route>
        <Route path="/customerCheck/:checkFor" element ={<CustomerAuthentication/>}></Route>
        <Route path="/reservation/new/:customerId" element ={<ReservationForm/>}></Route>

      </Routes>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    </BrowserRouter>   
  );
}
export default App;
