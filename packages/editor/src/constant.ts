import type { Schema } from '@tangramino/engine';

export const defaultSchema: Schema = {
  elements: {
    basicPage: {
      type: 'basicPage',
      props: {},
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
