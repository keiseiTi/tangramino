import React, { useMemo } from 'react';

import {
  FreeLayoutProps,
  type WorkflowNodeProps,
  WorkflowNodeRenderer,
  // WorkflowNodeRenderer,
  // Field,
  useNodeRender,
} from '@flowgram.ai/free-layout-editor';

import { nodeRegistries } from '../node-registries';
import { initialData } from '../initial-data';

export const useEditorProps = () =>
  useMemo<FreeLayoutProps>(
    () => ({
      /**
       * Whether to enable the background
       */
      background: true,
      /**
       * Whether it is read-only or not, the node cannot be dragged in read-only mode
       */
      readonly: false,
      /**
       * Initial data
       * 初始化数据
       */
      initialData,
      /**
       * Node registries
       * 节点注册
       */
      nodeRegistries,
      /**
       * 节点数据转换, 由 ctx.document.fromJSON 调用
       * Node data transformation, called by ctx.document.fromJSON
       * @param node
       * @param json
       */
      fromNodeJSON(node, json) {
        return json;
      },
      /**
       * 节点数据转换, 由 ctx.document.toJSON 调用
       * Node data transformation, called by ctx.document.toJSON
       * @param node
       * @param json
       */
      toNodeJSON(node, json) {
        return json;
      },
      /**
       * Get the default node registry, which will be merged with the 'nodeRegistries'
       * 提供默认的节点注册，这个会和 nodeRegistries 做合并
       */
      getNodeDefaultRegistry(type) {
        return {
          type,
          meta: {
            defaultExpanded: true,
          },
          formMeta: {
            /**
             * Render form
             */
            render: () => <>dispatchEvent</>,
          },
        };
      },
      materials: {
        /**
         * Render Node
         */
        renderDefaultNode: (props: WorkflowNodeProps) => {
          const { form, node } = useNodeRender();
          return (
            <WorkflowNodeRenderer className='demo-free-node' node={props.node}>
              {form?.render()}
              {node.flowNodeType === 'condition' && (
                <div
                  data-port-id='if'
                  data-port-type='output'
                  style={{ position: 'absolute', right: 0, top: '33%' }}
                />
              )}
              {node.flowNodeType === 'condition' && (
                <div
                  data-port-id='else'
                  data-port-type='output'
                  style={{ position: 'absolute', right: 0, top: '66%' }}
                />
              )}
            </WorkflowNodeRenderer>
          );
        },
      },
      /**
       * Content change
       */
      onContentChange(ctx, event) {
        console.log('Auto Save: ', event, ctx.document.toJSON());
      },
      // /**
      //  * Node engine enable, you can configure formMeta in the FlowNodeRegistry
      //  */
      nodeEngine: {
        enable: true,
      },
      /**
       * Redo/Undo enable
       */
      history: {
        enable: true,
        enableChangeNode: true, // Listen Node engine data change
      },
      /**
       * Playground init
       */
      onInit: () => {},
      /**
       * Playground render
       */
      onAllLayersRendered(ctx) {
        //  Fitview
        ctx.document.fitView(false);
      },
      /**
       * Playground dispose
       */
      onDispose() {
        console.log('---- Playground Dispose ----');
      },
      plugins: () => [],
    }),
    [],
  );
