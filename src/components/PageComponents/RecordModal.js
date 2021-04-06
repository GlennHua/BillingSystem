/* eslint-disable default-case */
import { Button, Modal, Form } from 'semantic-ui-react';
import React, { Component } from 'react';
import ApiEndPoints from '../ApiEndPoints';


export class RecordModal extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             modalOpen: false,
             type: this.props.type,
             action: this.props.action
        }

    }
    

    handleModalOpen = () =>
    {
        this.state.modalOpen ? this.setState({ modalOpen : false }) : this.setState({ modalOpen : true })
    }


    addNewproduct = (item, type, action) => 
    {
        switch(type)
        {
            case 'product':
                switch(action)
                {
                    case 'create':
                        ApiEndPoints.products.addProduct(item).then(

                            (response)=> {
                                console.log(response)
                            }
                            
                
                            ).catch( 
                                (error)=> console.log(error) 
                        )
                
                        this.handleModalOpen()
                    break;     
                    
                    
                    case 'edit':
                        ApiEndPoints.products.editProduct(item).then(
                            (response)=> {
                                console.log(response)
                                this.getProducts()
                            }
                        ).catch(
                            (error)=> console.log(error)
                        )
                    break;

                }
            break;




            default:
        }

    }







    render() {

        const newProduct = {
            Name: '',
            price: 0
        }

        const editProduct = {
            Id: this.state.editProduct.id,
            Name: 'default',
            price: 123
        }



        return (

            <Modal
                open={this.state.modalOpen}
                trigger={<Button color='blue' content='New product' onClick={()=> this.handleModalOpen()} />}
                style={{marginLeft:'33%', width:'33%', height:'25%', marginTop:'10%'}}
            >
                <Modal.Header>{this.state.action==='edit' ? 'Edit' : 'New' } {this.state.type}</Modal.Header>
                        
                <Modal.Content>
                    <Form>
                        <Form.Field style={{marginTop:'10px'}} >
                            <label>{this.state.type} Name</label>
                            <input placeholder='Pleas enter product name' onChange={(event)=> newProduct.Name=event.target.value } />
                        </Form.Field>
                        <Form.Field style={{marginTop:'20px'}}>
                            <label>{this.state.type==='Product' ? 'Price' : 'Phone' }</label>
                            <input placeholder= 'NZD' onChange={(event)=> newProduct.price = event.target.value } />
                        </Form.Field>
                    </Form>

                </Modal.Content>

                <Modal.Actions>
                    <Button color='black' onClick={()=> this.setState({modalOpen:false})} content='Cancel' />
                    <Button color='green' onClick={()=> this.addNewproduct(newProduct, this.state.type, this.state.action) } content='Confirm' />
                </Modal.Actions>

            </Modal>
        )
    }
}

export default RecordModal
