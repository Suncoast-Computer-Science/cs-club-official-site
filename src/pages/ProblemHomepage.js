import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, child, get } from 'firebase/database';
import { useAuth } from '../api/AuthContext';

import Header from '../components/Header';
import {
	testSubmission,
	gradeSubmission,
	getLastSubmission,
} from '../api/BackendRequests';

import ProblemHomepageHeader from '../components/ProblemHomepageHeader';
import SubmissionResultModal from '../components/SubmissionResultModal';
import Editor from '../components/Editor';
import ProblemSubmissionButtons from '../components/ProblemSubmissionButtons.js';
import ProblemData from '../components/ProblemData';
import ProblemLanguageSelector from '../components/ProblemLanguageSelector';
import { languageIdToName } from '../helpers/languages';

export default function ProblemHomepage() {
	const { db, currentUser } = useAuth();
	const { competitionId, problemId } = useParams();

	const sampleInputRef = useRef();

	const [problemData, setProblemData] = useState(null);
	const [testResponse, setTestResponse] = useState('');
	const [languageId, setLanguageId] = useState(71);
	const [userCode, setUserCode] = useState(
		"print('Hello World!') # Press the Test button!"
	);
	const [lastSubmissionData, setLastSubmissionData] = useState(null);
	const [showSubmissionResults, setShowSubmissionResults] = useState(false);
	const [passedAll, setPassedAll] = useState(false);
	const handleClose = () => setShowSubmissionResults(false);
	const handleShow = async (e) => {
		e.preventDefault();
		setShowSubmissionResults(true);
		if (currentUser?.uid) {
			const lastSubmissionRequest = await getLastSubmission(
				competitionId,
				problemId,
				currentUser.uid
			);
			setLastSubmissionData(lastSubmissionRequest.data);
		}
	};

	const updatePassedAllLastSubmission = () => {
		if (currentUser && lastSubmissionData && lastSubmissionData != 'error') {
			let allTrue = true;
			for (let result of lastSubmissionData.testcases) {
				if (result != 'Accepted') {
					allTrue = false;
					break;
				}
			}
			setPassedAll(allTrue);
			return;
		}
		setPassedAll(false);
	};

	const [isProcessing, setIsProcessing] = useState(false); // TODO: Render differently if currently processing a request

	useEffect(() => {
		const dataRequest = async () => {
			//const problemDataRequest = await db.ref(`problems/${problemId}/data`).once('value')
			const problemDataRequest = await get(
				child(ref(db), `problems/${problemId}/data`)
			);
			setProblemData(problemDataRequest.val());
		};
		dataRequest();
	}, []);

	useEffect(() => {
		const dataRequest = async () => {
			if (currentUser) {
				const lastSubmissionRequest = await getLastSubmission(
					competitionId,
					problemId,
					currentUser.uid
				);
				setLastSubmissionData(lastSubmissionRequest.data);
			}
		};
		dataRequest();
	}, [problemData]);

	useEffect(() => {
		updatePassedAllLastSubmission();
	}, [lastSubmissionData]);

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
			setIsProcessing(false);
		}
	};

	const onGradeSubmit = async (e) => {
		e.preventDefault();
		if (!isProcessing) {
			setIsProcessing(true);
			const response = await gradeSubmission(
				userCode,
				languageId,
				competitionId,
				problemId,
				currentUser.uid
			); // Returns an array with all the test case Results
			setLastSubmissionData(response.data);
			setIsProcessing(false);
			handleShow(e);
		}
	};

	return (
		<>
			<Header />
			<ProblemHomepageHeader problemData={problemData} />
			<div class='container-fluid p-4'>
				<div class='row'>
					<ProblemData problemData={problemData} />
					<div className='col-8' style={{ overflow: 'hidden' }}>
						<ProblemLanguageSelector
							languageId={languageId}
							setLanguageId={setLanguageId}
						/>
						<Editor
							value={userCode}
							setUserCode={setUserCode}
							language={languageIdToName(languageId)}
						/>
						<ProblemSubmissionButtons
							sampleInputRef={sampleInputRef}
							testResponse={testResponse}
							onTestSubmit={onTestSubmit}
							onGradeSubmit={onGradeSubmit}
							handleShow={handleShow}
							isProcessing={isProcessing}
							passedAll={passedAll}
						/>
					</div>
				</div>
			</div>
			<SubmissionResultModal
				show={showSubmissionResults}
				handleClose={handleClose}
				lastSubmissionData={lastSubmissionData}
			/>
		</>
	);
}
