import { useState, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { useAuth } from '../api/AuthContext';

import CompetitionCard from '../components/CompetitionCard';
import Header from '../components/Header';

export default function Competitions() {
	const [data, setData] = useState(null); // We have to get the competition data from the server
	const { db } = useAuth();

	useEffect(
		() =>
			get(child(ref(db), 'competitions')).then((snapshot) => {
				let competitions = [];
				snapshot.forEach((snap) => {
					const key = snap.key;
					const val = snap.val();
					const obj = { ...val, key };
					competitions.push(obj);
				});

				setData(competitions);
			}),
		[]
	); // Get data only once

	// This is broken since I've changed the format. Follow the format now in sample-database.json to fix this
	return (
		<>
			<Header />
			{data
				? data.map((val, i) => (
						<CompetitionCard
							name={val.name}
							date={val['end-date']}
							about={val.about}
							link={'/competitions/' + val.key}
							key={i}
						/>
				  ))
				: 'loading'}
		</>
	);
}
