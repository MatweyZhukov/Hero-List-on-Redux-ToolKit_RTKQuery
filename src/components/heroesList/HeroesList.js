import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {
	const {
		data: heroes = [],
		isLoading,
		isError
	} = useGetHeroesQuery();

	const [deleteHero] = useDeleteHeroMutation(),

		activeFilter = useSelector(state => state.filters.activeFilter),

		filteredHeroes = useMemo(() => {
			const filteredHeroes = heroes.slice();

			if (activeFilter === 'all') {
				return filteredHeroes;
			} else {
				return filteredHeroes.filter(item => item.element === activeFilter);
			}

			//eslint-disable-next-line
		}, [heroes, activeFilter]);

	const submitDeleteHero = useCallback((id, target) => {
		target.style.opacity = 0;

		setTimeout(() => {
			deleteHero(id);
		}, 300)

		// eslint-disable-next-line
	}, []);

	if (isLoading) {
		return <Spinner />;
	} else if (isError) {
		return <h5 className="text-center mt-5">Ошибка при загрузки</h5>;
	}

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Герои не обнаружены</h5>;
		}

		return arr.map(({ id, ...props }) => {
			return <HeroesListItem key={id} {...props} onDeleteHero={(e) => submitDeleteHero(id, e.target.closest('li'))} />
		});
	};

	const elements = renderHeroesList(filteredHeroes);

	return (
		<ul>
			{elements}
		</ul>
	);
};

export default HeroesList;