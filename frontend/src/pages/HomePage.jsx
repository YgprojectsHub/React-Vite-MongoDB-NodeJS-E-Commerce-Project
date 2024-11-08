import React from "react";
import Blogs from "../components/Blogs/Blogs";
import Brands from "../components/Brands/Brands";
import CampaignSingle from "../components/Campaign-Single/CampaignSingle";
import Campaigns from "../components/Campaigns/Campaigns";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import Sliders from "../components/Sliders/Sliders";

const HomePage = () => {
  return (
    <React.Fragment>
      <Sliders/>
      <Categories/>
      <Products/>
      <Campaigns/>
      <Blogs/>
      <Brands/>
      <CampaignSingle/>
    </React.Fragment>
  );
};

export default HomePage;
