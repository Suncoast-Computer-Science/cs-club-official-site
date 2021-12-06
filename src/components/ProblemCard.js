export default function ProblemCard({ competitionId, problemId, problemAuthor, problemName, problemInput, problemOutput }) {
  return (
    <div>
      <a href={"/competitions/" + competitionId + '/' + problemId}>Go to Problem</a>
    </div>
  )
}
