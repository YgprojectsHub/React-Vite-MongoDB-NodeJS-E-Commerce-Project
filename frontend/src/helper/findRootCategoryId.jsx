export const findRootCategoryId = (categories, selectedValue) => {
  let rootId = null;

  const findCategory = (categoryList, value) => {
    for (let category of categoryList) {
      if (category.key === value) {
        rootId = category._id;
        return true;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategory(category.children, value);
        if (found) {
          rootId = category._id;
          return true;
        }
      }
    }
    return false;
  };

  findCategory(categories, selectedValue);
  return rootId;
};
