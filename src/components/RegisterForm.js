import { React } from 'react';
import { Form, Button, OverlayTrigger } from 'react-bootstrap';

function RegisterForm({
	// TODO: make all the Refs and vars object
	validated,
	handleSubmit,
	nameRef,
	displayName,
	personalEmailRef,
	schoolEmail,
	gradeRef,
	consentRef,
}) {
	return (
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
			<Form.Group className='mb-3' controlId='formGroupPersonalEmail'>
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
	);
}

export default RegisterForm;
