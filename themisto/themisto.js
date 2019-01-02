
var Koa = require('koa');
var Router = require('koa-router');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser')
const koaRequest = require('koa-http-request')
const puppeteer = require('puppeteer')
var ObjectId = require('mongodb').ObjectID
require('dotenv').load()

var app = new Koa()
var helpers = require('../helpers/helpers');

//New api router
var router = new Router({
    prefix: '/api'
});

app.use(mongo())
app.use(bodyParser())


// Ejecutar proceso Themisto
router.post("/puppeteer", async (ctx) => {
    let request=[]
    const body = ctx.request.body
    console.log("Procesando Themisto...")
    const orderId = body.orderId

    //order status=processing
    const updateOrderStatus = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').update({ "_id": ObjectId(orderId) }, { $set: { "status": "processing" } })

    //Call puppeteer Easy
    const searchQuery = body.searchQuery

    var products
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: true })
            const page = await browser.newPage()
            await page.goto(process.env.PROVIDER_PATH)
            await page.type('.header-userbar-input', searchQuery)
            await page.click('#WC_CachedHeaderDisplay_button_1')


            await page.waitForSelector('#Search_Area_div')

            const result = await page.evaluate(() => {
                let items = document.querySelector('#center-column-content > div.center-content-area > div.content-organizer-2 > div > div > div > div:nth-child(3) > span').innerText
                return {
                    items
                }
            })

            var i, j, limit1 = 1, limit2, itemsForPage = 12, see_more = 9, limitEnd, numPages, arrProducts = []

            numPages = 0
            limit1 = 1
            limit2 = itemsForPage
            limitEnd = result.items

            if (limitEnd <= itemsForPage && limitEnd > 0) {
                numPages = 1
            } else {

                if(process.env.NUMPAGES >0){
                    numPages = process.env.NUMPAGES
                }else{
                    numPages = parseInt(limitEnd / itemsForPage) + 1
                }

            }


            for (j = 1; j <= numPages; j++) {

                if (j == numPages) {

                    limit2 = limitEnd
                }
                await page.waitFor(10000)
                for (i = limit1; i <= limit2; i++) {
                    products = await page.$$eval('#WC_CatalogSearchResultDisplay_div_6_' + i, items => {

                        //return items.map(item => item.querySelector('.thumb-name > a').innerText)
                        return items.map(item => {
                            let title = item.querySelector('.thumb-name > a').innerText
                            let price = item.querySelector('.thumb-price-e').innerText
                            let img = item.querySelector('img.image')
                            return { title, price, img }
                        })
                    })
                    products.forEach((item) => {

                        let productsItem = {
                            title: item.title,
                            price: item.price,
                            img: item.img,
                            orderId: orderId,
                            searchQuery: searchQuery,
                            dateCreated:Date.now()

                        }
                        //Insert Products
                        ctx.mongo.db(process.env.MONGODB_DB).collection('products').insert(productsItem)

                    })

                }


                limit1 = limit1 + itemsForPage
                limit2 = limit2 + itemsForPage

                await page.waitFor(10000)
                if (j < numPages) {
                    await page.click('#Search_Result_div > div:nth-child(4) > div:nth-child(' + see_more + ') > input')
                }
                see_more = see_more + 6


            }
            //order status=processed
            const processed = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').update({ "_id": ObjectId(orderId) }, { $set: { "status": "processed" } })
            request=helpers.createResponse(200,{message:'Order processed'})
            await browser.close()

        })()
    } catch (err) {


        const failed = await ctx.mongo.db(process.env.MONGODB_DB).collection('orders').update({ "_id": ObjectId(orderId) }, { $set: { "status": "failed" } })
        request=helpers.createResponse(400,{message:'Order Failed'})
    }


    ctx.body = request

})


app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(process.env.PORT_T, () => { console.log('Server Themisto : ' + process.env.HOST_T + ":" + process.env.PORT_T); });

