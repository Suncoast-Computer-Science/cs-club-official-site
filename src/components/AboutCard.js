import { Card } from 'react-bootstrap'

function AboutCard({ about, url, name, position}) {
    return (
      <Card >
        <Card.Img variant="top" src={url}/>
        <Card.Body> 
            <Card.Title >{name}</Card.Title>
            <Card.Subtitle >{position}</Card.Subtitle>
            <Card.Text >{about}</Card.Text>
        </Card.Body> 
      </Card>
    )
}

export default AboutCard;