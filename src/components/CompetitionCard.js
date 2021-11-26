import { Card, Button } from 'react-bootstrap'

export default function CompetitionCard({ name, date, about, link }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {about}
        </Card.Text>
        <Button variant="primary" href={link}>Learn More</Button>
      </Card.Body>
    </Card>
  )
}
