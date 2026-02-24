// import { config } from 'dotenv';
import { defineConfig } from 'orval';

// config({ path: '.env' });

export default defineConfig({
  client: {
    input: 'http://localhost:5000/openapi.yaml',
    output: {
      target: 'src/api/generated',
      schemas: './src/api/generated',
    },
  },
});
