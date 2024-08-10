
import React, { ReactElement, useEffect, useState } from "react";

import { toast } from "react-toastify";
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
import { Chip, CircularProgress, FormControlLabel, FormGroup, Switch } from '@mui/material';


import Textarea from '@mui/joy/Textarea';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import InputField from "../../Component/InputField";
import ConfirmBox from "../../Component/vendor/shared/ConfirmDialog";
import axios from "axios";
import SideBar from "../../Component/SideBar";


export const Button = ({
    name,
    Icon,
    Color,
}) => {
    return (
        <div
            className={
                Color +
                " bg-white font-bold w-full rounded-sm shadow-sm flex space-x-1 items-center justify-center px-4 p-1 max-w-max border border-[#DEDEDE]"
            }
        >
            <div className="text-xs">{<Icon />}</div>
            <div>
                <p className=" text-[10px]">{name}</p>
            </div>
        </div>
    );
};

const userTypes = ["All", "Premium"];
const rows = [
    { id: 1, totalOrder: 10000, name: 'Blutooth Devices', price: 14, totalSales: 123456 },
    { id: 2, totalOrder: 10000, name: 'Airpods', price: 31, totalSales: 123456 },
    { id: 3, totalOrder: 10000, name: 'Neck Band', price: 71, totalSales: 123456 },
    { id: 4, totalOrder: 10000, name: 'IR Remote', price: 31, totalSales: 123456 },
    { id: 5, totalOrder: 10000, name: 'Smart Watch', price: 40, totalSales: 123456 },
    { id: 6, totalOrder: 10000, name: 'Power Bank', price: 150, totalSales: 123456 },
];

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        renderCell: (params) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircleIcon style={{ marginRight: '5px' }} />
                {params.value}
            </div>
        ),
        editable: true,
    },
    {
        field: 'totalOrder',
        headerName: 'Total Order',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'totalSales',
        headerName: 'Total Sales',
        type: 'number',
        width: 110,
        editable: true,
    },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //         `${params.row.firstName || ''} ${params.row.totalOrder || ''}`,
    // },
];

