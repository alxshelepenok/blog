import React from 'react';
import moment from 'moment';
import { RouteHandler, Link } from 'react-router';
import sortBy from 'lodash/collection/sortBy';
import DocumentTitle from 'react-document-title';
import { link } from 'gatsby-helpers';

import SeeAlso from '../components/SeeAlso';

export default class extends React.Component {
  static data() {
    return {
      yo: true
    }
  }
  render() {
    let i, len, page, pageLinks, ref, ref1, ref2, title, body;
    pageLinks = [];
    ref = sortBy(this.props.pages, (page) => {
      let ref;
      return (ref = page.data) != null ? ref.date : void 0;
    }).reverse();
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      title = ((ref1 = page.data) != null ? ref1.title : void 0) || page.path;
      if (page.path && page.path !== '/' && !((ref2 = page.data) != null ? ref2.draft : void 0)) {
        pageLinks.push(
          <div>
            <time dateTime={moment(ref1.date).format('MMMM D, YYYY')}>{moment(ref1.date).format('MMMM YYYY')}</time>
            <span style={{
              margin: '5px'
            }}>•</span>
            <span>{ref1.category}</span>
            <h2><Link to={link(page.path)}>{title}</Link></h2>
            <p dangerouslySetInnerHTML={{__html: ref1.description}}/>
          </div>
        );
      }
    }
    return (
      <DocumentTitle title={this.props.config.blogTitle}>
        <div className='content'>
          <div className='main'>
            <div className='main-inner'>
              {pageLinks}
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
