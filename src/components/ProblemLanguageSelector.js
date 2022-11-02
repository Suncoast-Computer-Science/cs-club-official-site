export default function ProblemLanguageSelector({ languageId, setLanguageId }) {
	return (
		<form>
			<div className='form-group row'>
				<label className='col-sm-1 offset-sm-9 col-form-label'>Language:</label>
				<div className='col-sm-2'>
					<select
						className='form-control'
						value={languageId}
						onChange={(e) => setLanguageId(e.target.value)}
					>
						<option selected value='71'>
							Python
						</option>
						<option selected value='76'>
							C++
						</option>
						<option selected value='50'>
							C
						</option>
						<option selected value='62'>
							Java
						</option>
					</select>
				</div>
			</div>
		</form>
	);
}
