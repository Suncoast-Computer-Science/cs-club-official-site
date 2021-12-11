export default function({ problemData }) {
  return (
    <div class="col-4" style={{ height: "100%", overflowY: "hidden" }}>
      {problemData ?
        <>
          <h2>Problem Statement</h2>
          <p>{problemData.statement}</p>

          <h2>Input</h2>
          <p>{problemData.input}</p>

          <h2>Output</h2>
          <p>{problemData.output}</p>

          {/*<p>{JSON.stringify(problemData)}</p> will show you everything available*/}
          <h3>Samples</h3>
          {problemData.samples.map(({ input, output, explanation }, i) =>
            <>
              <div class="card mb-2">
                <h5 class="card-header">Sample #{i + 1}:</h5>
                <div class="card-body container">
                  <div class="row">
                    <div class="col">
                      <p>Input: </p>
                      {input ?
                        <p class="card-text bg-dark text-light p-1">{input}</p>
                        :
                        <p><i>No Input!</i></p>
                      }
                    </div>
                    <div class="col">
                      <p>Output: </p>
                      <p class="card-text bg-dark text-light p-1">{output}</p>
                    </div>
                  </div>
                </div>
                {explanation ?
                  <>
                    <p>Explanation: {explanation}</p>
                  </> : <> </>}
              </div>
            </>)}

        </>
        :
        <> </>
      }

    </div>
  )
}
