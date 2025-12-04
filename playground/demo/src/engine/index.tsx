import React, { useMemo } from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { Button } from './components/button';
import { Container } from './components/container';
import { Text } from './components/text';
import schema from './schema.json';
import plugin from './plugin';

const ComponentMap = {
  button: Button,
  container: Container,
  text: Text,
};

const App = () => {
  const engine = useMemo(() => createEngine(schema), []);
  const plugins = useMemo(() => [plugin()], []);

  return (
    <div>
      <ReactView
        engine={engine}
        plugins={plugins}
        components={ComponentMap}
      />
    </div>
  );
};

export default App;
