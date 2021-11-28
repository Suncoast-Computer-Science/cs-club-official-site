import { CardGroup, Card, Col, Row, Container} from 'react-bootstrap'
import Header from "../components/Header"
import AboutCard from "../components/AboutCard"

const officerData = require('../officer-test-data.json')

export default function About() {
  return (
    <>
      <Header />

      {/* The About Paragraph */}
      <Container className='pt-5 pb-3'>
        <Row >
          <Col className='text-center'>
            <h1 >About the Club</h1> 
          </Col>
        </Row>
        <Row >
          <Col className='pt-4'>
            <p >This is a testLorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Ut facilisis leo in quam dictum gravida. Fusce sed congue orci, eget auctor nulla. Suspendisse ac elit lectus. Fusce a arcu semper, lobortis nulla sit amet, 
              rutrum massa. This is a testLorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Ut facilisis leo in quam dictum gravida. Fusce sed congue orci, eget auctor nulla. Suspendisse ac elit lectus. Fusce a arcu semper, lobortis nulla sit amet, 
              rutrum massa.  
            </p> 
          </Col>
        </Row> 
      </Container>

      {/* Cards for club officers  */}
      <Container fluid className="mx-auto bg-light">
        <Row className="py-3">
          <Col className="text-center">
            <h2> Meet Our Officers </h2>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={5} className="justify-content-center pb-3"> 
          {officerData.map((element) => (
              <Col style={{ width:'25rem' }} className='m-1'>
                <AboutCard about={ element.about } name={ element.name } position= { element.position } url={ element.url } />
              </Col>
          ))} 
        </Row>
       </Container>
      </>
    )
  }
