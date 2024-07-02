import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Cookies from "js-cookie";
import SideBar from "../../Component/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerComponent = () => {
  const [loading, setLoading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [urls, setUrls] = useState([]);
  const [cropperInstances, setCropperInstances] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleCancelCrop = () => {
    // Remove the image from the list of files to upload
    setFilesToUpload((prevFiles) =>
      prevFiles.filter((_, i) => i !== currentIndex)
    );
    setSelectedCategories((prev) => prev.filter((_, i) => i !== currentIndex));
    setUrls((prev) => prev.filter((_, i) => i !== currentIndex));
    setImagePreviews((prev) => prev.filter((_, i) => i !== currentIndex));
    setCroppedImages((prev) => prev.filter((_, i) => i !== currentIndex));
    setCropModalOpen(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllCategories`
      );
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    if (
      filesToUpload.length < 1 ||
      selectedCategories.length < 1 ||
      !selectedOption
    ) {
      toast.error("Please select at least 1 image, category, and banner type");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    croppedImages.forEach((file) => {
      formData.append("bannerImage", file);
    });
    const urlsArray = [];

    selectedCategories.forEach((category, index) => {
      urlsArray.push(urls[index] || "");
    });

    const urlsJson = JSON.stringify(urlsArray);
    formData.append("linkUrl", urlsJson);
    formData.append("subCategory", selectedOption);

    try {
      const token = Cookies.get("token");
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/banner/new`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Banner added successfully");
        window.location.href = "/inventorymanagement";
      } else {
        toast.error(data.message || "Failed to add banner");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while adding the banner");
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    const newPreviews = fileList.map((file) => URL.createObjectURL(file));

    setFilesToUpload((prevFiles) => [...prevFiles, ...fileList]);
    setSelectedCategories((prev) => [
      ...prev,
      ...Array(fileList.length).fill(""),
    ]);
    // setUrls((prev) => [...prev, ...Array(fileList.length).fill("")]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setCropModalOpen(true);
    setCurrentIndex(filesToUpload.length);
  };

  const handleCropImage = () => {
    if (cropperInstances[currentIndex]) {
      cropperInstances[currentIndex].getCroppedCanvas().toBlob((blob) => {
        const croppedImageUrl = URL.createObjectURL(blob);
        setCroppedImages((prev) => {
          const newCroppedImages = [...prev];
          newCroppedImages[currentIndex] = blob;
          return newCroppedImages;
        });
        // setUrls((prev) => {
        //   const newUrls = [...prev];
        //   newUrls[currentIndex] = croppedImageUrl;
        //   return newUrls;
        // });

        if (currentIndex < filesToUpload.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCropModalOpen(false);
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFilesToUpload((prev) => prev.filter((_, i) => i !== index));
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (event, index) => {
    const category = event.target.value;
    setSelectedCategories((prev) => {
      const updatedCategories = [...prev];
      updatedCategories[index] = category;
      return updatedCategories;
    });
  };

  const handleUrlChange = (event, index) => {
    const url = event.target.value;
    setUrls((prev) => {
      const updatedUrls = [...prev];
      updatedUrls[index] = url;
      return updatedUrls;
    });
  };

  const renderImages = () => {
    const maxImages = 6;
    const displayedFiles = filesToUpload.slice(0, maxImages);

    return (
      <Grid container spacing={2}>
        {displayedFiles.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={URL.createObjectURL(file)}
                alt={`Image ${index}`}
              />
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    style={{ marginLeft: "10px" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <TextField
                  label="Add URL"
                  variant="outlined"
                  value={urls[index] || ""}
                  onChange={(e) => handleUrlChange(e, index)}
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <SideBar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          width="100%"
          padding="3rem"
          margin="3%"
        >
          <Typography variant="h4" gutterBottom>
            Add New Banner
          </Typography>
          <Button
            variant="contained"
            component="label"
            style={{ marginBottom: "20px" }}
          >
            Choose Images
            <input
              type="file"
              hidden
              multiple
              onChange={handleImageChange}
              accept=".png, .jpg, .jpeg"
            />
          </Button>
          <Box width="100%" marginBottom="20px">
            {renderImages()}
          </Box>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="banner-type-label">Banner Type</InputLabel>
            <Select
              labelId="banner-type-label"
              value={selectedOption}
              onChange={handleSelectChange}
              label="Banner Type"
            >
              <MenuItem value="">
                <em>Select Banner Type</em>
              </MenuItem>
              <MenuItem value="mainbanner">Main Banner</MenuItem>
              <MenuItem value="productbanner">Product Banner</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
        <ToastContainer />
        <Dialog open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogContent>
            {imagePreviews[currentIndex] && (
              <Cropper
                src={imagePreviews[currentIndex]}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={5 / 2}
                aspectRatio={5 / 2}
                guides={false}
                cropBoxResizable={true}
                onInitialized={(instance) =>
                  setCropperInstances((prev) => {
                    const newInstances = [...prev];
                    newInstances[currentIndex] = instance;
                    return newInstances;
                  })
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCrop}>Cancel</Button>
            <Button onClick={handleCropImage}>Crop</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default BannerComponent;
