import _ from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
// swiper bundle styles
import 'swiper/swiper-bundle.min.css';

// swiper core styles
import 'swiper/swiper.min.css';
// modules styles
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import SwiperCore, { Pagination, Navigation } from 'swiper';

import classNames from 'classnames';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useIsMount } from '../hoc/useIsMount';
import ActivityMessage from './ActivityMessage';
import { getNotificationEvents } from '../../api';

import { ACTIVITIES_TO_TRACK } from '../../constants/Activities';
import { NotificationActions } from '../../store/actions/notification';

SwiperCore.use([Navigation, Pagination]);

const ActivitiesTracker = ({
  className,
  messagesClassName,
  activities,
  addInitialActivities,
  showCategories,
  activitiesLimit,
}) => {
  const messageListRef = useRef();

  const [selectedCategory, setSelectedCategory] = useState(
    ACTIVITIES_TO_TRACK[0].value
  );

  const [initialLoaded, setInitialLoaded] = useState(false);

  const isMount = useIsMount();

  useEffect(() => {
    if (isMount) {
      (async () => {
        const initialActivities = await getNotificationEvents({
          limit: activitiesLimit || 10,
          category: selectedCategory,
        }).catch(err => {
          console.error("Can't get trade by id:", err);
        });

        addInitialActivities(initialActivities);
        setInitialLoaded(true);
      })().catch(err => {
        console.error('initialNotification error', err);
      });
    }
  }, [isMount, selectedCategory]);

  useEffect(() => {
    if (initialLoaded) {
      (async () => {
        const initialActivities = await getNotificationEvents({
          limit: activitiesLimit || 10,
          category: selectedCategory,
        }).catch(err => {
          console.error("Can't get trade by id:", err);
        });
        addInitialActivities(initialActivities);
      })().catch(err => {
        console.error('initialNotification error', err);
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    messageListScrollToBottom();
  }, [activities.length]);

  const renderActivities = () => {
    const selectedCategoryLower = selectedCategory.toLowerCase();
    const categoryCfg = _.find(ACTIVITIES_TO_TRACK, {
      value: selectedCategoryLower,
    });
    const categoryEvents = _.get(categoryCfg, 'eventsCats', []);
    // console.log("notifications", notifications);
    const categoryFiltered = _.filter(activities, item => {
      if (selectedCategoryLower === 'all') {
        return true;
      }

      return categoryEvents.indexOf(item.type) > -1;
    });

    return _.map(categoryFiltered, (activityMessage, index) => {
      let date = _.get(activityMessage, 'updatedAt');

      //try to get trade updatedAt date
      if (!date) {
        date = _.get(activityMessage, 'data.trade.updatedAt');
      }

      //try to get bet updatedAt date
      if (!date) {
        date = _.get(activityMessage, 'data.bet.date');
      }

      //try to get event updatedAt date
      if (!date) {
        date = _.get(activityMessage, 'data.event.date');
      }

      if (!date) {
        date = _.get(activityMessage, 'data.updatedAt');
      }

      return (
        <ActivityMessage key={index} activity={activityMessage} date={date} />
      );
    });
  };

  const categorySelectHandler = (activity, e) => {
    setSelectedCategory(activity.value);
  };

  const renderCategories = () => {
    return (
      <div className={styles.categoryList}>
        <div className={styles.swiperNavContainer}>
          <div className={styles.activitiesSwiperButtonNext}></div>
          <div className={styles.activitiesSwiperButtonPrev}></div>
        </div>
        <Swiper
          navigation={true}
          slidesPerView={8}
          spaceBetween={0}
          pagination={{
            clickable: true,
            type: 'progressbar',
          }}
          navigation={{
            nextEl: '.' + styles.activitiesSwiperButtonNext,
            prevEl: '.' + styles.activitiesSwiperButtonPrev,
          }}
          autoHeight={true}
          className={showCategories && classNames(styles.swiperElement)}
          // Responsive breakpoints
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 320px
            480: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // when window width is >= 480px
            992: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            // when window width is >= 480px
            1200: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {ACTIVITIES_TO_TRACK.map((activity, index) => (
            <SwiperSlide key={`swiper-slide-${index}`}>
              <div
                className={classNames(styles.boxIcon, {
                  [styles.categorySelected]:
                    selectedCategory === activity.value,
                })}
                role="button"
                tabIndex="0"
                onClick={e => {
                  categorySelectHandler(activity, e);
                }}
              >
                <img
                  src={activity.image}
                  alt={`category ${activity.value}`}
                  className={classNames(styles.imageIcon)}
                />
                <label className={classNames(styles.label)}>
                  {activity.category}
                </label>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  const messageListScrollToBottom = () => {
    if (messageListRef) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={classNames(styles.activitiesTrackerContainer, className)}>
      {showCategories && renderCategories()}
      <div
        className={classNames(messagesClassName, styles.messageContainer)}
        ref={messageListRef}
      >
        {renderActivities()}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    activities: state.notification.activities,
    user: state.authentication,
    connected: state.websockets.connected,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addActivity: (type, activity) => {
      dispatch(NotificationActions.addActivity({ type, activity }));
    },
    addInitialActivities: data => {
      const responseData = _.get(data, 'data', []);

      dispatch(
        NotificationActions.addInitialActivities({
          data: responseData,
        })
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesTracker);
