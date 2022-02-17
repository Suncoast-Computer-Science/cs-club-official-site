import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { useAuth } from "../api/AuthContext";

import ProblemCard from "../components/ProblemCard";
import Header from "../components/Header";
import CompetitionHomepageHeader from "../components/CompetitionHomepageHeader";

export default function CompetitionHomepage() {
  const { db } = useAuth();
  const dbRef = ref(db);
  const { id } = useParams();
  const [problemData, setProblemData] = useState([]);
  const [competitionData, setCompetitionData] = useState(null);

  useEffect(() => {
    const onMount = async () => {
      const snapshot = await get(child(dbRef, "competitions/" + id));
      let data = snapshot.val();
      setCompetitionData(data);

      let problems = [];
      for (let problem of data.problems) {
        //const snapshot = await db.ref('problems/' + problem + '/data').once("value")
        const snapshot = await get(
          child(dbRef, "problems/" + problem + "/data")
        );
        problems.push({ ...snapshot.val(), id: problem });
      }
      setProblemData(problems);
    };
    onMount();
  }, []);

  // useEffect(() => {
  //   if (!competitionData) return; // Ensure that this only runs once the data from the competition comes
  //   const getCompetitionData = async () => {

  //     console.log(competitionData.problems)
  //   }
  //   getCompetitionData()
  // }, [competitionData])

  return (
    <>
      <Header />
      <CompetitionHomepageHeader competitionData={competitionData} />
      {problemData.map((problem, index) => (
        <ProblemCard
          competitionId={id}
          problemId={problem.id}
          problemAuthor={problem.author}
          problemName={problem.name}
          problemInput={problem.input}
          problemOutput={problem.output}
          problemPreview={problem.preview}
          key={index}
        />
      ))}
    </>
  );
}
