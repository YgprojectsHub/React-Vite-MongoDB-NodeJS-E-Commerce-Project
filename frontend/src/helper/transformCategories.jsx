export const transformCategories = (categoryDatas = []) => {
    return categoryDatas.map((category) => ({
      title: category.title,
      value: category.key,
      children:
        category.children.length > 0
          ? transformCategories(category.children)
          : [],
    }));
  };