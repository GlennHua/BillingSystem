import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

import { Product } from './components/Product';
import { Customer } from './components/Customer';
import { Bill } from './components/Bill';
import 'semantic-ui-css/semantic.min.css';

//import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/products' component={Product} />
        <Route path='/customers' component={Customer} />
        <Route path='/bills' component={Bill} />
      </Layout>
    );
  }
}
