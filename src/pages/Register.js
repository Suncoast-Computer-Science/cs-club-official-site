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
	OverlayTrigger,
	Tooltip,
} from 'react-bootstrap';
import Header from '../components/Header';

import { useAuth } from '../api/AuthContext';
import RegisterForm from '../components/RegisterForm';

export default function Signin() {
	const navigate = useNavigate();
	const { register, signout, currentUser } = useAuth();
	const [errorMessage, setErrorMessage] = useState(null);
	const [validated, setValidated] = useState(false);
	// The final data for `personalEmail`, `name`, `grade`, `consent`, and eventually `highschool` will be read from the form.
	// Data from `user` object is needed to initially fill in the form default values if applicaple + to get access to the `schoolEmail` and `userId`

	// The references to get data from forms
	const personalEmailRef = useRef(null);
	const nameRef = useRef(null);
	const gradeRef = useRef(null);
	const consentRef = useRef(null);
	const schoolRef = useRef(null); //TODO: implement highschool select

	// Variables for data from `user` object
	let displayName;
	let schoolEmail;
	let userId;
	let photoURL;

	if (currentUser) {
		displayName = currentUser.displayName;
		schoolEmail = currentUser.email;
		userId = currentUser.uid;
		photoURL = currentUser.photoURL;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		// Check if form is validated (filled in)
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
		}

		setValidated(true);

		const personalEmail = personalEmailRef.current.value;
		const name = nameRef.current.value;
		const grade = gradeRef.current.value;
		const consent = consentRef.current.value;
		const error = await register(
			userId,
			name,
			schoolEmail,
			personalEmail,
			photoURL,
			grade,
			consent
		);

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
							className='mx-auto mt-5'
							style={{ width: '50rem', height: '35rem' }}
						>
							<Card.Header as='h4' className='text-center'>
								Register
							</Card.Header>
							<Card.Body>
								<Card.Title className='text-center'>
									Confirm your information
								</Card.Title>
								<Alert hidden={!errorMessage} variant='warning'>
									{errorMessage}
								</Alert>
								<RegisterForm
									// TODO: probably should make this an object and unwrap or something
									validated={validated}
									handleSubmit={handleSubmit}
									nameRef={nameRef}
									displayName={displayName}
									personalEmailRef={personalEmailRef}
									schoolEmail={schoolEmail}
									gradeRef={gradeRef}
									consentRef={consentRef}
								/>
							</Card.Body>
							<Card.Footer>
								<Card.Link
									href='/signin'
									onClick={(e) => signout()}
									style={{ textDecoration: 'none' }}
								>
									Don't want to register? Log out.
								</Card.Link>
							</Card.Footer>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
