import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@mui/material'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            PG DEV GUIDE VIEW
          </h1>
          <p className="text-gray-700 mb-8">
            React + TypeScript + MUI + Tailwind + React Query + Zustand
          </p>
          <div className="flex gap-4">
            <Button variant="contained" color="primary">
              MUI Button
            </Button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Tailwind Button
            </button>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
