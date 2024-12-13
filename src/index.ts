import { Elysia } from "elysia";
import type { ProductDto, AddToBasketDto, BasketDto, PurchasedProductDto } from "./shopping_types";

const CATALOGUE_URL = 'http://microservices.tp.rjqu8633.odns.fr/api'
const STOCK_URL = 'https://microservice-stock-nine.vercel.app/api'
const ORDER_URL = 'https://micro-service-api-order.vercel.app/api'

let basket: PurchasedProductDto[] = []

const app = new Elysia()
        .get("/api/ping", () => "pong")
        .put("/api/basket", async ({ set, body, error }) => {
                const data: AddToBasketDto = body as AddToBasketDto
                const product_info_res = await fetch(CATALOGUE_URL + '/products/' + data.id)

                if (!product_info_res.ok) {
                        return error(400)
                }

                const product_info = await product_info_res.json()

                basket.push({
                        productId: product_info._id,
                        quantity: data.quantity
                })

                set.status = 204
                return

        })
        .get("/api/basket", async () => {
                const result_res: BasketDto = { totalPrice: 0, products: [] }

                for (const item of basket) {
                        const infos_res = await fetch(CATALOGUE_URL + '/products/' + item.productId)
                        const infos = await infos_res.json()

                        result_res.products.push({
                                id: infos._id,
                                name: infos.name,
                                description: infos.description,
                                unitPrice: infos.price,
                                quantity: 1
                        })
                        result_res.totalPrice += infos.price
                }

                return result_res
        })
        .post("/api/basket/checkout", async ({ error }) => {
                if (!basket.length) {
                        return error(400, 'Le panier est vide')
                }

                const create_order_res = await fetch(ORDER_URL + '/order', {
                        method: 'POST',
                        headers: {
                                'Content-type': 'application/json'
                        },
                        body: JSON.stringify(basket)
                })
                await create_order_res.json()

                basket = []
                return
        })
        .get("/api/products", async () => {
                const res_result = []

                const stock_res = await fetch(STOCK_URL + '/stock')
                const stock = await stock_res.json()

                const products_res = await fetch(CATALOGUE_URL + '/products')
                const products: ProductDto[] = await products_res.json()

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
