class ApiFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr
    } 
    search(){
        const keyword=this.querystr.keyword ?{
            name:{
                $regex:this.querystr.keyword,
                $options:"i",
            },
        }:{};
       
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.querystr}
        // Removing some field for category

        const removefields=["kewword","page","limit"];
        removefields.forEach(key=>delete queryCopy[key]);
        

        // filter for price and ratings gt->greater >/= than  and lt less than </=
        
        let querystr=JSON.stringify(queryCopy);
        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`);


        this.query=this.query.find(JSON.parse(querystr));


        
        return this; 
    }
    pagination(resultperPage){
        const currentPage=Number(this.querystr.page)||1;  //50 10 page per product 
        const skip=resultperPage*(currentPage-1);

        this.query=this.query.limit(resultperPage).skip(skip);
        return this;
    }

};
module.exports=ApiFeatures