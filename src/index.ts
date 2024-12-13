import { Elysia } from "elysia";

const CATALOGUE_URL = 'http://microservices.tp.rjqu8633.odns.fr/api'
const STOCK_URL = 'https://microservice-stock-nine.vercel.app/api'

const app = new Elysia()
        .get("/api/products", async () => {
                const res_result = []

                const stock_res = await fetch(STOCK_URL + '/stock')
                const stock = await stock_res.json()

                const products_res = await fetch(CATALOGUE_URL + '/products')
                const products = await products_res.json()

                for (const product of stock) {
                        const infos = products.filter(el => product.productId === el._id)[0]
                        res_result.push({
                                id: infos._id,
                                name: infos.name,
                                description: infos.description,
                                unitPrice: infos.price
                        })

                }

                return res_result
        })
        .listen(4457);

console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
