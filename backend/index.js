// Import dependencies
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔥 Add this

app.use(cors());

// app.use(cors({
//     origin: "*",  // Allow all origins (change this in production)
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));



// Ensure upload directory exists
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Database Connection with MongoDB
mongoose
    .connect("mongodb+srv://lyndakelechi0:Kaycee505@cluster0.vv05n.mongodb.net/e-commerce")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// mongoose
//     .connect("mongodb+srv://lyndakelechi0:Kaycee505@cluster0.vv05n.mongodb.net/e-commerce", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch((error) => {
//         console.error("❌ MongoDB Connection Error:", error);
//         process.exit(1); // Exit process if MongoDB connection fails
//     });



// Default Route, API creation
app.get("/", (req, res) => {
    res.send("🚀 Express App is Running");
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

// Serve uploaded images
app.use("/images", express.static("upload/images"));

// Image Upload Endpoint
app.post("/upload", (req, res) => {
    upload.single("product")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ success: 0, error: err.message });
        }
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`,
        });
    });
});

// Image Upload Endpoint (✅ Fixed)
// app.post("/upload", upload.single("product"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ success: 0, error: "No file uploaded" });
//     }
    
//     res.json({
//         success: 1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`,
//     });
// });


// Product Schema for creating product(✅ Fixed errors)
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);


// Add Product API (✅ Fixed error handling)
app.post("/addproduct", async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
        }
    try {
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        console.log(product);
        await product.save();
        console.log("Saved");
        res.json({ success: true, name: req.body.name });

    } catch (error) {
        console.error("❌ Error saving product:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// app.post("/addproduct", async (req, res) => {
//     let products = await Product.find({});
//     let id = (products.length > 0) ? products[products.length - 1].id + 1 : 1;

//     try {
//         const product = new Product({
//             id: id,
//             name: req.body.name,
//             image: req.body.image,
//             category: req.body.category,
//             new_price: req.body.new_price,
//             old_price: req.body.old_price,
//         });

//         console.log(product);
//         await product.save();
//         console.log("✅ Product Saved");
//         res.json({ success: true, name: req.body.name });

//     } catch (error) {
//         console.error("❌ Error saving product:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });




// Creating API for deleting products

// ✅ DELETE Product API (Fixed)
// app.delete("/removeproduct/:id", async (req, res) => {
//     try {
//         const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });

//         if (!deletedProduct) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }

//         console.log(`✅ Removed: ${deletedProduct.name}`);
//         res.json({
//             success: true,
//             message: "Product deleted successfully",
//             product: deletedProduct
//         });

//     } catch (error) {
//         console.error("❌ Error deleting product:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });

app.delete('/removeproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove product" });
    }
});
// ✅ DELETE Product API (Fixed)



// Creating API for getting all product
app.get("/allproduct", async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})
// OR

// app.get("/allproduct", async (req, res) => {
//     try {
//         let products = await Product.find({});
//         if (products.length === 0) {
//             return res.status(404).json({ success: false, message: "No products found" });
//         }
//         console.log("✅ All Products Fetched");
//         res.json({ success: true, products }); // 🔥 Ensure JSON response
//     } catch (error) {
//         console.error("❌ Error fetching products:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });


// creating Schema for User model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    cartData:{
        type:Object
    },
    Date:{
        type:Date,
        default:Date.now
    }
})


// ✅ Creating API Endpoint for User Registration
app.post("/signup", async (req, res) => {

let check = await Users.findOne({email:req.body.email});
if (check){
    return res.status(400).json({ success: false, message: "Email already exists"}) 
}  
let cart = {};
for (let i = 0; i < 300; i++) {
    cart[i]=0;
    
}
// creating users using users model
const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart
})

await user.save();

// jwt (JSON Web Token) for user authentication
const data = {
//    create one key
user:{
    id:user._id
}
}

// creating the token
const token = jwt.sign(data, 'secret_ecom',);
res.json({success:true, token})

})

//Creating Endpoint for User Login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom',);
            res.json({success:true, token});
        }
        else{
            res.status(400).json({success:false, message:"Invalid Password"});
        }
    }
    else{
        res.status(400).json({success:false, message:"Invalid Email"});
    }

})

// creating Endpoint for new collections data
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating Endpoint for Popular in women category section
app.get('/popularinwomen', async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
})

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}

// creating Endpoint for adding products in cartdata using the middleware
app.post('/addtocart', fetchUser, async (req, res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    // to modify cart data
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send({success:true, message:"Product Added to Cart"});
})


// creating Endpoint API for removing products in cartdata using middleware
app.post('/removefromcart',fetchUser, async (req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send({success:true, message:"Product Removed to Cart"});
})

// creating Endpoint to get cartdata
app.post('/getcart',fetchUser, async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);

})



// 🛑 Keep this at the END of the file
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});



// Start Server
app.listen(port, (error) => {
    if (!error) {
        console.log(`🚀 Server is running on port ${port}`);
    } else {
        console.log("❌ Error:", error);
    }
});
