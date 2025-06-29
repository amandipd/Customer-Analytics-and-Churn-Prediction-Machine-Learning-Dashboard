import { useState } from 'react'

function App() {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div>
        <button onClick={() => setTab(0)}>Prediction</button>
        <button onClick={() => setTab(1)}>Segmentation</button>
        <button onClick={() => setTab(2)}>Churn Risk</button>
      </div>
      <div>
        {tab === 0 && <div>Prediction View</div>}
        {tab === 1 && <div>Segmentation View</div>}
        {tab === 2 && <div>Churn Risk View</div>}
      </div>
    </div>
  )
}

export default App
