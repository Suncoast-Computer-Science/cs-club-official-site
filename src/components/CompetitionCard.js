import { Card, Button } from 'react-bootstrap'

export default function CompetitionCard({ name, date, about, link }) {
  return (
    <Card className="m-2 border-primary">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {about}
        </Card.Text>
        <Button variant="primary" href={link}>Learn More</Button>
      </Card.Body>
      <Card.Footer className="text-muted">Register by: {date}</Card.Footer>
    </Card>
  )
}
