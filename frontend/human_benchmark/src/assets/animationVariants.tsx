export const gameContainerVariants = {
  hidden: {
    y: "100vh",
    scale: 0,
  },
  visible: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const opacityFadeVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4,
    },
  },
};

export const opacityFadeVariants2 = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
    },
  },
};

export const opacityFadeVariants3 = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
    },
  },
};
