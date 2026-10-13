import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthLayout from "./components/layouts/AuthLayout.jsx";
import StaffLogin from "./pages/auth/StaffLogin.jsx";
import PatientLogin from "./pages/auth/PatientLogin.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";


function App() {


  return (
    <>
     <BrowserRouter>
         <Routes>
                <Route path='/auth' element={<AuthLayout/>}>
                    <Route path='staff/login' element={<StaffLogin/>}/>
                    <Route path='staff/forgot-password' element={<ForgotPassword role="staff"/>}/>
                    <Route path='patient/login' element={<PatientLogin/>}/>
                    <Route path='patient/forgot-password' element={<ForgotPassword role="patient"/>}/>
                    <Route path='forgot-password' element={<ForgotPassword/>}/>
                </Route>
         </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
