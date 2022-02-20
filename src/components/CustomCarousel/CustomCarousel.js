import { Carousel } from 'react-responsive-carousel';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { OnboardingActions } from 'store/actions/onboarding';
import { dataLayerPush, trackWalletAddWfair } from 'config/gtm';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from 'components/Popup/PopupTheme';
import { GeneralActions } from 'store/actions/general';
import authState from 'constants/AuthState';
import Routes from 'constants/Routes';
import classNames from 'classnames';

const CustomCarousel = ({loggedIn, showWalletDepositPopup, handleKycInfoVisible, setOpenDrawer, userId, showPopup, phoneConfirmed}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const carouselLinks = [
      'create-events',
      'fun-events',
      'bonus',
  ];

  const onClickItem = itemIndex => {
    switch(carouselLinks[itemIndex]) {
      case 'create-events':
        if (loggedIn) {
          history.push(Routes.getRouteWithParameters(Routes.events, {category: 'all'}));

          if (phoneConfirmed) {
            showPopup(PopupTheme.eventForms, {});
          } else {
            dispatch(OnboardingActions.addPhoneNumber());
          }

        } else {
          dispatch(OnboardingActions.start());
          dataLayerPush({
            event:'gtm.click',
            'gtm.elementId': 'banner--create-events',
          });
        }
        break;
      case 'fun-events':
        history.push(Routes.getRouteWithParameters(Routes.events, {category: 'all'}));
        dataLayerPush({
          event:'gtm.click',
          'gtm.elementId': 'banner--fun-events',
        });
        break;
      case 'bonus':
        history.push(Routes.leaderboard);
        dataLayerPush({
          event:'gtm.click',
          'gtm.elementId': 'banner--bonus',
        });
        break;
    }
  };

  const renderDesktopSlides = () => {
    return (
      <Carousel
        className={styles.carousel}
        autoPlay
        interval={6500}
        transitionTime={800}
        infiniteLoop={true}
        stopOnHover={false}
        showArrows={true}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        onClickItem={onClickItem}
      >
      <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/slide_create_own_event.jpg?v=3`}
        />
      </div>
      {/* <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/slide_2_bg.jpg?v=3`}
        />
      </div>
      <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/slide_3_bg.jpg?v=3`}
        />
      </div> */}
    </Carousel>
    )
  }

  const renderMobileSlides = () => {
    return (
      <Carousel
        className={styles.carousel}
        autoPlay
        interval={6500}
        transitionTime={800}
        infiniteLoop={true}
        stopOnHover={false}
        showArrows={true}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        onClickItem={onClickItem}
      >
      <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/banner-1-mobile.jpg?v=3`}
        />
      </div>
      {/* <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/slide_2_bg.jpg?v=3`}
        />
      </div>
      <div>
        <img
          alt=""
          src={`https://files.wallfair.io/landingpage-carousel/slide_3_bg.jpg?v=3`}
        />
      </div> */}
    </Carousel>
    )
  }

  return <>
    <div className={classNames(styles.carouselContainer, styles.desktop)}>
      {renderDesktopSlides()}
    </div>
    <div className={classNames(styles.carouselContainer, styles.mobile)}>
      {renderMobileSlides()}
    </div>
  </>;
};

const mapStateToProps = state => {
  return {
    user: state.authentication,
    loggedIn: state.authentication.authState === authState.LOGGED_IN,
    userId: state.authentication.userId,
    phoneConfirmed: state.authentication.phoneConfirmed,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
    showWalletDepositPopup: () => {
      trackWalletAddWfair();
      dispatch(PopupActions.show({ popupType: PopupTheme.walletDeposit }));
    },
    handleKycInfoVisible: bool => {
      dispatch(GeneralActions.setKycInfoVisible(bool));
    },
    setOpenDrawer: drawerName => {
      dispatch(GeneralActions.setDrawer(drawerName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomCarousel);
