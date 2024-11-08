export const findTitleByKey = (obj, targetKey) => {
    if (obj.key === targetKey || obj.value === targetKey) {
        return obj.title;
    }
    
    if (obj.children && obj.children.length > 0) {
        for (let child of obj.children) {
            const title = findTitleByKey(child, targetKey);
            if (title) {
                return title;
            }
        }
    }
    
    return null;
};