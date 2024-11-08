export const genRandomAvatar = () => {
  try {
    const randomAvatar = Math.floor(Math.random() * 71);
    return `https://i.pravatar.cc/300?img=${randomAvatar}`;
  } catch (err) {
    console.log(err)
  }
};
