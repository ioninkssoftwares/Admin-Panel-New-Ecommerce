import React, { useState, useEffect } from "react";
import SideBar from "../../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    productName: "",
    brand: "",
    subCategories: [],
    selectedCategory: "",
    category: "",
    subCategory: "",
    price: "",
    mrp: "",
    stock: "",
    bestSeller: false,
    featured: false,
    isVerified: false,
    description: "",
    specification: "",
    warrantyPeriod: "",
    images: [],
    gstPerc: "",
    hsnCode: "",
    adminPerc: "",
    finalPrice: "",
    freeUserPerc: "",
    silverUserPerc: "",
    goldUserPerc: "",
    freeUserPrice: "",
    silverUserPrice: "",
    goldUserPrice: "",
    discountCoins: "",
  });

  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.product;
        setProduct({
          productName: data.name,
          brand: data.brand,
          selectedCategory: data.category._id,
          category: data.category,
          subCategory: data.subCategory,
          price: data.price,
          mrp: data.mrp,
          stock: data.stock,
          bestSeller: data.bestSeller,
          featured: data.featured,
          description: data.description,
          specification: data.specification,
          warrantyPeriod: data.warrantyPeriod,
          images: data.productImages,
          gstPerc: data.gstPerc,
          hsnCode: data.hsnCode,
          isVerified: data.isVerified === "true",
          adminPerc: data.addationalPrec,
          finalPrice: data.finalPrice,
          freeUserPrice: data.freeUser,
          silverUserPrice: data.silverUser,
          goldUserPrice: data.goldUser,
          discountCoins: data.discountCoins,
        });

        setSelectedCategory(data.category._id); // Automatically select the category
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllBrands`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const capitalizedBrands = response.data.brands.map((brand) => ({
        ...brand,
        brandName: capitalizeFirstLetter(brand.brandName),
      }));
      setBrands(capitalizedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    }
  };
  const fetchCategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const capitalizedCategories = response.data.categories.map(
        (category) => ({
          ...category,
          categoryName: capitalizeFirstLetter(category.categoryName),
        })
      );
      setCategories(capitalizedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllSubCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubCategories(response.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }
  };
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);
    const selectedCategory = categories.find(
      (cat) => cat._id === selectedCategoryId
    );
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory ? selectedCategory.categoryName : "",
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  const calculateFinalPrice = (price, adminPerc) => {
    return price && adminPerc ? (price * (1 + adminPerc / 100)).toFixed(2) : "";
  };

  const calculateUserPrice = (finalPrice, percentage) => {
    return finalPrice && percentage
      ? (finalPrice * (1 - percentage / 100)).toFixed(2)
      : "";
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        price: value,
        finalPrice: calculateFinalPrice(value, prevProduct.adminPerc),
      }));
    }
  };

  const handleAdminPercChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        adminPerc: value,
        finalPrice: calculateFinalPrice(prevProduct.price, value),
      }));
    }
  };

  const handleDiscountCoinsChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value) && Number(value) <= Number(product.price)) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        discountCoins: value,
      }));
    }
  };

  const handleUserPercChange = (userType, value) => {
    if (
      /^\d*\.?\d*$/.test(value) &&
      Number(value) <= Number(product.adminPerc)
    ) {
      setProduct((prevProduct) => {
        const newPrice = calculateUserPrice(prevProduct.finalPrice, value);
        return {
          ...prevProduct,
          [`${userType}UserPerc`]: value,
          [`${userType}UserPrice`]: newPrice,
        };
      });
    }
  };

  const handleFreeUserPercChange = (e) =>
    handleUserPercChange("free", e.target.value);
  const handleSilverUserPercChange = (e) =>
    handleUserPercChange("silver", e.target.value);
  const handleGoldUserPercChange = (e) =>
    handleUserPercChange("gold", e.target.value);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories();
    }
  }, [selectedCategory]);

  const handleImageChange = (files, index) => {
    if (files) {
      const newImages = [...product.images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(file); // Push the file directly
            setProduct((prevProduct) => ({
              ...prevProduct,
              images: newImages,
            }));
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error converting image to blob:", error);
          toast.error("Failed to convert image to blob");
        }
      }
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages,
    }));
  };

  const calculateTotalPrice = (price, adminPerc) => {
    if (price && adminPerc) {
      return Math.round(
        parseFloat(price) + (parseFloat(price) * parseFloat(adminPerc)) / 100
      );
    }
    return price;
  };

  const handleSubmit = async () => {
    try {
      if (submitting) return;
      setSubmitting(true);
      const token = Cookies.get("token");
      const formData = new FormData();

      formData.append("name", product.productName);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("subCategory", product.subCategory);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("bestSeller", product.bestSeller);
      formData.append("featured", product.featured);
      formData.append("description", product.description);
      formData.append("specification", product.specification);
      formData.append("mrp", product.mrp);
      formData.append("warrantyPeriod", product.warrantyPeriod);
      formData.append("isVerified", product.isVerified);
      // formData.append("gstPerc", product.gstPerc);
      // formData.append("hsnCode", product.hsnCode);
      formData.append("adminPerc", product.adminPerc);
      formData.append("finalPrice", product.finalPrice);
      formData.append("freeUser", product.freeUserPrice);
      formData.append("silverUser", product.silverUserPrice);
      formData.append("goldUser", product.goldUserPrice);
      formData.append("discountCoins", product.discountCoins);
      // Convert all images to blobs before appending them
      const imagePromises = product.images.map(async (image, index) => {
        if (typeof image === "string") {
          // If image is a URL, fetch and convert to blob
          const response = await fetch(image);
          const blob = await response.blob();
          return { blob, index };
        } else {
          // If image is already a blob, return it directly
          return { blob: image, index };
        }
      });

      // Wait for all images to be processed
      const imageBlobs = await Promise.all(imagePromises);

      // Append all images to formData
      imageBlobs.forEach(({ blob, index }) => {
        formData.append(`productImages`, blob, `image${index}.png`);
      });

      // Make the API call with all images included
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Axios sets the correct 'Content-Type' for multipart/form-data
          },
          timeout: 60000, // Increase timeout to 60 seconds
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/productmanagement");
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: checked,
    }));
  };

  return (
    <div className="flex" style={{ display: "flex", marginTop: "5%" }}>
      <ToastContainer />
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Product Name"
              variant="outlined"
              value={product.productName}
              onChange={(e) =>
                setProduct({ ...product, productName: e.target.value })
              }
            />
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                margin: "1%",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                You have Selected:
                <span style={{ color: "#ff6f00", marginLeft: "0.5em" }}>
                  {product.brand
                    ? product.brand.charAt(0).toUpperCase() +
                      product.brand.slice(1)
                    : ""}
                </span>
              </span>
              <FormControl sx={{ flex: 1, marginTop: "0.7%", width: "100%" }}>
                <InputLabel id="brand-label">Select Brand</InputLabel>
                <Select
                  labelId="brand-label"
                  value={product.brand}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      brand: e.target.value,
                    }))
                  }
                  fullWidth
                  variant="outlined"
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand.brandName}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                margin: "1%",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                You have Selected:
                <span style={{ color: "#ff6f00", marginLeft: "0.5em" }}>
                  {product.category && product.category
                    ? capitalizeFirstLetter(product.category)
                    : ""}
                </span>
              </span>
              <FormControl sx={{ flex: 1, marginTop: "0.7%", width: "100%" }}>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  fullWidth
                  variant="outlined"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                margin: "1%",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                You have Selected:
                <span style={{ color: "#ff6f00", marginLeft: "0.5em" }}>
                  {product.subCategory
                    ? product.subCategory.charAt(0).toUpperCase() +
                      product.subCategory.slice(1)
                    : ""}
                </span>
              </span>
              {selectedCategory && (
                <FormControl sx={{ flex: 1, marginTop: "0.7%", width: "100%" }}>
                  <InputLabel id="subcategory-label">
                    Select Sub Category
                  </InputLabel>
                  <Select
                    labelId="subcategory-label"
                    value={product.subCategory}
                    onChange={(e) =>
                      setProduct((prevProduct) => ({
                        ...prevProduct,
                        subCategory: e.target.value,
                      }))
                    }
                    fullWidth
                  >
                    {subCategories
                      .filter(
                        (subCategory) =>
                          subCategory.categoryId === selectedCategory
                      )
                      .map((subCategory) => (
                        <MenuItem
                          key={subCategory._id}
                          value={subCategory.subCategoryName}
                        >
                          {subCategory.subCategoryName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
              {!selectedCategory && (
                <p>To change Subcategory please change the category First</p>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0%",
            }}
          >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Price"
                variant="outlined"
                value={product.price}
                onChange={handlePriceChange}
                style={{ margin: "1%" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Admin Percentage"
                variant="outlined"
                value={product.adminPerc}
                onChange={handleAdminPercChange}
                style={{ margin: "1%" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Total Price"
                variant="outlined"
                value={product.finalPrice}
                disabled
                style={{ margin: "1%" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Discount Coins"
                variant="outlined"
                value={product.discountCoins}
                onChange={handleDiscountCoinsChange}
                style={{ margin: "1%" }}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0%",
            }}
          >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Stock"
                variant="outlined"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
                style={{ margin: "1%" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Warranty Period"
                variant="outlined"
                value={product.warrantyPeriod}
                onChange={(e) =>
                  setProduct({ ...product, warrantyPeriod: e.target.value })
                }
                style={{ margin: "1%" }}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0%",
            }}
          >
            <FormControl fullWidth margin="normal">
              <TextField
                label="GST Percentage"
                variant="outlined"
                value={product.gstPerc}
                disabled
                style={{ margin: "1%" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="HSN Code"
                variant="outlined"
                value={product.hsnCode}
                disabled
                style={{ margin: "1%" }}
              />
            </FormControl>
          </Box>
          {product.finalPrice || product.freeUser ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "0%",
                }}
              >
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Free User Percentage"
                    variant="outlined"
                    value={product.freeUserPerc}
                    onChange={handleFreeUserPercChange}
                    style={{ margin: "1%" }}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label=""
                    variant="outlined"
                    value={product.freeUserPrice}
                    disabled
                    style={{ margin: "1%" }}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "0%",
                }}
              >
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Silver User Percentage"
                    variant="outlined"
                    value={product.silverUserPerc}
                    onChange={handleSilverUserPercChange}
                    style={{ margin: "1%" }}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label=""
                    variant="outlined"
                    value={product.silverUserPrice}
                    disabled
                    style={{ margin: "1%" }}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "0%",
                }}
              >
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Gold User Percentage"
                    variant="outlined"
                    value={product.goldUserPerc}
                    onChange={handleGoldUserPercChange}
                    style={{ margin: "1%" }}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label=""
                    variant="outlined"
                    value={product.goldUserPrice}
                    disabled
                    style={{ margin: "1%" }}
                  />
                </FormControl>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#f9f9f9",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Please enter the admin percentage to select the subscription
                models
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0%",
            }}
          >
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={product.bestSeller}
                    onChange={handleSwitchChange}
                    name="bestSeller"
                  />
                }
                label="Best Seller"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={product.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                  />
                }
                label="Featured"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={product.isVerified}
                    onChange={handleSwitchChange}
                    name="isVerified"
                  />
                }
                label="Verified"
              />
            </FormGroup>
          </Box>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Specification"
              variant="outlined"
              multiline
              rows={4}
              value={product.specification}
              onChange={(e) =>
                setProduct({ ...product, specification: e.target.value })
              }
            />
          </FormControl>

          <Typography variant="h6" gutterBottom>
            Product Images
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    style={{
                      flexBasis: "30%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <input
                      accept=".png, .jpg, .jpeg"
                      style={{ display: "none" }}
                      id={`image-upload-${index}`}
                      type="file"
                      onChange={(e) => handleImageChange(e.target.files, index)}
                    />
                    <label htmlFor={`image-upload-${index}`}>
                      <Button variant="contained" component="span">
                        Select Image {index + 1}
                      </Button>
                    </label>
                    {product.images[index] && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={
                            typeof product.images[index] === "string"
                              ? product.images[index]
                              : URL.createObjectURL(product.images[index])
                          }
                          alt={`Image ${index + 1}`}
                          style={{ width: "100px", height: "auto" }}
                        />

                        <Button
                          variant="outlined"
                          onClick={() => handleImageRemove(index)}
                          sx={{ ml: 1 }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "3%",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ width: "100%" }}
            >
              {submitting ? "Updating..." : "Update Product"}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default EditProduct;
