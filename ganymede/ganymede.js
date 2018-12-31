'use strict';
var Koa = require('koa');
var Router = require('koa-router');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser');
const koaRequest = require('koa-http-request');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').load();
var app = new Koa();

//New api router
var router = new Router({
    prefix: '/api'
});


app.use(mongo())
app.use(bodyParser());

app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: "http://localhost:3001/api"
}));


router.get('/', (ctx, next) => {
    // ctx.router available
});

// Generar orden y ejecutar proceso Themisto
router.post("/product/search/", async (ctx) => {

    //Get body
    try {

        const body = ctx.request.body;
        var result = [];

        //order status=received
        const order = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').insert({ search: body.searchQuery, status: "received", callbackurl: body.callbackUrl })
        //New Request to Themisto
        console.log("GANYMEDE***")
        const orderId = order.ops[0]._id;

        let params = {
            "orderId": orderId.toString(),
            "searchQuery": body.searchQuery,
            "callbackUrl": body.callbackUrl
        }

        if (order) {
            let themisto = await ctx.post('/puppeteer', params, {
                'User-Agent': 'koa-http-request'
            });

            result = {
                status: 200,
            }

        } else {

            result = {
                status: 400
            }

        }

        ctx.body = { orderId: orderId }
    }
    catch (err) {

       console.log(err);
        result = {
            status: 400
        }

        ctx.body = result
    }




});

router.get("/product/search-order/:searchOrderId", async (ctx) => {

    const searchOrderId = ctx.params.searchOrderId

    ctx.body = await ctx.mongo.db('sirena').collection('orders').find({ "_id": ObjectId(searchOrderId) }).toArray();
});

router.get("/product/search-order2/list", async (ctx) => {

    ctx.body = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').find().toArray();

});

router.get("/product/category/:searchOrderId", async (ctx) => {

    const searchOrderId = ctx.params.searchOrderId
    ctx.body = await ctx.mongo.db(process.env.MONGODB_DB).collection('products').find({ "orderId":searchOrderId}).toArray();
});

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(process.env.PORT_G, () => { console.log('Server Ganymede : ' + process.env.HOST_G + ":" + process.env.PORT_G); });

