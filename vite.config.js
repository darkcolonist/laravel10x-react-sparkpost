import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default ({mode}) => {

  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    // server: {
    //   host: true,
    //   hmr: {
    //     host: process.env.VITE_DEV_URL,
    //   },

    //   /**
    //    * the watch options below should be enabled if working behind a
    //    * docker instance
    //    */
    //   // watch: {
    //   //   usePolling: true,
    //   //   interval: 1000,
    //   // },
    // },
    plugins: [
      laravel(['resources/js/bootstrap.jsx']),
      react(),
    ]
  });
}
