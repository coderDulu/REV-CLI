import SpectrumItem from "../SpectrumItem"

const networkArr = [
  {
    network: 1,
  },
  {
    network: 2,
  },
]

function Index() {
  return (
    // <Test />
    <div className="w-full h-full pt-2 pb-10">
      {networkArr.map((item) => {
        return (
          <div key={item.network} className="float-left w-1/2 h-full min-w-1 min-h-1">
            <SpectrumItem network={item.network} />
          </div>
        )
      })}
    </div>
  )
}

export default Index
