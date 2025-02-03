import { fetch } from './Fetch';

export const getAllVoucher = async () => {

    let data = await fetch.get('/voucher/get-all');
    return data.data.data;

}

export const insertVoucher = async (content) => {

    let data = await fetch.post('/voucher/add-voucher', content);
    return data.data;
}

export const deleteVoucher = async (content) => {

    let data = await fetch.delete('/voucher/delete-voucher', content);
    return data.data.data;
}

export const updateVoucher = async (content) => {

    let data = await fetch.put('/voucher/update-voucher', content);
    return data.data.data;
}