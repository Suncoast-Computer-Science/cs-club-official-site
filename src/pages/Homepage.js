import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';

import Header from '../components/Header';

export default function Homepage() {
	return (
		<>
			<Header />

			<Container className='pt-3 my-2'>
				<Card>
					<Card.Body className='px-4'>
						<h1 className='text-center'>CS Club Competition Portal</h1>
						<p className='text-center'>
							Welcome to the CS Club website! We competitions here. Click the
							competitions tab to try some practice problems.
						</p>
						<Button
							className='m-2 d-flex justify-content-center text-center'
							href='competitions'
						>
							Compete!
						</Button>
					</Card.Body>
				</Card>
			</Container>
		</>
	);
}
