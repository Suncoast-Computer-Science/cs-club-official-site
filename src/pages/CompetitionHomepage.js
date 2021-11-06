import { useState, useEffect } from "react"
import { useAuth } from "../api/AuthContext"
import { useParams } from "react-router-dom"
import Header from '../components/Header'

export default function CompetitionHomepage() {
  const { db } = useAuth();
  const { id } = useParams()
  const [competitionData, setCompetitionData] = useState();
  const [problemData, setProblemData] = useState([]);

  useEffect(() => {
    db.ref('competitions/' + id).once("value", snapshot => {
      let data = snapshot.val()
      data.problems = data.problems.slice(1, data.problems.length - 1).split(", ") // Will update firebase problems later to be more compact (without surrounding [] and ', ')
      setCompetitionData(data)
    })
  }, [])

  useEffect(() => {
    if (!competitionData) return; // Ensure that this only runs once the data from the competition comes 

    console.log(competitionData)
    let problems = []
    // for (let problem of competitionData.problems) {
    //   db.ref('problems/' + problem).once("value", snapshot => {
    //     problems.append({...snap})
    //   })
    // }
    setProblemData()
  }, [competitionData])

  return (
    <>
      <Header />
      {id}
    </>
  )
}
