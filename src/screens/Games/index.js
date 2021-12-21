import { useState } from 'react';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import styles from './styles.module.scss';
import {
  NEW_SLOTS_GAMES,
  SLOTS_GAMES,
  EXTERNAL_GAMES,
} from '../../constants/Games';
import GameCards from '../../components/GameCards';
import GameSmartsoft from '../../components/GameSmartsoft';
import { Grid } from '@material-ui/core';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';

const SearchSection = ({ setGames,
  alpacaGames,
setAlpacaGame,
externalGames,
setExternalGames,

 }) => {
  const gamesTitleList = [
    'Alpaca Games',
    'Casino',
    'Slot',
    // 'Board',
    'Keno',
    'All',
  ];
  const [search, setSearch] = useState('');

  const onChangeSearch = e => {
    const value = e.target.value;
    setSearch(value);


    const searchedAlpacaGame = alpacaGames.filter(game => {
      const match = game.title.toLowerCase().match(value.toLowerCase());
      return Array.isArray(match);
    });
    

    const searchedExternalGames = externalGames.filter(game => {
      const match = game.TechnicalName.toLowerCase().match(value.toLowerCase());
      return Array.isArray(match);
    });

    setAlpacaGame(searchedAlpacaGame);
    setExternalGames(searchedExternalGames);


  };

  const selectGame = (gameCategory, searched) => {
    if (gameCategory === 'All') {
      setGames();
      return;
    } else if (gameCategory === gamesTitleList[0]) {
      if (searched) {
      } else {
        setGames('alpaca');
      }
    } else {
      setGames('external', gameCategory);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <Grid container spacing={1} >
        <Grid item lg={4} md={8} sm={8} xs={12}>
          <div className={styles.search}>
            <input
              type="text"
              value={search}
              placeholder="Search"
              onChange={onChangeSearch}
            />
          </div>
        </Grid>
        {gamesTitleList.map((game, index) => {
          return (
            <Grid item key={index + game}>
              <p className={styles.searchItem} onClick={e => selectGame(game)}>
                {game}
              </p>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

const Games = () => {
  const showUpcoming = process.env.REACT_APP_SHOW_UPCOMING_FEATURES || 'false';
  const [alpacaGames, setAlpacaGame] = useState(
    showUpcoming ? NEW_SLOTS_GAMES : SLOTS_GAMES
  );
  const [externalGames, setExternalGames] = useState(EXTERNAL_GAMES);

  const setGames = (selectGame, gameCategory) => {
    if (selectGame) {
      const alpacaGamesDisplay =
        selectGame === 'alpaca'
          ? showUpcoming
            ? NEW_SLOTS_GAMES
            : SLOTS_GAMES
          : [];
      let externalGamesDisplay =
        selectGame === 'external' ? EXTERNAL_GAMES : [];

        if(gameCategory) {
          externalGamesDisplay = externalGamesDisplay.filter(game => {
            return game.GameCategory.split(' ')[0] === gameCategory;
          })
        }


      setAlpacaGame(alpacaGamesDisplay);
      setExternalGames(externalGamesDisplay);
      return;
    }
    setAlpacaGame(showUpcoming ? NEW_SLOTS_GAMES : SLOTS_GAMES);
    setExternalGames(EXTERNAL_GAMES);
  };

  return (
    <BaseContainerWithNavbar withPaddingTop={true} carousel>
        {/* <CustomCarousel /> */}
      <div className={styles.container}>
        {/* <ElonGame /> */}
        {/*
          <GameCards
            games={CASINO_GAMES}
            category="Elon Game"
            showHowtoLink={true}
          />
        */}
        <SearchSection
          setGames={setGames}
          alpacaGames={showUpcoming ? NEW_SLOTS_GAMES : SLOTS_GAMES}
          setAlpacaGame={setAlpacaGame}
          externalGames={EXTERNAL_GAMES}
          setExternalGames={setExternalGames}
        />

        {alpacaGames.length && (
          <GameCards games={alpacaGames} category="Alpaca Games" />
        )}

        {externalGames.length && (
          <GameSmartsoft games={externalGames} category="Slot Games" />
        )}
      </div>
    </BaseContainerWithNavbar>
  );
};

export default Games;
