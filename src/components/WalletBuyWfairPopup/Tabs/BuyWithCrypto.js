import React, { useEffect, useState } from 'react';
import styles from '../styles.module.scss';
import InputLineSeparator from '../../../data/images/input_line_separator.png';
import Dropdown from '../../Dropdown';
import { ReactComponent as ArrowUp } from '../../../data/icons/arrow_up_icon.svg';
import { ReactComponent as ArrowDown } from '../../../data/icons/arrow_down_icon.svg';
import { ReactComponent as BitcoinIcon } from '../../../data/icons/bitcoin-symbol.svg';
import { ReactComponent as EthereumIcon } from '../../../data/icons/ethereum-symbol.svg';
import { ReactComponent as LitecoinIcon } from '../../../data/icons/litecoin-symbol.svg';
import { convertCurrency } from '../../../api/index';
import classNames from 'classnames';
import { numberWithCommas } from '../../../utils/common';

const content = {
  bitcoin: `Send any amount of BTC to the following address. In the case of a non-instant deposit, 1 confirmation is required. We do not accept BEP20 from Binance.
Roobet does not accept bitcoin that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.`,
  ethereum: `Send any amount of ETH to the following address. In the case of a non-instant deposit, 1 confirmation is required. We do not accept BEP20 from Binance.
Roobet does not accept ethereum that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.`,
  litecoin: `Send any amount of LTC to the following address. In the case of a non-instant deposit, 1 confirmation is required. We do not accept BEP20 from Binance.
Roobet does not accept litecoin that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.`,
};
const cryptoShortName = {
  bitcoin: 'BTC',
  ethereum: `ETH`,
  litecoin: `LTC`,
};

const BuyWithCrypto = () => {
    const CURRENCY_OPTIONS = [
    {
      label: 'EUR',
      value: 0,
    },
    {
      label: 'USD',
      value: 1,
    },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [currency, setCurrency] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [activeTab, setActiveTab] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [url, setUrl] = useState('');
  const [transaction, setTransaction] = useState(false);

  useEffect(() => {
    currencyLostFocus();
  }, [activeTab, selectedCurrency]);

  const selectContent = event => {
    event.target.select();
  }

  const currencyChange = event => {
    const inputCurrency = event.target.value > 2000 ? 2000 : event.target.value;
    setCurrency(inputCurrency);
  }

  const currencyLostFocus = async (event) => {
    if (currency > 0) {

      const convertCurrencyPayload = {
        convertFrom: selectedCurrency.label.toLocaleUpperCase(),
        convertTo: cryptoShortName[activeTab],
        amount: currency
      };
      
      const { response } = await convertCurrency(convertCurrencyPayload);
      const { convertedAmount } = response?.data;
      const convertedTokenValue = !convertedAmount ? 0 : convertedAmount.toFixed(4);
    
      setTokenValue(convertedTokenValue);
    }
  }
    
  const OnClickConfirmAmount = () => {
    // const transak = {}
    // transakPopUp(transak);
    setAddress(
      'e94fc3db563b9e595f76bf7c3a90105a54ea4eaaf1ddb6b9950c31dc626d5d58'
    );
    setTransaction(!transaction)
  };

  const onCurrencyChange = val => {
    setSelectedCurrency(CURRENCY_OPTIONS.find(c => c.value === val));
  };
  
  return (
    <div className={styles.buyWithCryptoContainer}>
      {/* Crypto Tabs */}
      <div className={styles.cryptoTabsContianer}>
        <div
          className={classNames(
            styles.cryptoTab,
            activeTab === 'bitcoin' && styles.cryptoTabActive
          )}
          onClick={() => setActiveTab('bitcoin')}
        >
          <BitcoinIcon />
          <p>Bitcoin</p>
        </div>
        <div
          className={classNames(
            styles.cryptoTab,
            activeTab === 'ethereum' && styles.cryptoTabActive
          )}
          onClick={() => setActiveTab('ethereum')}
        >
          <EthereumIcon />
          <p>Ethereum</p>
        </div>
        <div
          className={classNames(
            styles.cryptoTab,
            activeTab === 'litecoin' && styles.cryptoTabActive
          )}
          onClick={() => setActiveTab('litecoin')}
        >
          <LitecoinIcon />
          <p>Litecoin</p>
        </div>
      </div>

      {/* Content */}
      <div className={styles.cryptoContent}>
        <p>{content[activeTab]}</p>
      </div>

      {/* Crypto Calculator */}
      <div className={styles.cryptoCalculatorContainer}>
        {/* Currency */}
        <div className={styles.cryptoInputContiner}>
          <input
            type="number"
            value={currency}
            min={1}
            max={2000}
            onChange={currencyChange}
            onBlur={currencyLostFocus}
            onClick={selectContent}
          />
          <div className={styles.inputRightContainer}>
            <div className={styles.innerContiner}>
              <Dropdown
                style={styles.dropdown}
                value={selectedCurrency.label}
                placeholder="Select currency..."
                setValue={onCurrencyChange}
                options={CURRENCY_OPTIONS}
              />
            </div>
          </div>
        </div>
        <div className={styles.InputLineSeparator}>
          <img src={InputLineSeparator} alt="input_line_separator" />
        </div>
        {/* WFAIR TOKEN */}
        <div className={styles.cryptoInputContiner}>
          <input disabled readonly value={tokenValue} />
          <div className={styles.inputRightContainer}>
            {activeTab === 'bitcoin' && <BitcoinIcon />}
            {activeTab === 'ethereum' && <EthereumIcon />}
            {activeTab === 'litecoin' && <LitecoinIcon />}
            {/* <img src={WallfairInput} alt="wallfair-input" /> */}
          </div>
        </div>
        <button
          className={styles.transankContineButton}
          onClick={OnClickConfirmAmount}
        >
          Confirm Amount
        </button>
      </div>
      {/* transaction Section */}
      <div className={styles.transactionContainer}>
        {transaction && (
          <div className={styles.transferSection}>
            <p>
              Please transfer the{' '}
              <span>
                {tokenValue} {cryptoShortName[activeTab]}
              </span>{' '}
              to the following {cryptoShortName[activeTab]} Address
            </p>
            <p>{address}</p>
            <h4>Send Transaction URL</h4>
            <div className={styles.cryptoUrlContiner}>
              <input
                type="text"
                value={url}
                placeholder="Paste URL here"
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            <button className={styles.sendUrlBtn}> Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyWithCrypto;
