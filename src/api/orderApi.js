
import { fetch } from "./Fetch"

export const getOrder =async (data) => {
    let content = await fetch.post('/order/get-order',data)
    return content.data.data
}

export const createOrderVnPay= async(data) =>{
    let content = await fetch.post("/payment/create-vnpay",data)
    return content.data.data 
}

export const createOrderCod = async(data)=>{
    console.log(data);
    let content = await fetch.post("/payment/create-cod",data)
    return content.data.data 
}


export const getOneOrder = async (id)=> {
    let content = await fetch.get("/order/get-one/"+id)
    return content.data.data
}
export const updateStatus = async (id, status, type) =>{
    let content = await fetch.put(`/order/update-status?orderId=${id}&status=${status}&type=${type}`)
    return content.data
}
export const getOrderHistory = async (status) => {
    let data = await fetch.get('/order/get-history?orderStatus='+status)
    return data.data.data
}

export const cancelOrder = async (id) =>{
    let data = await fetch.put('/order/cancel-order?orderStatus='+status)
    return data.data.data
}

export const getProductInOrderSuccess =async () =>{
    let data= await fetch.get("/order/get-success-detail")
    return data.data.data
}

export const customerHandleCancel =async (id) => {
    let data = await fetch.put("/order/customer-handle-cancel?orderId="+id)
    return data.data
}
