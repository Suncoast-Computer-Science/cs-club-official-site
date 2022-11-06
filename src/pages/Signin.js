import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Form,
	Button,
	Card,
	Container,
	Row,
	Col,
	Alert,
} from 'react-bootstrap';
import Header from '../components/Header';

import { useAuth } from '../api/AuthContext';

export default function Signin() {
	const navigate = useNavigate();
	const { signin } = useAuth();
	const [errorMessage, setErrorMessage] = useState(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	async function handleEvent(e) {
		e.preventDefault();
		const error = await signin();

		if (error) {
			setErrorMessage('Something went wrong!');
		} else {
			navigate('/');
		}
	}

	return (
		<>
			{/* Put this inside a card and make it look pretty*/}
			<Header />
			<Container>
				<Row>
					<Col>
						<Card
							className='mx-auto mt-5 d-flex align-items-center'
							style={{ width: '14rem' }}
						>
							<Card.Body>
								<Alert
									hidden={!errorMessage}
									variant='danger'
									style={{ fontSize: '11pt' }}
								>
									{errorMessage}
								</Alert>

								<Button
									className='m-auto d-flex align-items-center'
									variant='outline-primary'
									onClick={handleEvent}
									type='submit'
								>
									<img
										width='20px'
										alt='Google sign-in'
										src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'
									/>
									Sign in with Google
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
