import Axios from 'axios';

const apiEndPoints = {

    products: {
        getProducts: () => Axios.get('/Products/GetProducts'),
        addProduct: (product)=> Axios.post('/Products/Create', product),
        deleteProduct: (id)=> Axios.delete('/Products/DeleteProduct/'+id),
        editProduct: (product)=> Axios.put('/Products/Edit', product)
    },

    customers: {
        getCustomers: () => Axios.get('/Customers/GetCustomers'),
        addCustomer: (customer) => Axios.post('/Customers/Create', customer),
        deleteCustomer: (id)=> Axios.delete('/Customers/Delete/'+id),
        editCustomer: (customer)=> Axios.put('/Customers/Edit', customer)
    },

    bill: {
        createBill: (CustId, detailsList)=> Axios.post('/Products/CreateBill/'+CustId, detailsList),
        GetBills: ()=> Axios.get('/Products/GetBills'),
        DeleteBill: (id)=> Axios.delete('/Products/DeleteBill/'+id)
    }

}
export default apiEndPoints
