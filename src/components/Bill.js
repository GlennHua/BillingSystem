import React, { Component } from 'react';
import ApiEndPoints from '../ApiEndPoints';
import { Button, Modal, Table, Form, Dropdown, Label, Icon, Popup} from 'semantic-ui-react';

export class Bill extends Component {

    constructor(props) {
        super(props)

        this.state = {
            customers: [],
            products: [],
            billDetails: [],
            bills: [],

            billDetail_prodId: 1,
            billDetail_quantity: 1,
            customerId: 0,


            editModalOpen: false,
            modalOpen: false,
            showingQuantityInput: false,


            editCustomer: {}
        }
    }

    componentDidMount()
    {
        this.getCustomers()
        this.getProducts()
        this.getBills()
        
    }


    handleModalOpen = () =>
    {
        this.state.modalOpen ? this.setState({ modalOpen : false }) : this.setState({ modalOpen : true })
    }


    getTargetProductInfo=(id)=>
    {
        let prod = this.state.products.find( prod => prod.id===id )
        return prod
    }


    getTotalPrice=()=>
    {

        let total = 0

        this.state.billDetails.forEach(
            (billDetail)=> {

                let subTotal = billDetail.Quantity*this.getTargetProductInfo(billDetail.ProdId).price
                total = total+subTotal
            }             
        )
        return total
    }


    


    getCustomers = () =>
    {
        ApiEndPoints.customers.getCustomers().then( 
            
            (response)=> {

            this.setState({ customers : response.data })

        })
        .catch( (error)=> {console.log(error)} )
    }

 
    getProducts = () =>
    {
        ApiEndPoints.products.getProducts().then( 
            
            (response)=> {

            this.setState({ products : response.data })

            //console.log(response)

        })
        .catch( (error)=> {console.log(error)} )
    }


    getBills=()=>
    {
        ApiEndPoints.bill.GetBills().then(
            (response)=> {
                console.log(response.data.bills)
                this.setState({ bills: response.data.bills })
            }
        ).catch(
            (error)=> console.log(error)
        )
        
    }


    addBill=(id, list)=>
    {
        ApiEndPoints.bill.createBill(id, list).then( 
            
            (response)=> {

            console.log(response)
            this.getBills()

        })
        .catch( (error)=> {console.log(error)} )
    }
    

    deleteBill=(id)=>
    {
        ApiEndPoints.bill.DeleteBill(id).then(
            (response)=> { console.log(response); this.getBills() }
        ).catch( (error)=> console.log(error) )
    }


    render() {

        const customers = this.state.customers.map(
            (cust)=> {
                let element = {
                    key: cust.name,
                    value: cust.id,
                    text: cust.name+' (CustomerID: '+cust.id+')'
                }
                return element
            }
        )

        const products = this.state.products.map(
            (item)=> {
                let element = {
                    key: item.name,
                    value: item.id,
                    text: item.name + ' $ ' + item.price
                }
                return element
            }
        )

        const newBillDetails = {
            ProdId: 0,
            Quantity: 0,
            UnitPrice: 0
        }


        const billDetails = this.state.billDetails

        return (
            <div>
                
                <Modal
                    open={this.state.modalOpen}
                    trigger={<Button color='blue' content='New Bill' onClick={()=> this.handleModalOpen()} />}
                    style={{marginLeft:'33%', width:'45%', height:'50%', marginTop:'10%'}}
                >
                    <Modal.Header>New Bill</Modal.Header>
                    
                    <Modal.Content>
                        <Form>
                            <Form.Field style={{marginTop:'10px'}} >
                                <label>Customer Information</label>
                                <Dropdown 
                                    placeholder='Please select customer'
                                    fluid
                                    search
                                    selection
                                    options={customers}
                                    onChange={(e, {value})=> {console.log(value); this.setState({ customerId: value }) }}
                                />                               
                            </Form.Field>

                            <Form.Field style={{marginTop:'20px'}}>
                                <label>Items</label>
                                <Dropdown
                                    placeholder='Please select product'
                                    fluid
                                    search
                                    selection
                                    options={products}
                                    onChange={(event, {value})=> {console.log(value); this.setState({billDetail_prodId: value, showingQuantityInput: true})  }}
                                />                             
                            </Form.Field>

                            {
                                this.state.billDetail_prodId!==null && this.state.showingQuantityInput===true ? 
                                <Form.Group>
                                    <Form.Field>
                                        <label>Quantity</label>
                                        <input onChange={(event)=> this.setState({ billDetail_quantity: event.target.value })  } />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Actions</label>
                                        <Button content='Add' color='blue' onClick={()=> { 
                                            newBillDetails.ProdId = this.state.billDetail_prodId;
                                            newBillDetails.Quantity = parseInt(this.state.billDetail_quantity);
                                            newBillDetails.UnitPrice = this.getTargetProductInfo(this.state.billDetail_prodId).price;
                                            billDetails.push(newBillDetails); 
                                            this.setState({ billDetails: billDetails});}} 
                                        />
                                        <Button content='Cancel' color='black' onClick={()=> this.setState({showingQuantityInput: false})} />
                                    </Form.Field>
                                </Form.Group>
                                :
                                null

                            } 
                            

                            <Form.Field style={{marginTop:'20px'}}>
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Price</Table.HeaderCell>
                                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                                            <Table.HeaderCell>Total</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {   
                                            this.state.billDetails.map(
                                                (billDetail, index)=> (
                                                    <Table.Row key={index}>

                                                        <Table.Cell> {this.getTargetProductInfo(billDetail.ProdId).name} </Table.Cell>
                                                        <Table.Cell> {this.getTargetProductInfo(billDetail.ProdId).price} </Table.Cell>
                                                        <Table.Cell> {billDetail.Quantity} </Table.Cell>
                                                        <Table.Cell> {billDetail.Quantity*this.getTargetProductInfo(billDetail.ProdId).price} </Table.Cell>

                                                    </Table.Row>
                                                )
                                            )
                                        }
                                        
                                    </Table.Body>

                                </Table>
                            </Form.Field>

                        </Form>

                        <Label style={{ marginTop: '5px' }}>
                            Total: <Icon name='dollar sign' /> {this.getTotalPrice()}
                        </Label>

                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={()=> this.setState({modalOpen:false})} content='Cancel' />
                        <Button color='green' content='Confirm' onClick={()=>{ this.setState({modalOpen: false}); this.addBill(this.state.customerId, this.state.billDetails) }} />
                    </Modal.Actions>

                </Modal>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Bill ID</Table.HeaderCell>
                            <Table.HeaderCell>Customer Info</Table.HeaderCell>
                            <Table.HeaderCell>Total(NZD)</Table.HeaderCell>
                            <Table.HeaderCell>Bill Details</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>


                        {
                            this.state.bills.map(
                                (bill, index)=> (
                                    <Table.Row key={index}>
                                        <Table.Cell>{bill.billId}</Table.Cell>
                                        <Table.Cell>
                                            {
                                                <Popup
                                                    trigger={<p>{bill.customer.name}</p>}
                                                    header={bill.customer.name}
                                                    content={
                                                        <div>
                                                            <p>Customer ID: {bill.customer.id}</p>
                                                            <p>Phone: {bill.customer.phone}</p>
                                                        </div>
                                                    }
                                                />                                           
                                            }
                                        </Table.Cell>

                                        <Table.Cell>
                                            $ {bill.totalPrice}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Popup 
                                                trigger={<p>Check Details</p>}
                                                header={bill.customer.name+' ID: '+bill.customer.id}
                                                content={
                                                    <div>
                                                        {
                                                            bill.details.map(
                                                                (detail)=> (
                                                                    <p>Product ID: {detail.prodId}, Quantity: {detail.quantity}</p>
                                                                ) 
                                                            )
                                                        }
                                                    </div>
                                                }
                                            />
                                        </Table.Cell>


                                        <Table.Cell>
                                            <Button content='Delete' color='red' icon='trash' onClick={()=> this.deleteBill(bill.billId)}  />
                                        </Table.Cell>

                                    </Table.Row>
                                )
                            )
                        
                        }

                    </Table.Body>

                </Table>

            </div>
        )
    }
}

export default Bill
