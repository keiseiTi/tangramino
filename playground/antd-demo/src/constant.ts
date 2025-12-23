export const defaultSchema = {
  elements: {
    basicPage: {
      type: 'basicPage',
      props: {
        display: 'flow',
        flexDirection: 'column',
      },
    },
  },
  layout: {
    root: 'basicPage',
    structure: {
      basicPage: [],
    },
  },
  extensions: {},
};
