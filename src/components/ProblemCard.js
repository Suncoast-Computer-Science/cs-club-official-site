// export default function ProblemCard({ competitionId, problemId, problemAuthor, problemName, problemInput, problemOutput }) {
//   return (
//     <div>
//       <a href={"/competitions/" + competitionId + '/' + problemId}>Go to Problem</a>
//     </div>
//   )
// }
import { Card, Button } from 'react-bootstrap';

export default function CompetitionCard({
	competitionId,
	problemId,
	problemAuthor,
	problemName,
	problemPreview,
}) {
	return (
		<Card className='m-2 border-primary'>
			<Card.Body>
				<Card.Title>{problemName}</Card.Title>
				<Card.Text>{problemPreview}</Card.Text>
				<Button
					variant='primary'
					href={'/competitions/' + competitionId + '/' + problemId}
				>
					Learn More
				</Button>
			</Card.Body>
			<Card.Footer className='text-muted'>Made by {problemAuthor}</Card.Footer>
		</Card>
	);
}
