import React from 'react';
import Grid from '@material-ui/core/Grid';
import styles from '../styles.module.scss';
import classNames from 'classnames';

const DepositRow = ({ data, hideSecondaryColumns = false }) => {
  const { wfair, fee, network, startDate, status, txHash } = data;
  return (
    <div className={styles.messageItem}>
      <Grid container>
        <Grid item xs>
          <div className={classNames(styles.messageFirst, styles.messageLeft)}>
            <p>{wfair}</p>
          </div>
        </Grid>
        <Grid
          item
          xs
          className={hideSecondaryColumns && styles.hideSecondaryColumns}
        >
          <div className={styles.messageCenter}>
            <p>{fee}</p>
          </div>
        </Grid>
        <Grid
          item
          xs
          className={hideSecondaryColumns && styles.hideSecondaryColumns}
        >
          <div className={styles.messageCenter}>{network}</div>
        </Grid>
        <Grid item xs>
         <div className={styles.messageCenter}>{startDate}</div>
        </Grid>
        <Grid item xs>
         <div 
          className={classNames(styles.messageLast, styles.messageRight)}
          >
            <p >{status}</p>
          </div>
        </Grid>
        <Grid item xs>
          <div 
          className={classNames(styles.messageLast, styles.messageRight)}
          >
            <p >{txHash}</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const WithDrawalsTable = ({ renderRow, className, hideSecondaryColumns = false }) => {
  return (
    <div className={classNames(styles.activitiesTrackerContainer, className)}>
      <div className={styles.header}>
        <Grid container>
          <Grid item xs>
            <p className={styles.titleFirst}>WFAIR</p>
          </Grid>
          <Grid
            item
            xs
            className={hideSecondaryColumns && styles.hideSecondaryColumns}
          >
            <p className={styles.title}>FEE</p>
          </Grid>
          <Grid
            item
            xs
            className={hideSecondaryColumns && styles.hideSecondaryColumns}
          >
            <p className={styles.title}>NETWORK</p>
          </Grid>
          <Grid
            item
            xs
            className={hideSecondaryColumns && styles.hideSecondaryColumns}
          >
            <p className={styles.title}>START DATE</p>
          </Grid>
          <Grid item xs>
            <p className={styles.titleLast}>STATUS</p>
          </Grid>
          <Grid item xs>
            <p className={styles.titleLast}>TXHASH</p>
          </Grid>
        </Grid>
      </div>
      <div className={styles.messageContainer}>
        {renderRow.map((row, index) => (
          <DepositRow data={row} key={index} />
        ))}
      </div>
    </div>
  );
};

export default WithDrawalsTable;