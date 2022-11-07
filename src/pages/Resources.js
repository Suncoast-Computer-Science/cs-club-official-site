import { Col, Row, Container, Button } from 'react-bootstrap';
import Header from '../components/Header';

const resourceData = require('../test-resources-data.json');

const Resources = () => {
	// TODO: Make a json file and map over to create programming resource rows
	return (
		<>
			<Header />
			<Container className='mt-3'>
				<Row>
					<Col>
						<p className='text-danger text-center'>Under Construction!</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h1 className='text-center'>Programming Resources</h1>
					</Col>
				</Row>
			</Container>
			<Container fluid className='mx-auto mb-5'>
				{resourceData.map(({ title, description, url }, index) => (
					<Row
						// The logic just alternates gray and white backgrounds
						className={
							index % 2 === 0 ? 'bg-light my-3 px-3 py-3' : 'my-3 px-3 py-3'
						}
					>
						<Col>
							<h2>{title}</h2>
							<hr></hr>
							<p className='w-75'>{description}</p>
							<Button
								variant='outline-primary'
								href={url}
								target={'_blank'}
								rel={'noreferrer noopener'}
							>
								Visit
							</Button>
						</Col>
					</Row>
				))}
			</Container>
		</>
	);
};

export default Resources;
