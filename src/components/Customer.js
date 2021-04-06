import React, { Component } from 'react'
import ApiEndPoints from '../ApiEndPoints'
import { Button, Modal, Table, Form} from 'semantic-ui-react';

export class Customer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            customers: [],
            newCustomer: {},


            editModalOpen: false,
            modalOpen: false,
            editCustomer: {}
        }
    }

    componentDidMount()
    {
        this.getCustomers()
    }


    handleModalOpen = () =>
    {
        this.state.modalOpen ? this.setState({ modalOpen : false }) : this.setState({ modalOpen : true })
    }

    


    getCustomers = () =>
    {
        ApiEndPoints.customers.getCustomers().then( 
            
            (response)=> {

            this.setState({ customers : response.data })

            console.log(response)

        })
        .catch( (error)=> {console.log(error)} )
    }


    addNewCustomer = (cust) => 
    {

        ApiEndPoints.customers.addCustomer(cust).then(

            (response)=> {
                console.log(response)
                this.getCustomers()
            }
            

            ).catch( 
                (error)=> console.log(error) 
        )

        this.handleModalOpen()

    }


    deleteCustomer = (id) =>
    {
        ApiEndPoints.customers.deleteCustomer(id).then(
            (response)=> {
                console.log(response)
                this.getCustomers()
            }
        ).catch(
            (error)=> console.log(error)
        )

    }


    editCustomer = (cust) =>
    {
        ApiEndPoints.customers.editCustomer(cust).then(
            (response)=> {
                console.log(response)
                this.getCustomers()
            }
        ).catch(
            (error)=> console.log(error)
        )
    }



    render() {

        const newCustomer = {
            name: '',
            phone: ''
        }

        const editCustomer = {
            Id: this.state.editCustomer.id,
            Name: this.state.editCustomer.name,
            Phone: this.state.editCustomer.phone
        }

        return (
            <div>
                
                <Modal
                    //onClose={()=> this.handleModalOpen()}
                    //onOpen={()=> this.handleModalOpen()}
                    open={this.state.modalOpen}
                    trigger={<Button color='blue' content='New Customer' onClick={()=> this.handleModalOpen()} />}
                    style={{marginLeft:'33%', width:'33%', height:'25%', marginTop:'10%'}}
                >
                    <Modal.Header>New Customer</Modal.Header>
                    
                    <Modal.Content>
                        <Form>
                            <Form.Field style={{marginTop:'10px'}} >
                                <label>Customer Name</label>
                                <input placeholder='Please enter customer name' onChange={(event)=> newCustomer.name=event.target.value } />
                            </Form.Field>
                            <Form.Field style={{marginTop:'20px'}}>
                                <label>Phone</label>
                                <input placeholder= 'Please enter phone number' onChange={(event)=> newCustomer.phone = event.target.value } />
                            </Form.Field>
                        </Form>

                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='black' onClick={()=> this.setState({modalOpen:false})} content='Cancel' />
                        <Button color='green' onClick={()=> this.addNewCustomer(newCustomer) } content='Confirm' />
                    </Modal.Actions>

                </Modal>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Customer ID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>


                        {
                            this.state.customers.map(
                                (item, index)=> (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.phone}</Table.Cell>

                                        <Table.Cell>
                                            <Modal
                                                open={this.state.editModalOpen}
                                                trigger={<Button color='yellow' content='Edit' icon='edit' onClick={()=> this.setState({editModalOpen: true, editCustomer: item})} />}
                                                style={{marginLeft:'33%', width:'33%', height:'25%', marginTop:'10%'}}
                                            >
                                                <Modal.Header>Edit Customer </Modal.Header>

                                                <Modal.Content>
                                                    <Form>
                                                        <Form.Field style={{marginTop:'10px'}} >
                                                            <label>Customer Name: </label>
                                                            <input defaultValue={this.state.editCustomer.name} onChange={(event)=> editCustomer.Name = event.target.value } />
                                                        </Form.Field>
                                                        <Form.Field style={{marginTop:'20px'}}>
                                                            <label>Phone</label>
                                                            <input defaultValue={this.state.editCustomer.phone} onChange={(event)=> editCustomer.Phone = event.target.value } />
                                                        </Form.Field>
                                                    </Form>
                                                </Modal.Content>

                                                <Modal.Actions>
                                                    <Button color='black' content='Cancel' onClick={()=> this.setState({ editModalOpen: false })} />
                                                    <Button 
                                                        color='green' 
                                                        onClick={()=> { 
                                                            this.editCustomer(editCustomer); 
                                                            this.setState({ editModalOpen: false }); 
                                                        } } 
                                                        content='Confirm' 
                                                    />
                                                </Modal.Actions>

                                            </Modal>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Button content='Delete' color='red' icon='trash' onClick={()=>this.deleteCustomer(item.id)} />
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

export default Customer
