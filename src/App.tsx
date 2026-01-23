import AppRouter from './router'
import { Button } from 'antd'
import { Suspense, lazy } from 'react'
const PageLoading = lazy(() => import('./components/loading'))
function App() {
  return (
    <>
      <Suspense fallback={<PageLoading></PageLoading>}>
        <AppRouter />
      </Suspense>
    </>
  )
}

export default App
