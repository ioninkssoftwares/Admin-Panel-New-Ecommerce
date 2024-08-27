
import React, { ReactElement, useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { AiOutlineClose } from 'react-icons/ai';

// import { useAxios } from "../../../utils/axios";

// import AdminNavbar from "../../Components/navbar/VendorNavbar";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Chip, CircularProgress, FormControlLabel, FormGroup, Switch, Button } from '@mui/material';


import Textarea from '@mui/joy/Textarea';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import InputField from "../../Component/InputField";
import ConfirmBox from "../../Component/vendor/shared/ConfirmDialog";
import axios from "axios";
import SideBar from "../../Component/SideBar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const AddServiceByAdmin = () => {
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [cookies, setCookies] = useCookies(["token"]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    // const [value, setValue] = useState(dayjs('2022-04-17'));
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [filesToupload, setFilesToUpload] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [featuredSwitch, setFeaturedSwitch] = useState(false)
    const [cashOnDeliverySwitch, setCashOnDeliverySwitch] = useState(true);
    // const [statusSwitch, setStatusSwitch] = useState(true);
    const [serviceAttributes, setServiceAttributes] = useState([
        {
            attribute: '',
            subcategories: [{ value: '', price: '' }]
        }
    ]);
    const [service, setService] = useState({
        serviceName: '',
        description: '',
        pricing: [],
        active: false,
        isCashOnDelivery: true
    });
    
 

    // Handler function to update the switch state

    const handleFeaturedSwitch = (event) => {
        setFeaturedSwitch(event.target.checked);
        // setProduct({ ...product, featured: event.target.checked })
    };


    useEffect(() => {
        if (cookies && cookies.token) {
            console.log(cookies.token, "fdsfsdfsf")
            setToken(cookies.token);
        }
    }, [cookies]);



 


   

    if (service) console.log(service, "kjkjk")



   

    const handleProductSubmit = async () => {
        // setLoading(true)
        const token = cookies.token;
        setDeleteLoading(true)

        const flattenedPricing = [];

        serviceAttributes.forEach(attribute => {
            attribute.subcategories.forEach(subcategory => {
                flattenedPricing.push({
                    attribute: attribute.attribute,
                    value: subcategory.value,
                    price: subcategory.price,
                });
            });
        });

        var ProductFormData = new FormData();
        for (let i of filesToupload) {
            ProductFormData.append('serviceImage', i);
        }

        ProductFormData.append('pricing', JSON.stringify(flattenedPricing));
        ProductFormData.append('serviceName', service.serviceName);
        ProductFormData.append('description', service.description);
        ProductFormData.append('isCashOnDelivery', service.isCashOnDelivery);
        ProductFormData.append('active', service.active);


        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/service/new`, ProductFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.data) {
                // setLoading(false)
                setDeleteLoading(false)
                toast("Service has been added")
                setDeleteOpen(false)
                navigate("/servicemanagement")


            }
        } catch (error) {
            console.log(error, "skdfhsjdf")
            // setLoading(false)
            setDeleteLoading(false)
            setDeleteOpen(false)
            toast(error?.response?.data?.message)
        }
    }




    // Image Upload FUnction

    useEffect(() => {
        console.log(filesToupload, "mainImage")
    }, [filesToupload])


    const handleImageChange = (e) => {
        if (e.target.files) {
            setFilesToUpload((prev) => {
                let prevs = [...filesToupload];
                console.log(e.target.files);
                prevs.push(e.target.files[0]);
                console.log(prevs);
                return prevs;
            });
        }
        e.target.files = null;
    };



    const dleteImage = (file) => {
        setFilesToUpload((prev) => {
            let imgs = [...filesToupload];
            const index = imgs.indexOf(file);
            if (index > -1) {
                imgs.splice(index, 1);
            }
            return imgs;
        });
    };

 

    const renderPhotos = (source) => {

        return source.map((photo, index) => {
            return (
                <div
                    className="w-max h-40 flex justify-center items-center  relative max-w-[200px]"
                    key={index}
                >
                    <button
                        onClick={() => {
                            dleteImage(photo);
                        }}
                        className="text-white bg-red-500 h-7 w-7 pt-1 flex rounded-full items-center justify-center absolute top-1 right-0"
                    >
                        x
                    </button>
                    <img
                        className=" h-full object-cover"
                        src={URL.createObjectURL(photo)}
                        alt=""
                        key={photo}
                    />
                </div>
            );
        });
    };

    // Validation Logics


    const validateServiceName = (value) => {
        // Add specific validation logic for product name
        const regex = /^[a-zA-Z ]+$/; // Only allow letters and spaces
        return regex.test(value) ? null : 'Invalid characters in service name';
    };
    const validateAttributeName = (value) => {
        // Add specific validation logic for product name
        const regex = /^[a-zA-Z ]+$/; // Only allow letters and spaces
        return regex.test(value) ? null : 'Invalid characters in main category name';
    };
    const validateValueName = (value) => {
        // Add specific validation logic for product name
        const regex = /^[a-zA-Z ]+$/; // Only allow letters and spaces
        return regex.test(value) ? null : 'Invalid characters in sub category name';
    };

   


    const validateSellingPrice = (value) => {
        // Check if the value contains a decimal point
        if (/\./.test(value)) {
            return ' Price should not contain decimals';
        }

        const floatValue = parseFloat(value);

        // Add specific validation logic for product price
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid price';
        }

        return null;
    };








    if (service) console.log(service, "kjkkkk")

  

        // const handleStatusSwitch = (event) => {
        //     setStatusSwitch(event.target.checked);
        //     setService({ ...service, active: event.target.checked })
        // };
   
    const handleCashOnDeliverySwitch = (event) => {
        setCashOnDeliverySwitch(event.target.checked);
        setService({ ...service, isCashOnDelivery: event.target.checked })
    };








    // if (flattenedPricing) console.log(flattenedPricing, "shubhhhh")

    // Handle change for the main category or subcategories
    const handleAttributeChange = (index, name, value) => {
        const updatedAttributes = [...serviceAttributes];
        updatedAttributes[index][name] = value;
        setServiceAttributes(updatedAttributes);
    };

    const handleSubcategoryChange = (index, subIndex, name, value) => {
        const updatedAttributes = [...serviceAttributes];
        updatedAttributes[index].subcategories[subIndex][name] = value;
        setServiceAttributes(updatedAttributes);
    };

    // Add new main category
    const handleAddAttributes = () => {
        setServiceAttributes([...serviceAttributes, { attribute: '', subcategories: [{ value: '', price: '' }] }]);
    };

    // Add new subcategory to a specific main category
    const handleAddSubcategory = (index) => {
        const updatedAttributes = [...serviceAttributes];
        updatedAttributes[index].subcategories.push({ value: '', price: '' });
        setServiceAttributes(updatedAttributes);
    };

    // Remove a main category
    const handleRemoveAttributes = (index) => {
        const updatedAttributes = [...serviceAttributes];
        updatedAttributes.splice(index, 1);
        setServiceAttributes(updatedAttributes);
    };

    // Remove a subcategory from a specific main category
    const handleRemoveSubcategory = (index, subIndex) => {
        const updatedAttributes = [...serviceAttributes];
        updatedAttributes[index].subcategories.splice(subIndex, 1);
        setServiceAttributes(updatedAttributes);
    };

    const [description, setDescription] = useState('');

    const handleDescriptionChange = (value) => {
        setDescription(value);
        setService({ ...service, description: value });
    };




    return (
        <div>
            <div className='flex h-screen overflow-hidden'>
                <SideBar />
                <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
                    {/* <main> */}
                    <div className='bg-gray-50'>
                        {/* <AdminNavbar /> */}
                        <div className="flex items-center justify-between mx-10 my-5 mt-[100px]">
                            <p>Add Service Details</p>
                            <div className="flex gap-7">
                                {/* <button className="px-4 py-2 rounded-lg text-white bg-black">
                                    Save as Draft
                                </button> */}
                                {loading ? <CircularProgress /> : Object.values(formErrors).some((error) => Boolean(error)) ? null : (<button onClick={() => setDeleteOpen(true)} className="px-4 py-2 rounded-lg text-white bg-primary-blue">
                                    Save & Publish
                                </button>)}
                                {/* <button onClick={() => setDeleteOpen(true)} className="px-4 py-2 rounded-lg text-white bg-primary-blue">
                                    Save & Publish
                                </button> */}
                            </div>
                        </div>

                        <div className="bg-white mx-10  flex  gap-5 ">
                            <div className="basis-[70%] flex gap-10">
                                <div className="basis-[100%] p-10">

                                    <div>
                                        <InputField
                                            label="Service Name"
                                            type="text"
                                            value={service.serviceName}
                                            // onChange={(e) => setService({ ...service, serviceName: e })}
                                            onChange={(value) => {
                                                setService({ ...service, serviceName: value })
                                                setFormErrors({ ...formErrors, serviceName: validateServiceName(value) });
                                            }}
                                            validate={validateServiceName} />

                                        {/* <TextField
                                            label="Description"
                                            multiline
                                            rows={4}
                                            value={service.description}
                                            onChange={(e) => setService({ ...service, description: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                        /> */}
                                        <Typography sx={{ color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                            Description
                                        </Typography>
                                        <ReactQuill
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                    [{ size: [] }],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                    { 'indent': '-1' }, { 'indent': '+1' }],
                                                    ['link', 'image', 'video'],
                                                    ['clean']
                                                ],
                                            }}
                                        />

                                        {/* {serviceAttributes.map((attribute, index) => (
                                            <div key={index} style={{ marginBottom: '16px' }}>
                                                <InputField
                                                    label={`Main Category Name ${index + 1}`}
                                                    type="text"
                                                    value={attribute.attribute}
                                                    onChange={(value) => handleAttributeChange(index, 'attribute', value)}
                                                    validate={validateAttributeName}
                                                />

                                                <InputField
                                                    label={`Sub Category Name ${index + 1}`}
                                                    type="text"
                                                    value={attribute.value}
                                                    onChange={(value) => handleAttributeChange(index, 'value', value)}
                                                    validate={validateValueName}
                                                />

                                                <InputField
                                                    label={`Price ${index + 1}`}
                                                    type="number"
                                                    value={attribute.price}
                                                    onChange={(value) => handleAttributeChange(index, 'price', value)}
                                                    validate={validateSellingPrice}
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveAttributes(index)}
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}

                                        <Button variant="contained" color="primary" onClick={handleAddAttributes}>
                                            Add Category
                                        </Button> */}


                                        <div style={{ marginTop: "24px" }}>
                                            {serviceAttributes.map((attribute, index) => (
                                                <div key={index} style={{ marginBottom: '16px' }}>
                                                    {/* Main Category Input */}
                                                    <InputField
                                                        label={`Main Category Name ${index + 1}`}
                                                        type="text"
                                                        value={attribute.attribute}
                                                        onChange={(value) => handleAttributeChange(index, 'attribute', value)}
                                                        validate={validateAttributeName}
                                                    />
                                                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                                        {attribute.subcategories.map((subcategory, subIndex) => (
                                                            <div key={subIndex} style={{ marginLeft: '20px', marginBottom: '8px', }}>
                                                                {/* Sub Category Input */}
                                                                <Box sx={{ display: "flex", gap: "10px" }}>
                                                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                                        <InputField
                                                                            label={`Sub Category Name ${index + 1}-${subIndex + 1}`}
                                                                            type="text"
                                                                            value={subcategory.value}
                                                                            onChange={(value) => handleSubcategoryChange(index, subIndex, 'value', value)}
                                                                            validate={validateValueName}
                                                                            width="100%"
                                                                        />

                                                                        {/* Price Input */}
                                                                        <InputField
                                                                            label={`Price ${index + 1}-${subIndex + 1}`}
                                                                            type="number"
                                                                            value={subcategory.price}
                                                                            onChange={(value) => handleSubcategoryChange(index, subIndex, 'price', value)}
                                                                            validate={validateSellingPrice}
                                                                            width="100%"
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            onClick={() => handleAddSubcategory(index)}
                                                                            style={{ marginTop: '8px' }}
                                                                        >
                                                                            Add Subcategory
                                                                        </Button>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            onClick={() => handleRemoveSubcategory(index, subIndex)}
                                                                            style={{ marginTop: '8px' }}
                                                                        >
                                                                            Remove Subcategory
                                                                        </Button>


                                                                    </Box>
                                                                </Box>
                                                            </div>
                                                        ))}
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                                        <Button variant="contained" color="success" onClick={handleAddAttributes}>
                                                            Add Category
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => handleRemoveAttributes(index)}
                                                        // style={{ marginTop: '16px' }}
                                                        >
                                                            Remove Category
                                                        </Button>
                                                    </Box>
                                                </div>
                                            ))}


                                        </div>



                                    </div>

                                    {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Typography sx={{ my: 1, color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                            Status
                                        </Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Status"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: 'orange',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: 'orange',
                                                    },
                                                }}
                                                control={<Switch checked={service?.active}
                                                    onChange={handleStatusSwitch} />}

                                            />
                                        </FormGroup>
                                    </Box> */}

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Typography sx={{ my: 1, color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                            Cash on Delivery
                                        </Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Cash On Delivery"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: 'orange',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: 'orange',
                                                    },
                                                }}
                                                control={<Switch checked={cashOnDeliverySwitch}
                                                    onChange={handleCashOnDeliverySwitch} />}

                                            />
                                        </FormGroup>
                                    </Box>
                                    {/* <button className="bg-primary-blue p-2 my-3 text-white" type="button" onClick={handleAddSubCategories}>Add New Category</button> */}


                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Typography sx={{ my: 1, color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                            Discount
                                        </Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Add Discount"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: 'orange',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: 'orange',
                                                    },
                                                }}
                                                control={<Switch checked={featuredSwitch}
                                                    onChange={handleFeaturedSwitch} />}

                                            />
                                        </FormGroup>

                                    </Box>

                                    <Box sx={{ display: "flex", gap: "10px" }}>

                                        {/* <Box sx={{ width: "50%" }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={type}
                                                    label="Age"
                                                    onChange={handleChangeType}
                                                >
                                                    <MenuItem value={10}>1</MenuItem>
                                                    <MenuItem value={20}>2</MenuItem>
                                                    <MenuItem value={30}>3</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box> */}


                                        {/* <Box sx={{ width: "50%" }} >
                                            <InputField
                                                label="Value"
                                                type="text"
                                                value={product?.value}
                                                onChange={(e) => setProduct({ ...product, value: e })}
                                            // validate={validateProductName}
                                            />
                                        </Box> */}
                                    </Box>



                                </div>

                            </div>
                            <div className="basis-[25%] max-w-[380px]  px-7 ">
                                <div>
                                    <div className="mt-12">
                                        <div className="flex items-center flex-col gap-4  w-full ">
                                            <label className=" pb-4 flex flex-col w-full border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                                <div className="flex flex-col items-center justify-center py-7 ">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                        Upload Image
                                                    </p>
                                                    <p className="pt-3 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 text-center">Upload a cover image for your product.</p>
                                                    <p className="  text-sm tracking-wider text-gray-400 group-hover:text-gray-600 text-center">File Format jpeg, png Recommened Size 600x600 (1:1)</p>
                                                </div>
                                                <input
                                                    onChange={handleImageChange}
                                                    type="file"
                                                    className="opacity-0"
                                                />
                                            </label>
                                            <p>Additional Images</p>
                                            <div className="w-full flex items-center justify-center gap-4 max-w-md flex-wrap">
                                                {renderPhotos(filesToupload)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <ConfirmBox
                            title="Add Service"
                            name="add a Service"
                            open={deleteOpen}
                            closeDialog={() => setDeleteOpen(false)}
                            toDoFunction={handleProductSubmit}
                            loading={deleteLoading}
                            sx={{ pb: 4, border: "2px solid red" }}
                        />
                        <ToastContainer />
                    </div>
                </div>
                {/* </main> */}
            </div>
        </div >

        // </div>
    );
};

export default AddServiceByAdmin;
