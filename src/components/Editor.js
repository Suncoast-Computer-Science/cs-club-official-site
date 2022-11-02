import MonacoEditor from '@monaco-editor/react';

export default function Editor({ language, value, setUserCode }) {
	language = language;
	return (
		<MonacoEditor
			width='100%'
			height='600px'
			theme='vs-dark'
			language={language}
			value={value}
			onChange={(e) => setUserCode(e)}
		/>
	);
}
