import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  DialogContentText,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SideBar from "../../Component/SideBar";

const CategoryComponent = () => {
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropper, setCropper] = useState(null); // State to store image preview
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category ID
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editName, setEditName] = useState("");
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCategory, setIsCategory] = useState(false);

  const handleDeleteClick = (item, category) => {
    setItemToDelete(item);
    setIsCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (isCategory) {
      deleteCategory(itemToDelete._id);
    } else {
      deleteSubcategory(itemToDelete._id);
    }
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
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
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
      setSubcategories(response.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  // Update handleNewSubcategoryChange to set newSubcategoryName state
  const handleNewSubcategoryChange = (e) => {
    setNewSubcategoryName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setImage(blob); // Store the cropped image blob
        const croppedImageUrl = URL.createObjectURL(blob);
        setImagePreview(croppedImageUrl);
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const createCategory = async () => {
    if (!image) {
      toast.error("Please Upload an Image");
    }
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("categoryName", newCategoryName);
      if (image) {
        formData.append("image", image); // Append the cropped image blob
      }
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/category/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchCategories();
      setNewCategoryName("");
      setImage(null);
      setImagePreview(null);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    }
  };

  const createSubcategory = async () => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/subCategory/new`,
        {
          subCategoryName: newSubcategoryName,
          categoryId: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubcategories();
      setNewCategoryName("");
      setSelectedCategory("");
      toast.success("Subcategory created successfully!");
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("Error creating subcategory");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  const deleteSubcategory = async (subcategoryId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/subCategory/${subcategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubcategories();
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error deleting subcategory");
    }
  };
  const handleEditCategory = (category) => {
    setEditData(category);
    setEditName(category.categoryName);
    setEditImage(null); // Reset previous image
    setEditImagePreview(category.image); // Set image preview for existing image
    setEditCategoryOpen(true);
  };

  const handleEditImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setEditImage(selectedImage);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleCropEditImage = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setEditImage(blob); // Store the cropped image blob
        const croppedImageUrl = URL.createObjectURL(blob);
        setEditImagePreview(croppedImageUrl);
      });
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setEditData(subcategory);
    setEditName(subcategory.subCategoryName);
    setEditSubcategoryOpen(true);
  };

  const updateCategory = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      let updatedData = {};

      if (editName !== editData.categoryName) {
        updatedData.categoryName = editName;
      }

      if (editImage) {
        updatedData.image = editImage; // Use the cropped image blob
      }

      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes made");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/category/${editData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchCategories();
      toast.success("Category updated successfully!");
      setEditCategoryOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const updateSubcategory = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      let updatedData = {}; // Object to store updated data

      // Check if name has changed
      if (editName !== editData.subCategoryName) {
        updatedData.subCategoryName = editName;
      }

      // If no changes made, show toast and return without updating
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes made");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/subCategory/${editData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSubcategories();
      toast.success("Subcategory updated successfully!");
      setEditSubcategoryOpen(false);
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Error updating subcategory");
    } finally {
      setLoading(false);
    }
  };

  const renderCategoriesWithSubcategories = () => {
    const filteredCategoriesList = searchQuery
      ? categories.filter((category) =>
          category.categoryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : categories;
    const filteredSubcategoriesList = searchQuery
      ? subcategories.filter((subcategory) =>
          subcategory.subCategoryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : subcategories;

    return filteredCategoriesList.map((category) => {
      const categorySubcategories = filteredSubcategoriesList.filter(
        (subcategory) => subcategory.categoryId === category._id
      );

      return (
        <React.Fragment key={category._id}>
          <TableRow>
            <TableCell>
              <img
                src={category.image}
                alt="image"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                }}
              />
            </TableCell>
            <TableCell>
              <strong>
                {category.categoryName.charAt(0).toUpperCase() +
                  category.categoryName.substring(1)}
              </strong>
            </TableCell>
            <TableCell>
              {categorySubcategories.length > 0 ? (
                categorySubcategories.map((subcategory) => (
                  <div
                    key={subcategory._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ marginRight: "10px" }}>
                      {subcategory.subCategoryName.charAt(0).toUpperCase() +
                        subcategory.subCategoryName.substring(1)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Subcategory Name */}

                      {/* Edit Icon */}
                      <IconButton
                        onClick={() => handleEditSubcategory(subcategory)}
                      >
                        <EditIcon style={{ color: "orange" }} />
                      </IconButton>

                      {/* Delete Icon */}
                      <IconButton
                        onClick={() => handleDeleteClick(subcategory, false)}
                      >
                        <DeleteIcon style={{ color: "orange" }} />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <p>No subcategories</p>
              )}
            </TableCell>
            <TableCell>
              {categorySubcategories.length === 0 && (
                <IconButton onClick={() => handleDeleteClick(category, true)}>
                  <DeleteIcon style={{ color: "red" }} />
                </IconButton>
              )}

              <IconButton onClick={() => handleEditCategory(category)}>
                <EditIcon style={{ color: "red" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <ToastContainer />
      <SideBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          // border: "4px solid #ccc",
        }}
      >
        <div>
          <h3>Create New Category</h3>
          <TextField
            type="text"
            value={newCategoryName}
            onChange={handleNewCategoryChange}
            label="Category Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <input
            accept=".png, .jpg, .jpeg"
            id="category-image"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="category-image">
            <Button
              variant="contained"
              component="span"
              color="primary"
              sx={{ background: "orange" }}
            >
              Upload Image
            </Button>
          </label>

          {imagePreview && (
            <>
              <Cropper
                src={imagePreview}
                style={{ height: 400, width: "100%" }}
                // Cropper.js options
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "10px" }}
                onClick={handleCrop}
              >
                Crop Image
              </Button>
              <img
                style={{ width: "200px", height: "200px", marginTop: "10px" }}
                src={imagePreview}
                alt="Preview"
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ background: "orange", marginLeft: "10%" }}
            onClick={createCategory}
          >
            Create Category
          </Button>
        </div>
        <div>
          <h3 style={{ marginTop: "20px" }}>Create New Subcategory</h3>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            value={newSubcategoryName}
            onChange={handleNewSubcategoryChange}
            label="Subcategory Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ background: "orange", marginTop: "10px" }}
            onClick={createSubcategory}
          >
            Create Subcategory
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ width: "80%", marginTop: 20 }}>
              <div style={{ marginTop: "20px" }}>
                <TextField
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  style={{ width: "30%" }}
                />
              </div>
              <h3>Categories with Subcategories</h3>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Image</TableCell>
                      <TableCell>Category Name</TableCell>
                      <TableCell>Subcategory Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderCategoriesWithSubcategories()}</TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <Dialog
          open={editCategoryOpen}
          onClose={() => setEditCategoryOpen(false)}
        >
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              label="Category Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              onChange={handleEditImageChange}
              accept=".png, .jpg, .jpeg"
            />
            {editImagePreview && (
              <div>
                <Cropper
                  src={editImagePreview}
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  guides={false}
                  cropBoxResizable={true}
                  onInitialized={(instance) => setCropper(instance)}
                />
                <Button onClick={handleCropEditImage}>Crop Image</Button>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditCategoryOpen(false)}>Cancel</Button>
            <Button onClick={updateCategory} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit Subcategory Dialog */}
        <Dialog
          open={editSubcategoryOpen}
          onClose={() => setEditSubcategoryOpen(false)}
        >
          <DialogTitle>Edit Subcategory</DialogTitle>
          <DialogContent>
            <TextField
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              label="Subcategory Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateSubcategory} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this{" "}
              {isCategory ? "category" : "subcategory"}?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="delete-confirmation-buttons">
            <button
              style={{ backgroundColor: "#dc3545" }}
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} autoFocus>
              Delete
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

export default CategoryComponent;
