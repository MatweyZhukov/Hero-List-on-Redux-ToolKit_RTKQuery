import { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import { selectAll } from '../heroesFilters/filtersSlice';
import { useCreateHeroMutation } from '../../api/apiSlice';

const HeroesAddForm = () => {
	const [heroName, setHeroName] = useState(''),
		[heroDescr, setHeroDescr] = useState(''),
		[heroElem, setHeroElem] = useState(''),
		{ filtersLoadingStatus } = useSelector(state => state.filters),
		filters = selectAll(store.getState());

	const [createHero] = useCreateHeroMutation();

	const submitCreateHero = (e) => {
		e.preventDefault();

		const newHero = {
			id: uuidv4(),
			name: heroName,
			description: heroDescr,
			element: heroElem
		};

		createHero(newHero).unwrap();

		setTimeout(() => {
			document.querySelector('li').style.opacity = 1;
		});

		setHeroName('');
		setHeroDescr('');
		setHeroElem('');
	};

	const renderFilters = (filters, status) => {
		if (status === 'loading') {
			return <option>Загрузка элементов</option>
		} else if (status === 'error') {
			<option>Ошибка загрузки</option>
		}

		if (filters && filters.length > 0) {
			return filters.map(({ name, label }) => {

				//eslint-disable-next-line
				if (name === 'all') return;

				return <option key={name} value={name}>{label}</option>;
			});
		}
	};

	return (
		<form onSubmit={submitCreateHero}
			className="border p-4 shadow-lg rounded">
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
				<input
					required
					type="text"
					name="name"
					className="form-control"
					id="name"
					placeholder="Как меня зовут?"
					value={heroName}
					onChange={(e) => setHeroName(e.target.value)} />
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">Описание</label>
				<textarea
					required
					name="text"
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					style={{ "height": '130px' }}
					value={heroDescr}
					onChange={(e) => setHeroDescr(e.target.value)} />
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">Выбрать элемент героя</label>
				<select
					required
					className="form-select"
					id="element"
					name="element"
					value={heroElem}
					onChange={(e) => setHeroElem(e.target.value)}>
					<option >Я владею элементом...</option>
					{renderFilters(filters, filtersLoadingStatus)}
				</select>
			</div>

			<button type="submit" className="btn btn-primary">Создать</button>
		</form>
	)
}

export default HeroesAddForm;