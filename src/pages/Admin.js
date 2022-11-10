import { useEffect, useState, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

import Header from '../components/Header';
import { useAuth } from '../api/AuthContext';
import Editor from '../components/Editor';
import ProblemLanguageSelector from '../components/ProblemLanguageSelector';
import { languageIdToName } from '../helpers/languages';
import ProblemSubmissionButtons from '../components/ProblemSubmissionButtons';

import { testSubmission } from '../api/BackendRequests';

const Admin = () => {
	const { db } = useAuth();
	const [userCode, setUserCode] = useState('');
	const [languageId, setLanguageId] = useState(71);

	const sampleInputRef = useRef();
	const [testResponse, setTestResponse] = useState('');
	const [isProcessing, setIsProcessing] = useState(false); // TODO: Render differently if currently processing a request
	const [executionTime, setExecutionTime] = useState(null);

	const onTestSubmit = async (e) => {
		e.preventDefault();
		if (!isProcessing) {
			setIsProcessing(true);
			const response = await testSubmission(
				userCode,
				languageId,
				sampleInputRef.current.value
			);
			if (response.status.description === 'Accepted') {
				setTestResponse(response.stdout);
			} else {
				setTestResponse(response.status.description); // Do more stuff if there is an issue
			}
			setExecutionTime(response.time);
			setIsProcessing(false);
		}
	};

	return (
		<>
			<Header />
			<Card>
				<Form>
					<Form.Group className='mb-3'>
						<Form.Label>Problem Name</Form.Label>
						<Form.Control placeholder='Hello CS Club!' />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Problem Id</Form.Label>
						<Form.Control placeholder='hello-world' />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Author</Form.Label>
						<Form.Control placeholder='Rohit Dasgupta' />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Preview Description</Form.Label>
						<Form.Control placeholder='Explain the basics of using this app!' />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Statement</Form.Label>
						<Form.Control
							as='textarea'
							placeholder="Rohit has a very busy job greeting all the contestants who have shown up to the Suncoast December 14th Competition. Help him gree these users by sending a custom message saying 'Hello, ___!' where he he can customize the name"
							rows={5}
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Output Explanation</Form.Label>
						<Form.Control
							as='textarea'
							placeholder='Take in a single string'
							rows={5}
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Input Explanation</Form.Label>
						<Form.Control
							as='textarea'
							placeholder="Print 'Hello, [Insert Name here]!' to standard output, where you replace [Insert Name here] with the string you received from standard input"
							rows={5}
						/>
					</Form.Group>
				</Form>
				<ProblemLanguageSelector
					languageId={languageId}
					setLanguageId={setLanguageId}
				/>
				<Editor
					language={languageIdToName(languageId)}
					setUserCode={setUserCode}
					value={userCode}
				/>
				<ProblemSubmissionButtons
					sampleInputRef={sampleInputRef}
					testResponse={testResponse}
					onTestSubmit={onTestSubmit}
					disableSubmission={true}
					isProcessing={isProcessing}
				/>
				<p>Execution Time: {executionTime}</p>
			</Card>
		</>
	);
};

export default Admin;
