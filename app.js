var bodyParser       = require("body-parser"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose         = require("mongoose"),
    express          = require("express"),
	app              = express();

mongoose.connect("mongodb://localhost:27017/blogsite", {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Nice Day",
// 	image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSznx9h2AoTCHS8nkac2a3j7IPQJubr9arj6DH6kl0363gvpxRK&usqp=CAU",
// 	body:"I hope that you all have a vey nice day"
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blog){
		if(err)
			console.log("ERROR");
		else
			res.render("index",{blog:blog});	
	});
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){

	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
			console.log("WRONG IN CREATE");
		else
			res.redirect("/blogs");
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			console.log("WRONG IN SHOW");
		else
			res.render("show",{blog:foundBlog});
	});
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			console.log("WRONG in edit");
		else
			res.render("edit",{blog:foundBlog});		
	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
			console.log("wrong in update");
		else
			res.redirect("/blogs/"+ req.params.id);
	});
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log("wwwwww");
		else
			res.redirect("/blogs");
	});
});

app.listen(3000,function(){
	console.log("Server has started.");
});

	