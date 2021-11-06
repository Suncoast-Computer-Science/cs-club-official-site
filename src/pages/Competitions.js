import { useState, useEffect } from "react"
import { useAuth } from "../api/AuthContext"

import CompetitionCard from '../components/CompetitionCard'
import Header from '../components/Header'

export default function Competitions() {
  const [data, setData] = useState(null) // We have to get the competition data from the server 
  const { db } = useAuth()

  useEffect(() =>
    db.ref("competitions").once("value", snapshot => {
      let competitions = []
      snapshot.forEach(snap => {
        const key = snap.key
        const val = snap.val()
        const obj = { ...val, key }
        competitions.push(obj)
      })
      setData(competitions)
    }), []
  ) // Get data only once

  return (
    <>
      <Header />
      {data ?
        data.map((val, i) =>
          <CompetitionCard name={val.name} date={val.startDate} about={val.about} link={"/competitions/" + val.key} key={i} />
        )
        :
        "loading"
      }

    </>
  )
}
