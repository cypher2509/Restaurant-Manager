import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header.js";
import HomePage from "./components/homePage/HomePage.js"
import NewOrder from "./components/orders/NewOrder.js";
import EditOrder from "./components/orders/EditOrder.js";
import CustomerAuthentication from "./components/customer/customer.js";
import ReservationsData from './components/reservation/ReservationsData.js'
import NewReservation from "./components/reservation/NewReservation.js";
import EditReservation from "./components/reservation/EditReservation.js";
import InventoryTable from "./components/inventory/inventoryTable.js";
import OrderedInventory from "./components/inventory/OrderedInventory.js";
import NewInventoryOrder from "./components/inventory/NewOrderInventory.js";
import StaffManagement from "./components/staff/StaffManagement.js";
import NewEmployee from "./components/staff/NewEmployee.js";
import NewShift from "./components/staff/NewShift.js";
import EditShift from "./components/staff/EditShift.js";
import ViewReports from "./components/reports/ViewReports.js";

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/order/new/:customerId" element= {<NewOrder/>}> </Route>
        <Route path="/order/:id" element ={<EditOrder/>}> </Route>
        <Route path="/customerCheck/:checkFor" element ={<CustomerAuthentication/>}></Route>
        <Route path="/reservation/new/:customerId" element ={<NewReservation/>}></Route>
        <Route path="/reservation/edit/:Id" element ={<EditReservation/>}></Route>
        <Route path="/reservations/data/:status" element ={<ReservationsData/>}></Route>
        <Route path="/inventory/data" element ={<InventoryTable/>}></Route>
        <Route path="/inventory/ordered" element ={<OrderedInventory/>}></Route>
        <Route path="/inventory/ordered/new" element ={<NewInventoryOrder/>}></Route>
        <Route path="/staffManagement" element={<StaffManagement/>}></Route>
        <Route path="/employees/new" element={<NewEmployee/>}></Route>
        <Route path="/shifts/new" element={<NewShift />}></Route>
        <Route path="/shifts/edit/:id" element={<EditShift />}></Route>
        <Route path="/reports" element={<ViewReports />}></Route>

      </Routes>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    </BrowserRouter>   
  );
}
export default App;
