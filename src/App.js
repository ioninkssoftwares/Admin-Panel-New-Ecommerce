import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import OrderManagement from "./Page/OrderManagementSection/OrderManagement";
import ProductManagement from "./Page/Product Management/ProductManagement";
import PaymentsManagementnewproduct from "./Page/Product Management/AddProduct";
import InventoryManagement from "./Page/InventoryMangement/InventoryManagement";
import AgentManagement from "./Page/AgentManagementSection/AgentManagement";
import UserManagement from "./Page/UserManagement/UserManagement";
import Login from "./Page/Login/loginadmin";
import BannerComponent from "./Page/InventoryMangement/addbaneer";
import Coupons from "./Page/Coupon Management/couponcode";
import EditProduct from "./Page/Product Management/editproduct";
import BrandsManagement from "./Page/InventoryMangement/brandmanagement";
import CategoryComponent from "./Page/InventoryMangement/CategoryMangement";
import StaffManagement from "./Page/StaffManagement/Staffmanagement";
import { ToastContainer } from "react-toastify";
import SubscriptionManagement from "./Page/Subscrption/subscription";
import VendorManagement from "./Page/Vendormanagement/vendor";
import GoogleProductTaxonomy from "./Page/Massimport";
import AdminManagement from "./Page/Admin Management/adminManagement";
import ServiceManagement from "./Page/Service Management/ServiceManagement";
import AddServiceByAdmin from "./Page/Service Management/AddServiceByAdmin";
import ServiceOrderManagement from "./Page/Service Order Management/ServiceOrderManagement";
import EditServiceByAdmin from "./Page/Service Management/EditServiceByAdmin";
// import ServiceOrderManagement from "./Page/Service Management/ServiceOrderManagement";

// Function to check if the token exists in cookies
const getTokenFromCookies = () => {
  // Implement logic to get token from cookies and return it
  // For example:
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return token ? token.split("=")[1] : null;
};

// Higher-order component to check if the token exists in cookies
const ProtectedRoute = ({ element }) => {
  const token = getTokenFromCookies();

  // If token exists, render the provided element, else redirect to login
  return token ? element : <Navigate to="/loginadmin" />;
};

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/ordermanagement"
            element={<ProtectedRoute element={<OrderManagement />} />}
          />
          <Route
            path="/productmanagement"
            element={<ProtectedRoute element={<ProductManagement />} />}
          />
          <Route
            path="/usermanagement"
            element={<ProtectedRoute element={<UserManagement />} />}
          />
          <Route
            path="/agentmanagement"
            element={<ProtectedRoute element={<AgentManagement />} />}
          />
          <Route
            path="/brandmanagement"
            element={<ProtectedRoute element={<BrandsManagement />} />}
          />
          <Route path="/massimport" element={<GoogleProductTaxonomy />} />
          <Route
            path="/couponcodes"
            element={<ProtectedRoute element={<Coupons />} />}
          />
          <Route
            path="/editproduct/:id"
            element={<ProtectedRoute element={<EditProduct />} />}
          />
          <Route
            path="/categorymanagement"
            element={<ProtectedRoute element={<CategoryComponent />} />}
          />
          <Route
            path="/addproduct"
            element={
              <ProtectedRoute element={<PaymentsManagementnewproduct />} />
            }
          />
          <Route
            path="/addbanner"
            element={<ProtectedRoute element={<BannerComponent />} />}
          />
          <Route path="/loginadmin" element={<Login />} />
          <Route
            path="/inventorymanagement"
            element={<ProtectedRoute element={<InventoryManagement />} />}
          />
          <Route
            path="/staffmanagement"
            element={<ProtectedRoute element={<StaffManagement />} />}
          />
          <Route
            path="/adminManagement"
            element={<ProtectedRoute element={<AdminManagement />} />}
          />
          <Route
            path="/serviceManagement"
            element={<ProtectedRoute element={<ServiceManagement />} />}
          />
          <Route
            path="/addService"
            element={<ProtectedRoute element={<AddServiceByAdmin />} />}
          />
          <Route
            path="/editService/:id"
            element={<ProtectedRoute element={<EditServiceByAdmin />} />}
          />
          <Route
            path="/serviceOrderManagement"
            element={<ProtectedRoute element={<ServiceOrderManagement />} />}
          />
          <Route
            path="/subscription"
            element={<ProtectedRoute element={<SubscriptionManagement />} />}
          />
          <Route
            path="/vendormanagement"
            element={<ProtectedRoute element={<VendorManagement />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
