const buildCategoryTree = (categoryList, parentId = "") => {
  const tree = [];
  categoryList.forEach((item) => {
    if (item.parent == parentId) {
      const children = buildCategoryTree(categoryList, item._id);
      tree.push({
        _id: item._id,
        name: item.name,
        slug: item.slug,
        children: children,
      });
    }
  });
  return tree;
};

module.exports = buildCategoryTree;