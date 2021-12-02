import styles from './styles.module.scss';
import classNames from 'classnames';
import Link from 'components/Link';
import AlpacaIcon from '../../data/images/house-games/title.svg';
import { PopupActions } from 'store/actions/popup';
import { connect } from 'react-redux';
import _ from 'lodash';

const GameSmartsoft = ({ games, category, showHowtoLink, showPopup }) => {
  const getGameItemSizeClass = () => {
    switch (games.length) {
      case 3:
        return styles.gameItemMd;
      case 4:
        return styles.gameItemSm;
      default:
        return styles.gameItemLg;
    }
  };

  return (
    <div className={styles.gamesContainer}>
      <div className={styles.gamesCategory}>
        <img src={AlpacaIcon} alt={'Alpaca Icon'} />
        <h2>{category}</h2>
      </div>
      <div className={styles.games}>
        {games.map((game, index) =>
          <div
            className={styles.wrapper}
            key={`gamecard-${index}-`}
          >
            <Link
              to={`/external-game/${game.GameName}/${game.GameCategory}`}
              className={classNames(
                styles.game,
                styles.gameLink
              )}
            >
              <div
                key={index}
                className={classNames(
                  styles.gameItem,
                  getGameItemSizeClass()
                )}
              >
                <img src={`https://www.smartsoftgaming.com/Content/Images/GameIcons/${game.GameName}.png`}/>
                <p className={styles.title}>{game.GameName}</p>
              </div>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
  };
};

export default connect(null, mapDispatchToProps)(GameSmartsoft);