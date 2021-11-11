import { useEffect, memo } from 'react';
import styles from './styles.module.scss';
import _ from 'lodash';
import { connect } from 'react-redux';
import BaseContainerWithNavbar from '../../components/BaseContainerWithNavbar';
import EventsCarouselContainer from '../../components/EventsCarouselContainer';
import Leaderboard from '../../components/Leaderboard';
import Lightbox from '../../components/Lightbox/Lightbox';
import UniswapContent from '../../components/Lightbox/UniswapContent';
import { Link, useLocation, useParams } from 'react-router-dom';
import { EventActions } from 'store/actions/event';
import { useIsMount } from 'components/hoc/useIsMount';
import Routes from 'constants/Routes';
import ContentFooter from '../../components/ContentFooter';
import { PopupActions } from '../../store/actions/popup';
import State from '../../helper/State';
import { getTradeById } from '../../api';
import ActivitiesTracker from '../../components/ActivitiesTracker';
import SocialIcons from 'components/SocialIcons';
import YellowButton from 'components/YellowButton';
import { GeneralActions } from '../../store/actions/general';
import {
  NEW_SLOTS_GAMES
} from '../../constants/Games';
import GameCards from '../../components/GameCards';
import SlotGameIconBg from '../../data/images/slot-game-icon-bg.png';


const Home = ({ tags, setOpenDrawer, fetchTags, showPopup, events }) => {
  const isMount = useIsMount();
  const { eventId, betId, tradeId } = useParams();
  const location = useLocation();
  let urlParams = new URLSearchParams(location.search);

  const renderBetApprovePopup = async () => {
    if (isMount) {
      if (eventId && betId && tradeId) {
        const event = State.getEventByTrade(betId, events);
        const bet = State.getTradeByEvent(betId, event);
        const tradeResponse = await getTradeById(tradeId).catch(err => {
          console.error("Can't get trade by id:", err);
        });

        const trade = _.get(tradeResponse, 'data', null);

        const options = {
          eventId: eventId,
          betId: betId,
          tradeId: tradeId,
          data: {
            bet: bet,
            trade: trade,
          },
          hideShare: true,
        };

        if (betId && tradeId && eventId) {
          showPopup('betApprove', options);
        }
      }
    }
  };

  const handleRefPersistent = () => {
    const ref = urlParams.get('ref');

    if (ref) {
      localStorage.setItem('urlParam_ref', ref);
    }
  };

  useEffect(() => {
    if (isMount) {
      fetchTags();
      renderBetApprovePopup();
      handleRefPersistent();
    }
  }, []);

  const renderHeadline = () => {
    return (
      <div className={styles.mainHeadline}>
        <h1>Betting Reimagined</h1>

        <div className={styles.slogan}>Clear, Social &amp; Fair</div>

        <SocialIcons
          className={styles.socialIcons}
          dataTrackingIds={{
            telegram: 'home-telegram',
            instagram: 'home-instagram',
            twitter: 'home-twitter',
          }}
        />
      </div>
    );
  };

  const onSeeLeaderboard = () => {
    window.scrollTo(0, 0);
    setOpenDrawer('leaderboard');
  };

  const renderTags = () => {
    return (
      <div className={styles.tags}>
        {tags &&
          tags.map((tag, index) => {
            return (
              <div key={index} className={styles.tag}>
                #{tag}
              </div>
            );
          })}
      </div>
    );
  };

  const renderRosiBanner = () => {
    return (
      <Link data-tracking-id="home-play-elon" to={Routes.elonGame}>
        <div className={styles.banner}>
          <div className={styles.title}>
            Play the
            <br />
            Elon Game
          </div>
          <YellowButton className={styles.button}>Play now</YellowButton>
        </div>
      </Link>
    );
  };

  const renderUniswap = () => {
    return (
      <div className={styles.lightboxWrapper}>
        <Lightbox>
          <UniswapContent />
        </Lightbox>
      </div>
    );
  };

  const renderCategoriesAndLeaderboard = () => {
    return (
      <div className={styles.bottomWrapper}>
        <div className={styles.categories}>
          <div className={styles.headline}>
            Activities{' '}
            <Link
              data-tracking-id="activities-see-all"
              className={styles.seeAllActivities}
              to={Routes.activities}
            >
              See all
            </Link>
          </div>
          <ActivitiesTracker />
          {/*<CategoryList categories={EVENT_CATEGORIES} />*/}
        </div>
        <div className={styles.leaderboard}>
          <div className={styles.headline}>
            Community Leaderboard
            <div
              className={styles.leaderboardLink}
              onClick={onSeeLeaderboard}
              data-tracking-id="leaderboard-see-leaderboard"
            >
              See Leaderboard
            </div>
          </div>
          <Leaderboard fetch={true} small={true} />
        </div>
      </div>
    );
  };

  const renderGamesCards= () => {
    return (
      <div className={styles.bottomWrapper}>
        <div className={styles.categories}>
          <GameCards
            games={NEW_SLOTS_GAMES}
            category={
              <div className={styles.sectionHeading}>
                <img src={SlotGameIconBg} width={150} alt={'Visit slot games'} />
                <h3>House Games</h3>
              </div>}
          />
        </div>

      </div>
    );
  };

  //if (!userLoggedIn) return <LandingPage />;

  return (
    <BaseContainerWithNavbar>
      {renderHeadline()}
      {/* <Header /> */}
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          {renderRosiBanner()}
          <EventsCarouselContainer eventType="non-streamed" />
          {/*<EventsCarouselContainer eventType="streamed" />*/}
          {renderGamesCards()}
          {renderCategoriesAndLeaderboard()}
          {renderUniswap()}

        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    tags: state.event.tags,
    events: state.event.events,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setOpenDrawer: drawerName => {
      dispatch(GeneralActions.setDrawer(drawerName));
    },
    fetchTags: () => {
      dispatch(EventActions.fetchTags());
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

const Connected = connect(mapStateToProps, mapDispatchToProps)(Home);
export default memo(Connected);
