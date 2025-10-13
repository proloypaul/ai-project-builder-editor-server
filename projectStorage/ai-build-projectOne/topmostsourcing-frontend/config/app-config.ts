export const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
export const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`;

export const apiRoutes = {
  userRoute: `/user`,
  investorRoute: `/investor`,
  investRoute: `/invest`,
  productRoute: `/product`,
  blogRoute: `/blog`,
  categoryRoute: `/category`,
  productParentCategoryRoute: `/product-parent-category`,
  productCategoryRoute: `/product-category`,
  productSubCategoryRoute: `/product-subcategory`,
  roiRoute: `/roi`,
};
