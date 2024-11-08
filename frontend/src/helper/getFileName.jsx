export const getFileName = (imgUrl) => {
    const splitData = imgUrl.split("/");
    return splitData[splitData.length - 1];
  };