// give main area a max widht
const AddServiceByAdmin = () => {
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [cookies, setCookies] = useCookies(["vendorToken"]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    // const [value, setValue] = useState(dayjs('2022-04-17'));
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [deleteId, setDeleteId] = useState("");
    // const instance = useAxios(token);
    const [users, setUsers] = useState([]);

    const [pagination, setPagination] = useState(
        null
    );
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 50,
    });
    const [name, setName] = useState("");
    const [selected, setSelected] = useState("All");
    const [filesToupload, setFilesToUpload] = useState([]);
    const [colorFilesToUpload, setColorFilesToUpload] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [product, setProduct] = useState({
        stock: 0,
        name: "",
        price: 0,
        description: "",
        category: "",
        brand: "",
        specification: "",
        featured: false,
        bestSeller: false,
        subCategory: "",
        // mrp: 0,
        warrantyPeriod: "",
        hsnCode: "",
        gstPerc: 0,
        // gender,
        // costPrice: 0,
        // returnPolicy: true
    })
    const [returnSwitch, setReturnSwitch] = useState(true);
    const [discountSwitch, setDiscountSwitch] = useState(true);
    const [featuredSwitch, setFeaturedSwitch] = useState(true);
    const [bestSellerSwitch, setBestSellerSwitch] = useState(true);
    const [allBrands, setAllBrands] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allColors, setAllColors] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    // const [subCategories, setSubCategories] = useState([]);


    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [vendorId, setVendorId] = useState('');
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedColorsIds, setSelectedColorsIds] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');

    const brandOptions = ["boys", "kids", "girls", "mens", "womens", "toddlers"];

    if (Array.isArray(selectedColorsIds)) {
        console.log(selectedColorsIds, 'Selected Color IDs');
    } else {
        console.log('selectedColorIds is not an array');
    }

    // if (selectedColorsIds) console.log(selectedColorsIds, 'sdfdsfd');
    if (sizes) console.log(sizes, 'sadasd');

    const genderOptions = ['men', 'women', 'boys', 'girls'];
    const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];



    const [subCategories, setSubCategories] = useState([{ name: '', price: '' }]);


    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
        // setProduct({ ...product, gender: event.target.value });
    };


    const handleSizeChange = (event) => {
        setSizes(event.target.value);
    };

    const handleColorChange = (event) => {
        const selectedHexCodes = event.target.value;
        const selectedColorObjects = selectedHexCodes.map(hexCode => colors.find(color => color.hexCode === hexCode));
        console.log(selectedColorObjects, 'dfdfdfdfdfsfsa');
        setSelectedColors(selectedColorObjects);

        //selecting Ids
        const colorIds = selectedColorObjects.map(color => color._id);

        setSelectedColorsIds(colorIds);



        setProduct({ ...product, color: selectedColorObjects });
    };




    const handleSubCategoryChange = (index, event) => {
        const values = [...subCategories];
        values[index][event.target.name] = event.target.value;
        setSubCategories(values);
    };

    const handleAddSubCategories = () => {
        setSubCategories([...subCategories, { name: '', price: '' }]);
    };

    const handleRemoveSubCategories = (index) => {
        const values = [...subCategories];
        values.splice(index, 1);
        setSubCategories(values);
    };


    const handleBrandChange = (event) => {
        console.log(event.target.value, "dsljfdslkj")
        const selectedBrandId = event.target.value;
        setSelectedBrand(selectedBrandId);

        // If you need to update your product state as well
        setProduct({ ...product, brand: selectedBrandId });
    };
    // const handleCategoryChange = (event) => {
    //     const selectedCategoryName = event.target.value;
    //     setSelectedCategory(selectedCategoryName);

    //     // If you need to update your product state as well
    //     setProduct({ ...product, category: selectedCategoryName });
    // };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const selectedCategory = allCategories.find(category => category._id === categoryId);
        setSelectedCategory(categoryId); // Update selected category ID
        setSelectedCategoryName(selectedCategory ? selectedCategory.categoryName : ""); // Update selected category name
    };


    // const handleSubCategoryChange = (event) => {
    //     const selectedSubCategoryName = event.target.value;
    //     setSelectedSubCategory(selectedSubCategoryName);

    //     // If you need to update your product state as well
    //     setProduct({ ...product, subCategoryName: selectedSubCategoryName });
    // };



    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                if (selectedCategory) {
                    // const response = await instance.get(
                    //     `/admin/getSubCategoryByCategoryId/${selectedCategory}`,
                    // );
                    // setSubCategories(response.data.data); // Update to response.data.data
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                toast.error("Failed to fetch subcategories");
            }
        };

        fetchSubCategories();
    }, [selectedCategory]);


    if (product) console.log(product, "dsfjdslk")

    // Handler function to update the switch state
    const handleReturnSwitch = (event) => {
        setReturnSwitch(event.target.checked);
        console.log(event.target.checked, "jfhasdjkfhsdajk")
        setProduct({ ...product, returnPolicy: event.target.checked })
    };
    const handleDiscountSwitch = (event) => {
        setDiscountSwitch(event.target.checked);
        setProduct({ ...product, Discount: event.target.checked })
    };
    const handleFeaturedSwitch = (event) => {
        setFeaturedSwitch(event.target.checked);
        setProduct({ ...product, featured: event.target.checked })
    };
    const handleBestSellerSwitch = (event) => {
        setBestSellerSwitch(event.target.checked);
        setProduct({ ...product, bestSeller: event.target.checked })
    };



    if (product) {
        console.log(product, "dsfhdkjf")
    }

    const productCategories = [
        'Smartphones',
        'TV & Audio',
        'Laptops & PCs',
        'Gadgets',
        'Photo & Video',
        'Gifts',
        'Books',
        'Toys',
    ];


    useEffect(() => {
        if (cookies && cookies.vendorToken) {
            console.log(cookies.vendorToken, "fdsfsdfsf")
            setToken(cookies.vendorToken);
        }
    }, [cookies]);



    const handleCategory = (event) => {
        console.log(event.target.value, "sjfhsdhfk")
        setProduct({
            ...product,
            category: event.target.value
        });
    };

    const handleProductSubmit = async () => {
        // setLoading(true)
        setDeleteLoading(true)
        var ProductFormData = new FormData();
        for (let i of filesToupload) {
            ProductFormData.append('productImages', i);
        }

        for (let i of colorFilesToUpload) {
            ProductFormData.append('moreColorImages', i);
        }
        for (let i of sizes) {
            ProductFormData.append('sizes', i);
        }
        for (let i of selectedColorsIds) {
            ProductFormData.append('colors', i);
        }

        ProductFormData.append('name', product.name);
        ProductFormData.append('category', selectedCategoryName);
        ProductFormData.append('stock', product.stock);
        ProductFormData.append('price', product.price);
        ProductFormData.append('bestSeller', product.bestSeller);
        ProductFormData.append('featured', product.featured);
        // ProductFormData.append('specification', specifications);
        ProductFormData.append('description', product.description);
        ProductFormData.append('brand', product.brand);
        ProductFormData.append('subCategory', product.subCategory);
        // ProductFormData.append('mrp', product.mrp);
        ProductFormData.append('warrantyPeriod', product.warrantyPeriod);
        ProductFormData.append('vendorId', vendorId);
        ProductFormData.append('gstPerc', product.gstPerc);
        ProductFormData.append('hsnCode', product.hsnCode);
        // ProductFormData.append('sizes', sizes);
        ProductFormData.append('gender', selectedGender);
        // ProductFormData.append('colors', selectedColorsIds);

        try {
            // const res = await instance.post("/admin/product/new", ProductFormData, {
            //     // const res = await instance.post("http://localhost:8000/api/v1//admin/product/new", ProductFormData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // if (res.data) {
            //     // setLoading(false)
            //     setDeleteLoading(false)
            //     console.log(res.data, "sdfhadjkf")
            //     toast("Product has been added")
            //     setDeleteOpen(false)
            //     navigate("/vendor/productManagement")


            // }
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


    const handleColorImageChange = (e) => {
        if (e.target.files) {
            setColorFilesToUpload((prev) => {
                let prevs = [...colorFilesToUpload];
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

    const dleteColorImage = (file) => {
        setColorFilesToUpload((prev) => {
            let imgs = [...colorFilesToUpload];
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

    const renderColorPhotos = (source) => {

        return source.map((photo, index) => {
            return (
                <div
                    className="w-max h-40 flex justify-center items-center  relative max-w-[200px]"
                    key={index}
                >
                    <button
                        onClick={() => {
                            dleteColorImage(photo);
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


    const validateProductName = (value) => {
        // Add specific validation logic for product name
        const regex = /^[a-zA-Z ]+$/; // Only allow letters and spaces
        return regex.test(value) ? null : 'Invalid characters in product name';
    };
    // const validateCategory = (value) => {
    //     // Only allow lowercase letters, exclude uppercase, spaces, and symbols
    //     const regex = /^[a-z]+$/;
    //     return regex.test(value) ? null : 'Invalid characters in category (Accepts only lowercase letters)';
    // };
    const validateCategory = (value) => {
        // Allow lowercase letters and spaces, exclude uppercase and symbols
        const regex = /^[a-z\s]+$/;
        return regex.test(value) ? null : 'Invalid characters in category (Accepts only lowercase letters and spaces)';
    };

    const validateBrand = (value) => {
        // Allow letters and white spaces
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(value) ? null : 'Invalid characters in brand';
    };
    const validateBrandName = (value) => {
        // Add specific validation logic for product name
        const regex = /^[a-zA-Z ]+$/; // Only allow letters and spaces
        return regex.test(value) ? null : 'Invalid characters in brand name';
    };

    // Numeric Regex Logic
    // const validateSellingPrice = (value) => {
    //     const floatValue = parseFloat(value);

    //     // Add specific validation logic for product price
    //     if (isNaN(floatValue) || floatValue <= 0) {
    //         return 'Invalid selling price';
    //     }

    //     return null;
    // };
    const validateSellingPrice = (value) => {
        // Check if the value contains a decimal point
        if (/\./.test(value)) {
            return 'Selling price should not contain decimals';
        }

        const floatValue = parseFloat(value);

        // Add specific validation logic for product price
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid selling price';
        }

        return null;
    };
    const validateCostPrice = (value) => {
        const floatValue = parseFloat(value);

        // Add specific validation logic for product price
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid cost price';
        }

        return null;
    };
    const validateQuantity = (value) => {
        const floatValue = parseFloat(value);

        // Add specific validation logic for product price
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid quantity';
        }

        return null;
    };


    async function getAllBrands() {
        try {
            console.log(token, "jsakdfjkladsj")

            setLoading(true);
            // const res = await instance.get(
            //     `/admin/getAllBrands`
            // );
            // if (res.data) {
            //     setAllBrands(res.data.brands)
            //     setLoading(false);
            // }
        } catch (e) {
            setLoading(false);
            console.log(e)
            // ErrorDispaly(e);
        }
    }

    async function getAllCategories() {
        try {
            console.log(token, "jsakdfjkladsj")

            setLoading(true);
            // const res = await instance.get(
            //     `/admin/getAllCategories`
            // );
            // if (res.data) {
            //     setAllCategories(res.data.categories)
            //     setLoading(false);
            // }
        } catch (e) {
            setLoading(false);
            console.log(e)
            // ErrorDispaly(e);
        }
    }

    async function getAllColors() {
        try {
            console.log(token, "jsakdfjkladsj")

            setLoading(true);
            // const res = await instance.get(
            //     `/admin/getAllColors`
            // );
            // if (res.data) {
            //     setAllColors(res.data.data)
            //     setLoading(false);
            // }
        } catch (e) {
            setLoading(false);
            console.log(e)
            // ErrorDispaly(e);
        }
    }


    // async function getAllSubCategories() {
    //     try {
    //         console.log(token, "jsakdfjkladsj")

    //         setLoading(true);
    //         const res = await instance.get(
    //             `/admin/getAllSubCategories`
    //         );
    //         if (res.data) {
    //             setAllSubCategories(res.data.subcategories)
    //             setLoading(false);
    //         }
    //     } catch (e) {
    //         setLoading(false);
    //         console.log(e)
    //         // ErrorDispaly(e);
    //     }
    // }


    const getVendorDetails = async () => {
        console.log(token, "tokeeen")
        try {
            // const res = await instance.get(
            //     `/vendor/getVendorIdByToken`
            // );
            // if (res.data) {
            //     console.log(res.data.id, "yuyiyui")
            //     setVendorId(res.data.id)
            // }
        } catch (e) {
            setLoading(false);
            console.log(e)
            // ErrorDispaly(e);
        }
    }


    useEffect(() => {
        getAllBrands();
        getAllCategories();
        getAllColors();
        getVendorDetails();
    }, [token]);



    const sampleColors = [
        { name: 'Red', hexCode: '#FF0000' },
        { name: 'Green', hexCode: '#00FF00' },
        { name: 'Blue', hexCode: '#0000FF' },
        { name: 'Yellow', hexCode: '#FFFF00' },
        { name: 'Orange', hexCode: '#FFA500' },
        { name: 'Purple', hexCode: '#800080' },
        { name: 'Pink', hexCode: '#FFC0CB' },
        { name: 'Brown', hexCode: '#A52A2A' },
        { name: 'Gray', hexCode: '#808080' },
        { name: 'Black', hexCode: '#000000' },
    ];

    const sampleSizes = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];



    useEffect(() => {
        setColors(allColors)
        // setSizes(sampleSizes)
    }, [allColors])



    const [type, setType] = useState('');

    const handleChangeType = (event) => {
      setType(event.target.value);
    };

    const [value, setValue] = useState('');

    const handleChangeValue = (event) => {
      setValue(event.target.value);
    };





    return (
        <div>
            <div className='flex h-screen overflow-hidden'>
                <SideBar />
                <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
                    {/* <main> */}
                    <div className='bg-gray-50'>
                        {/* <AdminNavbar /> */}
                        <div className="flex items-center justify-between mx-10 my-5">
                            <p>Add Service Details</p>
                            <div className="flex gap-7">
                                {/* <button className="px-4 py-2 rounded-lg text-white bg-black">
                                    Save as Draft
                                </button> */}
                                {loading ? <CircularProgress /> : Object.values(formErrors).some((error) => Boolean(error)) ? null : (<button onClick={() => setDeleteOpen(true)} className="px-4 py-2 rounded-lg text-white bg-primary-blue">
                                    Save & Publish
                                </button>)}
                            </div>
                        </div>

                        <div className="bg-white mx-10  flex  gap-5 ">
                            <div className="basis-[70%] flex gap-10">
                                <div className="basis-[100%] p-10">
                                    {/* <Typography sx={{ my: 1, color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                        Product Name
                                    </Typography> */}

                                    <InputField
                                        label="Service Name"
                                        type="text"
                                        value={product?.name}
                                        onChange={(e) => setProduct({ ...product, name: e })}
                                    // validate={validateProductName}
                                    />

                                    {/* <InputField
                                        label="Brand"
                                        type="text"
                                        value={product?.brand}
                                        onChange={(value) => {
                                            setProduct({ ...product, brand: value });
                                            setFormErrors({ ...formErrors, brand: validateBrand(value) });
                                        }}
                                        validate={validateBrand}
                                    /> */}

                                    {/* //  Brand */}
                                    {/* <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="brand-select-label">Select Brand</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="brand-select"
                                            value={selectedBrand}
                                            onChange={handleBrandChange}
                                            label="Brand"
                                        // sx={{ w: '100%' }}
                                        >
                                            {allBrands?.map((brand) => (
                                                <MenuItem key={brand._id} value={brand.brandName}>
                                                    {brand.brandName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}



                                    {/* <Typography sx={{ my: 1, color: "gray" }} id="modal-modal-title" variant="p" component="p">
                                        Category
                                    </Typography> */}

                                    {/* <InputField
                                        label="Category"
                                        type="text"
                                        value={product?.category}
                                        onChange={(value) => {
                                            setProduct({ ...product, category: value });
                                            setFormErrors({ ...formErrors, category: validateCategory(value) });
                                        }}
                                        validate={validateCategory}
                                    /> */}

                                    {/* <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="brand-select-label">Select Category</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="brand-select"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            label="Category"
                                        // sx={{ w: '100%' }}
                                        >

                                            {allCategories?.map((category) => (
                                                <MenuItem key={category._id} value={category._id}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}


                                    {/* <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="subCategory-select-label">Select Sub Category</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="subCategory-select"
                                            value={selectedSubCategory}
                                            onChange={handleSubCategoryChange}
                                            label="Category"
                                        // sx={{ w: '100%' }}
                                        >

                                            {subCategories?.map((category) => (
                                                <MenuItem key={category._id} value={category.subCategoryName}>
                                                    {category.subCategoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}







                                    {/* <InputField
                                        label="Sub Category"
                                        type="text"
                                        value={product?.subCategory}
                                        onChange={(e) => setProduct({ ...product, subCategory: e })}
                                    // validate={validateCategory}
                                    /> */}



                                    {/* <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Product Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={product?.category}
                                            label="Select Customer"
                                            onChange={handleCategory}
                                        >
                                            {productCategories && productCategories.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                // style={getStyles(name, personName, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}


                                    <Textarea sx={{ padding: 0, borderRadius: 1, marginBottom: 3 }} onChange={(event) => setProduct({
                                        ...product,
                                        description: event.target.value
                                    })} placeholder="Short Description" minRows={6} />


                                    <InputField
                                        label="Service Category Name"
                                        type="text"
                                        value={product?.category}
                                        onChange={(e) => setProduct({ ...product, category: e })}
                                    // validate={validateProductName}
                                    />

                                    {/* 
                                    <div>

                                        {subCategories.map((subCategory, index) => (
                                            <div key={index}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2 w-1/2">
                                                        <input
                                                            type="text"

                                                            value={subCategory}
                                                            onChange={(event) => handleSubCategoryChange(index, event)}
                                                            placeholder={`Sub-Category Name ${index + 1}`}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={specification}
                                                            onChange={(event) => handleSubCategoryChange(index, event)}
                                                            placeholder={`Sub-Category Price ${index + 1}`}
                                                        />
                                                    </div>
                                                    <div>
                                                    <button className="mb-2 bg-primary-blue" type="button" onClick={() => handleRemoveSubCategories(index)}>Remove</button>

                                                    </div>

                                                </div>


                                            </div>
                                        ))}
                                        <button className="bg-primary-blue" type="button" onClick={handleAddSUbCategories}>Add SubCategory</button>
                                    </div> */}

                                    <div>
                                        {subCategories.map((subCategory, index) => (
                                            <div key={index}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2 w-1/2">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={subCategory.name}
                                                            onChange={(event) => handleSubCategoryChange(index, event)}
                                                            placeholder={`Sub-Category Name ${index + 1}`}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            value={subCategory.price}
                                                            onChange={(event) => handleSubCategoryChange(index, event)}
                                                            placeholder={`Sub-Category Price ${index + 1}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button className="mb-2 p-2 text-white bg-primary-blue" type="button" onClick={() => handleRemoveSubCategories(index)}>Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="bg-primary-blue p-2 text-white" type="button" onClick={handleAddSubCategories}>Add SubCategory</button>
                                    </div>

                                    <button className="bg-primary-blue p-2 my-3 text-white" type="button" onClick={handleAddSubCategories}>Add New Category</button>

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

                                    <Box sx={{display:"flex", gap:"10px"} }>

                                        <Box sx={{width:"50%"}}>
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
                                        </Box>


                                        <Box sx={{width:"50%"}} >
                                        <InputField
                                        label="Value"
                                        type="text"
                                        value={product?.value}
                                        onChange={(e) => setProduct({ ...product, value: e })}
                                    // validate={validateProductName}
                                    />
                                        </Box>
                                    </Box>



                                    {/* <Box sx={{ display: "flex", gap: 2 }}>

                                        <InputField
                                            label=" Price"
                                            type="number"
                                            value={product.price}
                                     
                                            onChange={(value) => {
                                                setProduct({ ...product, price: +value })
                                                setFormErrors({ ...formErrors, price: validateSellingPrice(value) });
                                            }}
                                            validate={validateSellingPrice} />

                              
                                        <InputField label="Stock"
                                            type="number"
                                            value={product.stock}
                                      
                                            onChange={(value) => {
                                                setProduct({ ...product, stock: +value })
                                                setFormErrors({ ...formErrors, stock: validateSellingPrice(value) });
                                            }}
                                            validate={validateSellingPrice} />


                                    </Box> */}

                                    {/* {!brandOptions.includes(selectedBrand) && <Box sx={{ display: "flex", gap: 2 }}>

                                        <FormControl fullWidth>
                                            <InputLabel id="warranty-period-label">Warranty Period</InputLabel>
                                            <Select
                                                labelId="warranty-period-label"
                                                id="warranty-period-select"
                                                value={product.warrantyPeriod}
                                                onChange={(event) => {
                                                    setProduct({ ...product, warrantyPeriod: event.target.value });
                                                }}
                                                label="Warranty Period"
                                            >
                                                <MenuItem value="6 months">3 months</MenuItem>
                                                <MenuItem value="6 months">6 months</MenuItem>
                                                <MenuItem value="12 months">12 months</MenuItem>
                                                <MenuItem value="18 months">18 months</MenuItem>
                                                <MenuItem value="24 months">24 months</MenuItem>
                                                <MenuItem value="36 months">36 months</MenuItem>
                                            </Select>
                                        </FormControl>


                                    </Box>} */}


                                    {/* {brandOptions.includes(selectedBrand) && <div className="my-4">
                                        <FormControl fullWidth>
                                            <InputLabel id="multiple-sizes-label">Sizes</InputLabel>
                                            <Select
                                                labelId="multiple-sizes-label"
                                                multiple
                                                value={sizes.map((sizeObj) => sizeObj)}
                                                onChange={handleSizeChange}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {sampleSizes.map((size) => (
                                                    <MenuItem key={size} value={size}>
                                                        {size}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>}


                                    {brandOptions.includes(selectedBrand) && <div className="my-4">
                                        <FormControl fullWidth>
                                            <InputLabel id="color-select-label">Color</InputLabel>
                                            <Select
                                                labelId="color-select-label"
                                                multiple
                                                value={selectedColors.map(color => color.hexCode)}
                                                onChange={handleColorChange}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => {
                                                            const color = colors.find(color => color.hexCode === value);
                                                            return (
                                                                <Chip
                                                                    key={value}
                                                                    label={color.colorName}
                                                                    style={{ backgroundColor: value, color: '#fff' }}
                                                                />
                                                            );
                                                        })}
                                                    </Box>
                                                )}
                                            >
                                                {colors.map((color) => (
                                                    <MenuItem key={color.colorName} value={color.hexCode}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <div style={{
                                                                backgroundColor: color.hexCode,
                                                                width: 20,
                                                                height: 20,
                                                                marginRight: 10,
                                                                border: '1px solid #000',
                                                            }} />
                                                            {color.colorName}
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </div>}


                                    {brandOptions.includes(selectedBrand) && <div>
                                        <FormControl fullWidth>
                                            <InputLabel id="gender-select-label">Gender</InputLabel>
                                            <Select
                                                labelId="gender-select-label"
                                                value={selectedGender}
                                                onChange={handleGenderChange}
                                                label="Gender"
                                            >
                                                {genderOptions.map((gender) => (
                                                    <MenuItem key={gender} value={gender}>
                                                        {gender}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>} */}


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

                    </div>
                </div>
                {/* </main> */}
            </div>
        </div >

        // </div>
    );
};

export default AddServiceByAdmin;
