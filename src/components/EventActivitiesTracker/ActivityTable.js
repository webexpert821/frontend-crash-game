import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import Grid from '@material-ui/core/Grid';
import ActivityTableRow from './ActivityTableRow';

const ActivityTable = ({ rowData, gameLabel, hideSecondaryColumns = false }) => {
  return (
    <div className={styles.activitiesTrackerContainer}>
      <div className={styles.header}>
        <Grid container>
          <Grid item xs>
            <p className={styles.titleFirst}>GAME</p>
          </Grid>
          <Grid item xs className={hideSecondaryColumns && styles.hideSecondaryColumns}>
            <p className={styles.title}>USER</p>
          </Grid>
          <Grid item xs className={hideSecondaryColumns && styles.hideSecondaryColumns}>
            <p className={styles.title}>TRADE</p>
          </Grid>
          <Grid item xs className={hideSecondaryColumns && styles.hideSecondaryColumns}>
            <p className={styles.title}>MULT</p>
          </Grid>
          <Grid item xs >
            <p className={styles.titleLast}>CASHOUT</p>
          </Grid>
        </Grid>
      </div>

      <div className={styles.messageContainer}>
        {rowData.map((r, i) => (
          <ActivityTableRow
            key={r.gameHash + i}
            data={r}
            gameLabel={gameLabel}
            hideSecondaryColumns={hideSecondaryColumns}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityTable;