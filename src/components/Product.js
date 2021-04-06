import React, { Component } from 'react'
import ApiEndPoints from '../ApiEndPoints'
import $ from 'jquery';

import { Button, Modal, Table, Form, Icon} from 'semantic-ui-react';

export class Product extends Component {

    constructor(props) {
        super(props)

        this.state = {
            products: [],
            newProduct: {},


            editModalOpen: false,
            modalOpen: false,
            editProduct: {}
        }
    }

    componentDidMount()
    {
        this.getProducts()

        //this.getData()
    }


    handleModalOpen = () =>
    {
        this.state.modalOpen ? this.setState({ modalOpen : false }) : this.setState({ modalOpen : true })
    }

    


    getProducts = () =>
    {
        ApiEndPoints.products.getProducts().then( 
            
            (response)=> {

            this.setState({ products : response.data })

            console.log(response)

        })
        .catch( (error)=> {console.log(error)} )
    }


    addNewproduct = (product) => 
    {

        ApiEndPoints.products.addProduct(product).then(

            (response)=> {
                console.log(response)
                this.getProducts()
            }
            

            ).catch( 
                (error)=> console.log(error) 
        )

        this.handleModalOpen()

    }


    deleteProduct = (id) =>
    {
        ApiEndPoints.products.deleteProduct(id).then(
            (response)=> {
                console.log(response)
                this.getProducts()
            }
        ).catch(
            (error)=> console.log(error)
        )

    }


    editProduct = (product) =>
    {
        ApiEndPoints.products.editProduct(product).then(
            (response)=> {
                console.log(response)
                this.getProducts()
            }
        ).catch(
            (error)=> console.log(error)
        )
    }



    render() {

        const newProduct = {
            Name: '',
            price: 0
        }

        const editProduct = {
            Id: this.state.editProduct.id,
            Name: this.state.editProduct.name,
            price: this.state.editProduct.price
        }

        return (
            <div>
                
                <Modal
                    //onClose={()=> this.handleModalOpen()}
                    //onOpen={()=> this.handleModalOpen()}
                    open={this.state.modalOpen}
                    trigger={<Button color='blue' content='New product' onClick={()=> this.handleModalOpen()} />}
                    style={{marginLeft:'33%', width:'33%', height:'25%', marginTop:'10%'}}
                >
                    <Modal.Header>New Product</Modal.Header>
                    
                    <Modal.Content>
                        <Form>
                            <Form.Field style={{marginTop:'10px'}} >
                                <label>Product Name</label>
                                <input placeholder='Please enter product name' onChange={(event)=> newProduct.Name=event.target.value } />
                            </Form.Field>
                            <Form.Field style={{marginTop:'20px'}}>
                                <label>Price</label>
                                <input placeholder= 'NZD' onChange={(event)=> newProduct.price = event.target.value } />
                            </Form.Field>
                        </Form>

                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={()=> this.setState({modalOpen:false})} content='Cancel' />
                        <Button color='green' onClick={()=> this.addNewproduct(newProduct) } content='Confirm' />
                    </Modal.Actions>

                </Modal>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Product ID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>


                        {
                            this.state.products.map(
                                (item, index)=> (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.price} NZD</Table.Cell>

                                        <Table.Cell>
                                            <Modal
                                                open={this.state.editModalOpen}
                                                trigger={<Button color='yellow' content='Edit' icon='edit' onClick={()=> this.setState({editModalOpen: true, editProduct: item})} />}
                                                style={{marginLeft:'33%', width:'33%', height:'25%', marginTop:'10%'}}
                                            >
                                                <Modal.Header>Edit Product </Modal.Header>

                                                <Modal.Content>
                                                    <Form>
                                                        <Form.Field style={{marginTop:'10px'}} >
                                                            <label>Product Name: </label>
                                                            <input defaultValue={this.state.editProduct.name} onChange={(event)=> editProduct.Name = event.target.value } />
                                                        </Form.Field>
                                                        <Form.Field style={{marginTop:'20px'}}>
                                                            <label>Price</label>
                                                            <input defaultValue={this.state.editProduct.price} onChange={(event)=> editProduct.price = event.target.value } />
                                                        </Form.Field>
                                                    </Form>
                                                </Modal.Content>

                                                <Modal.Actions>
                                                    <Button color='black' content='Cancel' onClick={()=> this.setState({ editModalOpen: false })} />
                                                    <Button 
                                                        color='green' 
                                                        onClick={()=> { 
                                                            this.editProduct(editProduct); 
                                                            this.setState({ editModalOpen: false }); 
                                                        } } 
                                                        content='Confirm' 
                                                    />
                                                </Modal.Actions>

                                            </Modal>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Button content='Delete' color='red' icon='trash' onClick={()=>this.deleteProduct(item.id)} />
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

export default Product
