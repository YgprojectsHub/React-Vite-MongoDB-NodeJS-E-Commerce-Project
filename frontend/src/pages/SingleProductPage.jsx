import React from 'react'
import ProductSingle from '../components/Product-Single/ProductSingle';
import CampaignSingle from '../components/Campaign-Single/CampaignSingle';

const SingleProductPage = () => {
  return (
    <React.Fragment>
        <ProductSingle/>
        <CampaignSingle/>
    </React.Fragment>
  )
}

export default SingleProductPage