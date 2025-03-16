import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import manifestJson from './manifest.json' with { type: "json" };
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const OUT_DIR = 'dist';
  return {
    plugins: [deno(), react(), tailwindcss(),
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
                        id: "css-view-ext@lightextensions"
                    }
                }
            } : manifestJson;
            
            try {
                await Deno.writeTextFile(
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
