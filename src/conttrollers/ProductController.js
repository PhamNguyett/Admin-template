const Product =require('../database/models/Product')
const caterology=require('../ultil/caterology')
const {MultipleMongooseToObject}=require('../ultil/mongoose')
class ProductController{
    async addProduct(req,res){   // get
        res.render('add_product',{caterology:caterology})
    }async search(req,res){   // search get product
        console.log(req.query.key)
        var allProduct=await Product.find({})
        allProduct=MultipleMongooseToObject(allProduct)
        let filterProduct=[]
        allProduct.forEach(item=>{
            if (!item.name.toUpperCase().indexOf(req.query.key.toUpperCase())){
                filterProduct.push(item)
            }
        })
        console.log
        res.render('product_list',{caterology:caterology,allProduct:filterProduct})
    }
    async caterology(req,res){
        const allProduct=await Product.find({type:req.params.slug})
        res.render('product_list',{allProduct:MultipleMongooseToObject(allProduct),caterology})
    }
    async createProduct(req,res){ // post product
        console.log(req.body)
        var type=[]
        caterology.forEach((item)=>{
            if(req.body[item]){
                type.push(item)
            }
        })

        var path=[]
        console.log(req.files)
        req.files.forEach(i=>{
            path.push('/uploads/'+i.filename)
        })
        console.log(path)
        const product={
            name:req.body.name,
            price:parseInt(req.body.price),
            pricePromotion:parseInt(req.body.pricePromotion),
            des:req.body.description,
            imagesUrl:path,
            info:[{
                color:req.body.color,
                size:req.body.size,
                quantity:req.body.quantity
            }],
            type:type,
        }
        const newProduct=new Product({...product})
        try{
            await newProduct.save()
            res.render('test',{src:path,product})
        }
        catch (err){
            res.render('404')
        }
    }

    async editProduct(req,res){
        res.render('edit_product')
    }

    async viewProduct(req,res){ // get all product
        try{
            const allProduct=await Product.find({})
            res.render('product_list',{allProduct:MultipleMongooseToObject(allProduct),caterology})
        }
        catch(e){
            res.render('404')
        }
    }
}
module.exports=new ProductController