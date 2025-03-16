import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import manifestJson from './manifest.json' with { type: "json" };
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const OUT_DIR = 'dist';
  return {
    plugins: [react(), tailwindcss(),
    {
        name: 'copy-manifest',
        async closeBundle() {
            console.info("Copying manifest file");
            const finalManifest = mode === 'firefox' ? {
                ...manifestJson,
                ...('background' in manifestJson
                  && typeof manifestJson.background === 'object'
                  && manifestJson.background !== null
                  && 'service_worker' in manifestJson.background ? {background: {
                    scripts: [manifestJson.background.service_worker],
                }} : {}),
                browser_specific_settings: {
                    gecko: {
                        id: "render-observer-ext@lightextensions"
                    }
                }
            } : manifestJson;
            
            try {
                fs.writeFileSync(
                    `${OUT_DIR}/manifest.json`, 
                    JSON.stringify(finalManifest)
                );
                console.info("Manifest file written");
            } catch (err) {
                console.error("Couldn't write the manifest file");
                console.error(err);
            }
        },
    }
    ],
    build: {
      rollupOptions: {
        input: {
          popup: './popup.html'
        }
      }
    }
  }
})
