
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../../utils/axios";
import Sidebar from "../../Components/sidebar/Siderbar";
import AdminNavbar from "../../Components/navbar/VendorNavbar";
import Box from '@mui/material/Box';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CircularProgress, FormControlLabel, FormGroup, Switch } from '@mui/material';

import Textarea from '@mui/joy/Textarea';
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../Components/InputField";



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


// give main area a max widht
const ViewService = () => {
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(["vendorToken"]);
    const [token, setToken] = useState("");
    const instance = useAxios(token);
    const [product, setProduct] = useState({
        stock: 0,
        name: "",
        price: 0,
        description: "",
        category: "",
        brand: "",
        specification: [],
        featured: true,
        bestSeller: true,
        subCategory: "",
        warrantyPeriod: "",
        hsnCode: "",
        gstPerc: 0,
        images: [],
        isVerified: false,
        colorImages: [],
        sizes: [],
        colors: [],
        gender: ""
    })
    const [featuredSwitch, setFeaturedSwitch] = useState(true);
    const [bestSellerSwitch, setBestSellerSwitch] = useState(true);
    const [bestSellerSwitchNew, setBestSellerSwitchNew] = useState(true);




    const { id } = useParams();






    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await instance.get(
                    `/product/${id}`
                );
                const data = response.data.product;
                setProduct({
                    name: data.name,
                    brand: data.brand,
                    category: data.category,
                    subCategory: data.subCategory,
                    price: data.price,
                    stock: data.stock,
                    bestSeller: data.bestSeller,
                    featured: data.featured,
                    description: data.description,
                    specification: data.specification,
                    warrantyPeriod: data.warrantyPeriod,
                    images: data.productImages,
                    gstPerc: data.gstPerc,
                    hsnCode: data.hsnCode,
                    gender: data.gender,
                    sizes: data.sizes,
                    colorImages: data.moreColorImage,
                    colors: data.colors,
                    isVerified: data.isVerified === "true",
                });
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product details");
            }
        };

        fetchProduct();
    }, [id]);



    useEffect(() => {
        if (cookies && cookies.vendorToken) {
            console.log(cookies.vendorToken, "fdsfsdfsf")
            setToken(cookies.vendorToken);
        }
    }, [cookies]);

    if (product) console.log(product, "hjfsdkh")
    return (
        <div>
            <div className='flex h-screen overflow-hidden'>
                <Sidebar />
                <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
                    {/* <main> */}
                    <div className='bg-gray-50'>
                        <AdminNavbar />
                        <div className="flex items-center justify-between mx-10 my-5">
                            <p>Product Details</p>

                        </div>

                        <div className="bg-white mx-10  flex  gap-5 ">
                            <div className="basis-[90%] flex gap-10">
                                <div className="basis-[45%] p-10">


                                    <InputField
                                        label="Product Name"
                                        type="text"
                                        value={product?.name}

                                    />

                                    <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="brand-select-label">Selected Brand</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="brand-select"
                                            value={product.brand}
                                            // onChange={handleBrandChange}
                                            label="Brand"
                                        // sx={{ w: '100%' }}
                                        >

                                            <MenuItem value={product.brand}>
                                                {product.brand}
                                            </MenuItem>

                                        </Select>
                                    </FormControl>

                                    <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="brand-select-label">Select Category</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="brand-select"
                                            value={product.category}
                                            // onChange={handleCategoryChange}
                                            label="Category"
                                        // sx={{ w: '100%' }}
                                        >

                                            <MenuItem value={product.category}>
                                                {product.category}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>


                                    <FormControl variant="standard" sx={{ mb: 4, width: "100%" }}>
                                        <InputLabel id="subCategory-select-label">Selected Sub Category</InputLabel>
                                        <Select
                                            labelId="brand-select-label"
                                            id="subCategory-select"
                                            value={product.subCategory}
                                            // onChange={handleSubCategoryChange}
                                            label="Category"
                                        // sx={{ w: '100%' }}
                                        >

                                            <MenuItem value={product.subCategory}>
                                                {product.subCategory}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>


                                    <Box sx={{ display: "flex", gap: 2 }}>

                                        <InputField
                                            label=" Price"
                                            type="number"
                                            value={product.price}
                                        />

                                        <InputField label="Stock"
                                            type="number"
                                            value={product.stock}
                                        />


                                    </Box>

                                    <Box sx={{ display: "flex", gap: 2 }}>

                                        <FormControl fullWidth>
                                            <InputLabel id="warranty-period-label">Warranty Period</InputLabel>
                                            <Select
                                                labelId="warranty-period-label"
                                                id="warranty-period-select"
                                                value={product.warrantyPeriod}

                                                label="Warranty Period"
                                            >

                                                <MenuItem value={product.warrantyPeriod}>
                                                    {product.warrantyPeriod}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>


                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={product.isVerified}
                                                    // onChange={handleSwitchChange}
                                                    name="isVerified"
                                                />
                                            }
                                            label="Verified"
                                        />

                                    </Box>

                                    <div className="mt-6">
                                        <InputField
                                            label="Gender"
                                            type="text"
                                            value={product?.gender}

                                        />
                                    </div>

                                    {/* <div className="flex gap-4">
                                    <div>
                                    <span className="">Sizes:</span>
                                        <ul className="list-disc">
                                            {product.sizes.map((spec, index) => (
                                                <li key={index}>{spec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                  <div>
                                  <span className="">Colors:</span>
                                      
                                  </div>
                                    </div> */}
                                    <div className="flex items-center justify-around">
                                        <div className=" ">
                                            <span className="mb-2">Sizes:</span>
                                            <ul className="list-disc">
                                                {product?.sizes.map((spec, index) => (
                                                    <li key={index}>{spec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="mb-2">Colors:</span>
                                            <ul className="list-none">
                                                {product?.colors.map((color) => (
                                                    <li key={color._id} className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-6 h-6 rounded-full"
                                                            style={{ backgroundColor: color.hexCode }}
                                                        ></div>
                                                        <span>{color.colorName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <p className='text-center text-xl my-8 '>Uploaded Color Images</p>
                                        <div className="mt-12">
                                            {/* <div className="flex items-center flex-col gap-4  w-full "> */}
                                            <div className="flex flex-col space-y-4">
                                                {product?.colorImages.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Color Image ${index + 1}`}
                                                        className="w-full h-auto object-cover rounded"
                                                    />
                                                ))}
                                            </div>

                                            {/* </div> */}
                                        </div>
                                    </div>

                                </div>
                                <div className="basis-[45%] py-4 mt-10">

                                    {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Featured"
                                                control={<Switch checked={featuredSwitch}
                                                // onChange={handleFeaturedSwitch}
                                                />}

                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Best Seller"
                                                control={<Switch checked={bestSellerSwitch}

                                                // onChange={handleBestSellerSwitch} 
                                                />}

                                            />
                                        </FormGroup>
                                    </Box> */}



                                    <Textarea sx={{ padding: 0, borderRadius: 1, marginBottom: 1 }}
                                        value={product.description}

                                        minRows={6} />



                                    <Box sx={{ display: "flex", marginTop: 2, gap: 2 }}>

                                        <InputField
                                            label="HSN Code"
                                            type="text"
                                            value={product.hsnCode}
                                        // onChange={(e) => setProduct({ ...product, price: e })} 
                                        // onChange={(value) => {
                                        //     setProduct({ ...product, hsnCode: value })
                                        //     // setFormErrors({ ...formErrors, hsnCode: validateSellingPrice(value) });
                                        // }}
                                        // validate={validateSellingPrice} 
                                        />

                                        {/* <InputField label="Cost Price" type="number" value={product.costPrice} onChange={(e) => setProduct({ ...product, costPrice: e })} validate={validateCostPrice} />
*/}

                                        <InputField label="GST Percentage"
                                            type="number"
                                            value={product.gstPerc}
                                        // onChange={(e) => setProduct({ ...product, stock: e })} 
                                        // onChange={(value) => {
                                        //     setProduct({ ...product, gstPerc: +value })
                                        //     setFormErrors({ ...formErrors, gstPerc: validateSellingPrice(value) });
                                        // }}
                                        // validate={validateSellingPrice} 
                                        />


                                    </Box>

                                    <h2 className="">Specifications:</h2>
                                    <ul className="list-disc">
                                        {product.specification.map((spec, index) => (
                                            <li key={index}>{spec}</li>
                                        ))}
                                    </ul>
                                    <div>
                                    </div>
                                </div>

                                <div className="basis-[25%] max-w-[380px] ml-10 px-7 ">
                                    <div>
                                        <p className='text-center text-xl my-8 '>Uploaded Images</p>
                                        <div className="mt-12">
                                            {/* <div className="flex items-center flex-col gap-4  w-full "> */}
                                            <div className="flex flex-col space-y-4">
                                                {product?.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Product Image ${index + 1}`}
                                                        className="w-full h-auto object-cover rounded"
                                                    />
                                                ))}
                                            </div>

                                            {/* </div> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </main> */}
                </div>
            </div >

        // </div>
    );
};

export default ViewService;
