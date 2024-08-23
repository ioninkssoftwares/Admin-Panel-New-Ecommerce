
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


// export const Button = ({
//     name,
//     Icon,
//     Color,
// }) => {
//     return (
//         <div
//             className={
//                 Color +
//                 " bg-white font-bold w-full rounded-sm shadow-sm flex space-x-1 items-center justify-center px-4 p-1 max-w-max border border-[#DEDEDE]"
//             }
//         >
//             <div className="text-xs">{<Icon />}</div>
//             <div>
//                 <p className=" text-[10px]">{name}</p>
//             </div>
//         </div>
//     );
// };

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
    const [cookies, setCookies] = useCookies(["token"]);
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
        if (cookies && cookies.token) {
            console.log(cookies.token, "fdsfsdfsf")
            setToken(cookies.token);
        }
    }, [cookies]);



    const handleCategory = (event) => {
        console.log(event.target.value, "sjfhsdhfk")
        setProduct({
            ...product,
            category: event.target.value
        });
    };


    const [service, setService] = useState({
        serviceName: '',
        description: '',
        pricing: [],
        inactive: false,
        isCashOnDelivery: true
    });

    const [serviceAttributes, setServiceAttributes] = useState([
        {
            attribute: '',
            subcategories: [{ value: '', price: '' }]
        }
    ]);

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

    const handleProductSubmit = async () => {
        // setLoading(true)
        const token = cookies.token;

        setDeleteLoading(true)
        var ProductFormData = new FormData();
        for (let i of filesToupload) {
            ProductFormData.append('serviceImage', i);
        }

        ProductFormData.append('pricing', JSON.stringify(flattenedPricing));
        ProductFormData.append('serviceName', service.serviceName);
        ProductFormData.append('description', service.description);
        ProductFormData.append('isCashOnDelivery', service.isCashOnDelivery);
        ProductFormData.append('inactive', service.inactive);


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
            return ' Price should not contain decimals';
        }

        const floatValue = parseFloat(value);

        // Add specific validation logic for product price
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid price';
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


    // async function getAllBrands() {
    //     try {
    //         console.log(token, "jsakdfjkladsj")

    //         setLoading(true);
    //         // const res = await instance.get(
    //         //     `/admin/getAllBrands`
    //         // );
    //         // if (res.data) {
    //         //     setAllBrands(res.data.brands)
    //         //     setLoading(false);
    //         // }
    //     } catch (e) {
    //         setLoading(false);
    //         console.log(e)
    //         // ErrorDispaly(e);
    //     }
    // }

    // async function getAllCategories() {
    //     try {
    //         console.log(token, "jsakdfjkladsj")

    //         setLoading(true);
    //         // const res = await instance.get(
    //         //     `/admin/getAllCategories`
    //         // );
    //         // if (res.data) {
    //         //     setAllCategories(res.data.categories)
    //         //     setLoading(false);
    //         // }
    //     } catch (e) {
    //         setLoading(false);
    //         console.log(e)
    //         // ErrorDispaly(e);
    //     }
    // }

    // async function getAllColors() {
    //     try {
    //         console.log(token, "jsakdfjkladsj")

    //         setLoading(true);
    //         // const res = await instance.get(
    //         //     `/admin/getAllColors`
    //         // );
    //         // if (res.data) {
    //         //     setAllColors(res.data.data)
    //         //     setLoading(false);
    //         // }
    //     } catch (e) {
    //         setLoading(false);
    //         console.log(e)
    //         // ErrorDispaly(e);
    //     }
    // }


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
        // getAllBrands();
        // getAllCategories();
        // getAllColors();
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



    if (service) console.log(service, "kjkkkk")

    // const [serviceAttributes, setServiceAttributes] = useState([{ attribute: '', value: '', price: '' }]);



    // const handleAttributeChange = (index, name, value) => {
    //     const updatedAttributes = [...serviceAttributes];
    //     updatedAttributes[index][name] = value;
    //     setServiceAttributes(updatedAttributes);

    //     setService({
    //         ...service,
    //         pricing: updatedAttributes,
    //     });
    // };

    // const handleAddAttributes = () => {
    //     setServiceAttributes([...serviceAttributes, { attribute: '', value: '', price: '' }]);
    // };

    // const handleRemoveAttributes = (index) => {
    //     const updatedAttributes = [...serviceAttributes];
    //     updatedAttributes.splice(index, 1);
    //     setServiceAttributes(updatedAttributes);

    //     setService({
    //         ...service,
    //         pricing: updatedAttributes,
    //     });
    // };


    const [cashOnDeliverySwitch, setCashOnDeliverySwitch] = useState(true);

    const handleCashOnDeliverySwitch = (event) => {
        setCashOnDeliverySwitch(event.target.checked);
        setService({ ...service, isCashOnDelivery: event.target.checked })
    };








    if (flattenedPricing) console.log(flattenedPricing, "shubhhhh")

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

                                        <TextField
                                            label="Description"
                                            multiline
                                            rows={4}
                                            value={service.description}
                                            onChange={(e) => setService({ ...service, description: e.target.value })}
                                            fullWidth
                                            margin="normal"
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


                                        <div>
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

                                        <Box sx={{ width: "50%" }}>
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


                                        <Box sx={{ width: "50%" }} >
                                            <InputField
                                                label="Value"
                                                type="text"
                                                value={product?.value}
                                                onChange={(e) => setProduct({ ...product, value: e })}
                                            // validate={validateProductName}
                                            />
                                        </Box>
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
