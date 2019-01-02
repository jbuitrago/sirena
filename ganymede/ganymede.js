'use strict';
var Koa = require('koa');
var Router = require('koa-router');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser');
const koaRequest = require('koa-http-request');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').load();
var app = new Koa();
var helpers = require('../helpers/helpers');
//New api router
var router = new Router({
    prefix: '/api'
});


app.use(mongo())
app.use(bodyParser());

app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: process.env.HOST_T + ":" + process.env.PORT_T  + "/api"
}));


router.get('/', (ctx, next) => {
    // ctx.router available
});

// POST /api/product/search
router.post("/product/search/", async (ctx) => {
console.log(process.env.HOST_T + ":" + process.env.PORT_T  + "/api")
    let request=[]
    //Get body
    try {

        const body = ctx.request.body
        var result = [];
        if(process.env.USER  == body.options.user && process.env.PASSWORD == body.options.password){


            if( body.provider  == process.env.PROVIDER_ALIAS){
                //order status=received
                const order = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').insert({ search: body.searchQuery, status: "received", callbackurl: body.callbackUrl, dateCreated:Date.now() })
                //New Request to Themisto
                console.log("GANYMEDE***")
                const orderId = order.ops[0]._id

                let params = {
                    "orderId": orderId.toString(),
                    "searchQuery": body.searchQuery,
                    "callbackUrl": body.callbackUrl
                }

                if (order) {
                    let themisto = await ctx.post('/puppeteer', params, {
                        'User-Agent': 'koa-http-request'
                    });
                    console.log("respuesta themisto:***")
                    console.log(themisto)

                    request=helpers.createResponse(200,{ orderId: orderId })

                } else {

                    request=helpers.createResponse(400,{message:'Order did not created'})

                }

            }else{

                request=helpers.createResponse(400,{message:'Provider Invalid'})
            }
        }else{

            request=helpers.createResponse(400,{message:'user or password invalid'})
        }

        ctx.body = request
    }
    catch (err) {

       console.log(err);
        result = {
            status: 400
        }

        ctx.body = result
    }




});

//GET /api/product/search-order/{searchOrderId}
router.get("/product/search-order/:searchOrderId", async (ctx) => {

    const searchOrderId = ctx.params.searchOrderId

    ctx.body = await ctx.mongo.db('sirena').collection('orders').find({ "_id": ObjectId(searchOrderId) }).toArray();
});

//GET /api/product/search-order/list
router.get("/product/search-order2/list", async (ctx) => {

    ctx.body = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').find().toArray();

});

//GET /api/product/category/{productCategoryId}
router.get("/product/:searchOrderId", async (ctx) => {

    const searchOrderId = ctx.params.searchOrderId
    ctx.body = await ctx.mongo.db(process.env.MONGODB_DB).collection('products').find({ "orderId":searchOrderId}).toArray();
});

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(process.env.PORT_G, () => { console.log('Server Ganymede : ' + process.env.HOST_G + ":" + process.env.PORT_G); });

