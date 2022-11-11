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

export default function Signin() {
	const navigate = useNavigate();
	const { register, currentUser } = useAuth();
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

								<Form validated={validated} onSubmit={handleSubmit}>
									<Form.Group className='mb-3' controlId='formGroupName'>
										<Form.Label>Full Name</Form.Label>
										<Form.Control
											required
											type='text'
											ref={nameRef}
											placeholder='Name'
											defaultValue={displayName}
										/>
									</Form.Group>
									<Form.Group
										className='mb-3'
										controlId='formGroupPersonalEmail'
									>
										<OverlayTrigger
											placement='right'
											delay={{ show: 250, hide: 400 }}
											overlay={(props) => (
												<Tooltip {...props}>
													So we can email you without getting blocked!
												</Tooltip>
											)}
										>
											<Form.Label>
												Personal Email Address<b> (?) </b>
											</Form.Label>
										</OverlayTrigger>
										<Form.Control
											required
											type='email'
											ref={personalEmailRef}
											placeholder='Enter school email'
											defaultValue={schoolEmail}
										/>
									</Form.Group>
									<Form.Group className='mb-3' controlId='formGroupGrade'>
										<Form.Label>Grade level</Form.Label>
										<Form.Select required ref={gradeRef}>
											<option value='' disabled selected hidden>
												Select a grade
											</option>
											{['9th', '10th', '11th', '12th', 'Other'].map((grade) => (
												<option value={grade}>{grade}</option>
											))}
										</Form.Select>
										<div className='mt-4'>
											<Form.Check
												required
												className='d-inline'
												ref={consentRef}
												type='switch'
											/>
											<p className='d-inline mx-2'>
												Agree to recieve emails from Suncoast CS Club
											</p>
										</div>
									</Form.Group>
									<Button variant='primary' type='submit'>
										Confirm
									</Button>
								</Form>
							</Card.Body>
							{/*  TODO: implement log out  */}
							<Card.Footer>
								<Card.Link href='/signin' style={{ textDecoration: 'none' }}>
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
