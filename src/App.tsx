import { Scene3D } from './ui/terrain/Scene3D'

function App() {
  return (
    <div className="w-full h-screen relative bg-gray-900">
      <Scene3D />
      <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg pointer-events-none">
        <h1 className="text-lg font-bold">Explorador de Terreno 3D</h1>
        <p className="text-sm text-gray-300">Puerto Varas, Chile</p>
      </div>
    </div>
  )
}

export default App
