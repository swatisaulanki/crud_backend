
import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Layout from "./Layout";
import Home from "./Pages/Home";
import ContactsPage from "./Pages/ContactsPage";
import EditContact from "./Pages/EditContact";
import ProtectedRoute from "./Pages/ProtectedRoute";
import ContactForm from "./Pages/ContactForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/add-contact" element={<ContactForm />} />
        <Route path="/contact" element={<ContactsPage />} />
        <Route path="/edit-contact/:id" element={<EditContact />} />
      </Route>
    </Routes>
  );
}

export default App;
