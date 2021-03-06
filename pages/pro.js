import React, { Component } from 'react';
import Layout from './_Layout';
import locals from '../config/cache.json';
import Rationale from '../components/pro/Rationale';
import Nav from '../components/pro/Nav';
import Subscribe from '../components/pro/Subscribe';
import Description from '../components/pro/Description';
import Jumbotron from '../components/pro/Jumbotron';
import Features from '../components/pro/Features';
import get from 'lodash/get';

const Content = ({ children }) => {
  return (
    <Layout {...locals}>
      <Nav>
        <Subscribe action={locals.proMailChimpList} />
      </Nav>
      <Jumbotron />
      {children}
    </Layout>
  );
};

class Page extends Component {
  constructor() {
    super();
    this.state = {
      vn: 'a'
    };
  }

  componentDidMount() {
    // get the variant from url query params
    let params = new URL(document.location).searchParams;
    this.setState({
      vn: params.get('vn')
    });
  }

  render() {
    switch (this.state.vn) {
      case 'b':
        return (
          <Content>
            <Features cols={2} features={locals.proFeatures} />
            <Rationale />
          </Content>
        );
        break;
      default:
        return (
          <Content>
            <Description />
            <Features cols={2} features={locals.proFeatures} />
          </Content>
        );
    }
  }
}

export default Page;
