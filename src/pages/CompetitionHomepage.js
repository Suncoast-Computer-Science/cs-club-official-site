import { useState, useEffect } from "react"
import { useAuth } from "../api/AuthContext"
import { useParams } from "react-router-dom"

import ProblemCard from '../components/ProblemCard'
import Header from '../components/Header'

export default function CompetitionHomepage() {
  const { db } = useAuth();
  const { id } = useParams()
  const [competitionData, setCompetitionData] = useState();
  const [problemData, setProblemData] = useState([]);

  useEffect(() => {
    db.ref('competitions/' + id).once("value", snapshot => {
      let data = snapshot.val()
      setCompetitionData(data)
    })
  }, [])

  useEffect(() => {
    if (!competitionData) return; // Ensure that this only runs once the data from the competition comes 

    console.log(competitionData.problems)
    let problems = []
    for (let problem of competitionData.problems) {
      db.ref('problems/' + problem + '/data').once("value", snapshot => {
        problems.push({ ...snapshot.val(), id: problem })
      }).then(() => {
        console.log(problems)
        setProblemData(problems)
      })
    }
  }, [competitionData])

  return (
    <>
      <Header />
      {problemData.map((problem) => <ProblemCard
        competitionId={id}
        problemId={problem.id}
        problemAuthor={problem.author}
        problemName={problem.name}
        problemInput={problem.input}
        problemOutput={problem.output}
        problemPreview={problem.preview}
      />)}
    </>
  )
}
