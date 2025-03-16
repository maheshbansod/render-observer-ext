import { useState } from 'react'
import { Layout } from './components/Layout'
import { PopupView } from './components/PopupView'
import { SettingsView } from './components/SettingsView'

function App() {
  const [view, setView] = useState<'main' | 'settings'>('main')

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setView(view === 'main' ? 'settings' : 'main')}
          className="text-blue-500 hover:underline"
        >
          {view === 'main' ? 'Settings' : 'Back'}
        </button>
      </div>

      {view === 'main' ? <PopupView /> : <SettingsView />}
    </Layout>
  )
}

export default App
