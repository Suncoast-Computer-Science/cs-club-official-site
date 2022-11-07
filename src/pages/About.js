import { CardGroup, Card, Col, Row, Container } from 'react-bootstrap';
import Header from '../components/Header';
import AboutCard from '../components/AboutCard';

const officerData = require('../officer-test-data.json');

export default function About() {
	return (
		<>
			<Header />

			{/* The About Paragraph */}
			<Container className='pt-5 pb-3'>
				<Row>
					<Col className='text-center'>
						<h1>About the Club</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						<p className='text-danger text-center'>Under Construction!</p>
					</Col>
				</Row>
				<Row>
					<Col className='text-center my-3'>
						<h2>Contact Us</h2>
						<h5 className='inline'></h5>
						<p className='m-0'>
							<b>Club Sponsor</b> - joshua.donato@palmbeachschools.org
						</p>
						<p className='m-0'>
							<b>Club Co-President</b> - rohit.dasgupta922@gmail.com
						</p>
					</Col>
				</Row>
			</Container>

			{/* Cards for club officers */}
			<Container fluid className='mx-auto bg-light'>
				<Row className='py-3'>
					<Col className='text-center'>
						<h2> Our Officers </h2>
					</Col>
				</Row>
				{officerData.map(({ year, officers }) => (
					<>
						<Row className='justify-content-center text-center py-2'>
							<p className='text-center'>{year}</p>
						</Row>
						<Row xs={1} md={2} lg={6} className='justify-content-center pb-3'>
							{officers.map(({ name, position, url }) => (
								<Col className='m-1'>
									<AboutCard name={name} position={position} url={url} />
								</Col>
							))}
						</Row>
					</>
				))}
			</Container>
		</>
	);
}
