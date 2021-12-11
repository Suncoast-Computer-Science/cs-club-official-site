import { Badge } from "react-bootstrap"
export default function({ competitionData }) {
  console.log(Date.now())
  if (competitionData) {
    return (
      <>
        <div className="container-fluid bg-light text-dark p-2" >
          <div class="container bg-light p-4">
            <h1 class="display-4">
              {competitionData.name}
            </h1>
            <h3>
              {competitionData['end-date'] > Date.now() ?
                <Badge pill bg="primary">Running</Badge>
                :
                <Badge pill bg="secondary">Finished!</Badge>
              }
              &nbsp;
              <Badge pill bg="primary">
                {competitionData['in-person'] ? "In-Person" : "Virtual"}
              </Badge>
            </h3>
            <p>
              {competitionData.about}
              <br />
              {competitionData['end-date'] > Date.now ?
                "Ended" : "Ends"}: {(new Date(competitionData['end-date']).toString())}
            </p>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <p>
        loading
      </p>
    )
  }
}
