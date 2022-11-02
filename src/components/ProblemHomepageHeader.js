export default function ProblemHomepageHeader({ problemData }) {
	if (problemData) {
		return (
			<>
				<div className='container-fluid bg-light text-dark p-2'>
					<div class='container bg-light p-4'>
						<h1 class='display-4'>{problemData.name}</h1>
						<p>{problemData.preview}</p>
					</div>
				</div>
			</>
		);
	} else {
		return <p>loading</p>;
	}
}
